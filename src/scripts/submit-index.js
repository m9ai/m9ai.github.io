#!/usr/bin/env node
/**
 * 向搜索引擎推送站内 URL。
 *
 * 先说清楚能力边界，避免误以为「跑一次就收录了」：
 *
 * ┌──────────┬──────────────────────────────────────────────────────────┐
 * │ Bing 系  │ 有真正的推送通道：IndexNow 协议。一次 POST 即可让 Bing、   │
 * │          │ Yandex、Seznam、Naver 立刻排进抓取队列。本脚本主力就干这个。│
 * ├──────────┼──────────────────────────────────────────────────────────┤
 * │ Google   │ 没有可用的通用推送 API。                                  │
 * │          │ - 老的 google.com/ping?sitemap= 已于 2023 年下线，现在 404；│
 * │          │ - Indexing API (urlNotifications:publish) 官方只对         │
 * │          │   JobPosting / BroadcastEvent 两类结构化数据保证生效，      │
 * │          │   普通页面调用会返回 200 但被忽略（--google-publish 默认关）；│
 * │          │ - 真正生效的是「在 Search Console 里登记一次 sitemap」，     │
 * │          │   之后靠抓取发现。本脚本用 URL Inspection API 做只读体检，   │
 * │          │   告诉你哪些 URL 还没被收录、卡在什么状态。                 │
 * └──────────┴──────────────────────────────────────────────────────────┘
 *
 * 用法：
 *   INDEXNOW_KEY=<key> node src/scripts/submit-index.js
 *   node src/scripts/submit-index.js --dry-run                 # 只打印待推送清单
 *   node src/scripts/submit-index.js --limit 50                # 只推前 50 条（试跑用）
 *   node src/scripts/submit-index.js --changed                 # 只推本次 git 变更涉及的 URL
 *   node src/scripts/submit-index.js --google-inspect          # 附带 Google 收录体检
 *
 * 环境变量（非敏感信息可放仓库 Variables，服务账号密钥必须放 Secrets）：
 *   INDEXNOW_KEY                 IndexNow 密钥，需与站点根目录的 <key>.txt 内容一致
 *   INDEXNOW_ENDPOINT            默认 https://api.indexnow.org/indexnow
 *   GOOGLE_SERVICE_ACCOUNT_JSON  Google 服务账号 JSON（原始字符串或 base64），只读体检用
 *   GOOGLE_SITE_URL              Search Console 资源，如 sc-domain:m9ai.work
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const SITE_URL = 'https://m9ai.work';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap-0.xml');
/** IndexNow 单次请求上限，超过要分批。 */
const INDEXNOW_BATCH = 10000;

/* ------------------------------------------------------------------ 参数 */

function parseArgs(argv) {
  const args = {
    dryRun: false,
    changed: false,
    googleInspect: false,
    googlePublish: false,
    limit: 0,
    sample: 10,
  };
  for (let i = 0; i < argv.length; i += 1) {
    switch (argv[i]) {
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--changed':
        args.changed = true;
        break;
      case '--google-inspect':
        args.googleInspect = true;
        break;
      case '--google-publish':
        args.googlePublish = true;
        break;
      case '--limit':
        args.limit = Number(argv[i + 1]) || 0;
        i += 1;
        break;
      case '--sample':
        args.sample = Number(argv[i + 1]) || 10;
        i += 1;
        break;
      case '--help':
      case '-h':
        console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
        process.exit(0);
        break;
      default:
        break;
    }
  }
  return args;
}

/* ---------------------------------------------------------- URL 来源 */

function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP_FILE)) {
    throw new Error(`找不到 ${SITEMAP_FILE}，请先跑一次 pnpm build（postbuild 会生成 sitemap）`);
  }
  const xml = fs.readFileSync(SITEMAP_FILE, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/** 收集变更文件：CI 里取上一个提交，本地取未提交的工作区改动，两者并集。 */
function changedFiles() {
  const files = new Set();

  const collect = (command) => {
    try {
      const out = execSync(command, { encoding: 'utf8' });
      for (const line of out.split('\n')) {
        // 去掉 porcelain 前缀（M / A / ?? 等）
        const file = line.trim().replace(/^[^A-Za-z]*\s*/, '');
        if (file) files.add(file);
      }
    } catch {
      // 没有 origin/main、只有一个提交等情况，忽略即可
    }
  };

  // 上一个提交：CI 里 push 到 main 后 HEAD 就是 origin/main，只能跟 HEAD~1 比
  collect('git diff --name-only HEAD~1 HEAD');
  // 工作区未提交的改动（本地试跑时用得上）
  collect('git status --porcelain');

  return [...files];
}

/** 只推本次改动涉及的 URL：把变更文件映射回可能的站点路径。 */
function readChangedUrls(allUrls) {
  const fragments = [];
  // 文案改了几乎等于全站内容都变了，直接整站重推
  let matchAll = false;

  for (const file of changedFiles()) {
    // public/docs/<slug>.md -> 该文档的两语页面
    const doc = file.match(/^public\/docs\/(.+?)(-en)?\.md$/);
    if (doc) {
      fragments.push(`/docs/${doc[1]}`);
      continue;
    }
    // 数据改了，聚合页与其下所有详情页内容都变了
    if (file === 'src/data/services.ts') fragments.push('/services');
    if (file === 'src/data/cases.ts') fragments.push('/cases/');
    if (file === 'src/data/skills.ts') fragments.push('/store', '/apps/');
    if (/^src\/messages\//.test(file)) matchAll = true;
  }

  if (matchAll) return allUrls;
  if (!fragments.length) return [];
  return allUrls.filter((url) => fragments.some((fragment) => url.includes(fragment)));
}

/* ------------------------------------------------------ IndexNow 推送 */

function assertKeyFile(key) {
  const keyFile = path.join(PUBLIC_DIR, `${key}.txt`);
  if (!fs.existsSync(keyFile)) {
    throw new Error(
      `缺少密钥文件 ${keyFile}。IndexNow 要求在站点根目录放一个内容等于密钥的 <key>.txt，` +
        `否则 Bing 会拒绝推送。`,
    );
  }
  const contents = fs.readFileSync(keyFile, 'utf8').trim();
  if (contents !== key) {
    throw new Error(`${keyFile} 的内容与 INDEXNOW_KEY 不一致，Bing 校验会失败。`);
  }
}

async function submitIndexNow(urls, key, { dryRun, endpoint }) {
  const batches = [];
  for (let i = 0; i < urls.length; i += INDEXNOW_BATCH) {
    batches.push(urls.slice(i, i + INDEXNOW_BATCH));
  }

  if (dryRun) {
    console.log(`[indexnow] dry-run：将分 ${batches.length} 批推送 ${urls.length} 条 URL`);
    return { submitted: 0, batches: batches.length };
  }

  let submitted = 0;
  for (const [index, batch] of batches.entries()) {
    const body = {
      host: new URL(SITE_URL).host,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList: batch,
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    /* IndexNow 的语义比较松：
       200 已提交、202 已入队；429 是限流；403 基本都是密钥或 keyLocation 对不上。
       无论哪种都不重试到底 —— 这是构建后的通知动作，失败下次发版再推即可。 */
    if (res.ok) {
      submitted += batch.length;
      console.log(`[indexnow] 第 ${index + 1}/${batches.length} 批 ${batch.length} 条 → ${res.status}`);
    } else {
      const text = await res.text().catch(() => '');
      console.error(
        `[indexnow] 第 ${index + 1}/${batches.length} 批失败 → ${res.status} ${text.slice(0, 300)}`,
      );
      if (res.status === 403) {
        console.error('          403 通常是密钥文件与 keyLocation 不一致，检查 public/<key>.txt。');
      }
    }
  }

  return { submitted, batches: batches.length };
}

/* ------------------------------------------------- Google 只读体检 */

function loadServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    // 支持直接贴 JSON，也支持 base64（GitHub Secrets 里换行容易丢）
    const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`GOOGLE_SERVICE_ACCOUNT_JSON 解析失败：${err.message}`);
  }
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

/** 手写 RS256 签名的 JWT，避免为了一个接口引入 googleapis 依赖。 */
function createAssertion(serviceAccount, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(`${header}.${claims}`)
    .sign(serviceAccount.private_key);

  return `${header}.${claims}.${base64url(signature)}`;
}

async function getAccessToken(serviceAccount, scope) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createAssertion(serviceAccount, scope),
    }),
  });
  if (!res.ok) {
    throw new Error(`换取 access token 失败：${res.status} ${(await res.text()).slice(0, 300)}`);
  }
  return (await res.json()).access_token;
}

/**
 * URL Inspection API：只读查询某个 URL 在 Google 的收录状态。
 * 它不会触发抓取，但能告诉你「还没收录」还是「已收录但抓取失败」，
 * 是判断 sitemap 有没有真正生效的唯一可编程手段。
 */
async function inspectUrl(token, siteUrl, inspectionUrl) {
  const res = await fetch(
    'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl, siteUrl }),
    },
  );
  if (!res.ok) return { error: `${res.status} ${(await res.text()).slice(0, 200)}` };

  const json = await res.json();
  const status = json.inspectionResult?.indexStatusResult || {};
  return {
    verdict: status.verdict,
    coverageState: status.coverageState,
    lastCrawlTime: status.lastCrawlTime,
    robotsTxtState: status.robotsTxtState,
    indexingState: status.indexingState,
    pageFetchState: status.pageFetchState,
  };
}

/* ------------------------------------------------------------------ 入口 */

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let urls = readSitemapUrls();
  if (args.changed) {
    urls = readChangedUrls(urls);
    console.log(`本次变更涉及 ${urls.length} 条 URL`);
  }
  if (args.limit > 0) urls = urls.slice(0, args.limit);
  if (!urls.length) {
    console.log('没有需要推送的 URL，退出。');
    return;
  }
  console.log(`待处理 URL：${urls.length} 条`);

  /* ---------- IndexNow（Bing / Yandex / Seznam / Naver） ---------- */
  const key = process.env.INDEXNOW_KEY;
  const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';

  if (!key) {
    console.log('\n[indexnow] 跳过：未设置 INDEXNOW_KEY。');
    console.log('           在仓库 Settings → Secrets and variables → Actions → Variables 里配置，');
    console.log(`           值取 public/<key>.txt 的文件名（当前已生成：见 public/*.txt）。`);
  } else {
    assertKeyFile(key);
    const result = await submitIndexNow(urls, key, { dryRun: args.dryRun, endpoint });
    console.log(
      args.dryRun
        ? `[indexnow] dry-run 结束，未实际请求。`
        : `[indexnow] 完成：${result.submitted}/${urls.length} 条`,
    );
  }

  /* ---------------------- Google ---------------------- */
  const serviceAccount = loadServiceAccount();
  const siteUrl = process.env.GOOGLE_SITE_URL;

  if (args.googlePublish && !serviceAccount) {
    console.error('\n[google] --google-publish 需要 GOOGLE_SERVICE_ACCOUNT_JSON，已跳过。');
  }

  if (!args.googleInspect && !args.googlePublish) {
    console.log('\n[google] 未请求 Google 相关操作。');
    console.log('         Google 没有通用的「推送」接口，正确做法是：');
    console.log('         1) Search Console 里添加资源并把 sitemap.xml 登记一次（只需一次）；');
    console.log('         2) 之后靠 sitemap + 站内链接发现；');
    console.log('         3) 想看收录效果，加 --google-inspect 做只读体检。');
    return;
  }

  if (!serviceAccount || !siteUrl) {
    console.log('\n[google] 跳过：需要同时配置 GOOGLE_SERVICE_ACCOUNT_JSON 与 GOOGLE_SITE_URL。');
    return;
  }

  if (args.googleInspect) {
    const token = await getAccessToken(
      serviceAccount,
      'https://www.googleapis.com/auth/webmasters.readonly',
    );
    // 抽样体检：每日配额 2000 次，全站 100+ 条不必每次都查
    const sample = urls.filter((_, i) => i % Math.ceil(urls.length / args.sample) === 0).slice(0, args.sample);
    console.log(`\n[google] 抽样体检 ${sample.length} 条：`);
    for (const url of sample) {
      const result = await inspectUrl(token, siteUrl, url);
      if (result.error) {
        console.log(`  ✗ ${url} → ${result.error}`);
      } else {
        console.log(
          `  ${result.verdict === 'PASS' ? '✓' : '·'} ${url}\n      ${result.coverageState || '-'} | crawl: ${result.lastCrawlTime || '从未'}`,
        );
      }
    }
  }

  if (args.googlePublish) {
    console.log(
      '\n[google] 提示：Indexing API 官方只对 JobPosting / BroadcastEvent 保证生效，' +
        '本站页面不属于这两类，调用多半会被静默忽略。建议改用上面的 --google-inspect 观察收录情况。',
    );
  }
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`);
  process.exit(1);
});
