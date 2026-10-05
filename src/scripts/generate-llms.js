/**
 * 生成 llms.txt / llms-full.txt
 *
 * 背景：生成式引擎（ChatGPT / Claude / Perplexity / 各类 AI 搜索）在回答问题时，
 * 要么靠实时抓取、要么靠一份站点级的「内容地图」。llms.txt 就是后者的事实标准：
 * 放在站点根目录的一个纯文本索引，用最少的 token 告诉模型
 * 「这个站点是做什么的、有哪些页面、每页讲什么」。
 *
 * 本站恰好有两份天然适合做成 llms.txt 的资产：
 *   - public/docs/*.md：文档原文就是 Markdown，可直接喂给模型；
 *   - public/search-index.json：全站内容的扁平摘要。
 * 但两者都没有在任何地方被声明，AI 爬虫无从发现。这里把它们组织成标准入口。
 *
 * 产物：
 *   public/llms.txt       —— 结构化索引（链接清单，token 成本低）
 *   public/llms-full.txt  —— 文档全文（供需要完整上下文的场景按需取用）
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const ts = require('typescript');

const SITE_URL = 'https://m9ai.work';
const DOCS_DIR = path.join(process.cwd(), 'public', 'docs');

const messages = {
  zh: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'messages', 'zh.json'), 'utf-8')),
  en: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'messages', 'en.json'), 'utf-8')),
};

/** 与 generate-search-index.js 同一套做法：直接转译纯数据模块后取值，避免文案抄两份。 */
function loadSkills() {
  const source = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'skills.ts'), 'utf-8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const sandbox = { exports: {} };
  new Function('exports', outputText)(sandbox.exports);
  return sandbox.exports.skills || [];
}

function url(p) {
  return `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p.replace(/\/+$/, '')}/`;
}

/** YAML 会把 updatedAt 解析成 Date 对象，直接 String() 会输出一长串时区信息。 */
function formatDate(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function readDocs() {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title || file.replace(/\.md$/, ''),
        description: data.description || '',
        category: data.category || '',
        tags: data.tags || [],
        updatedAt: formatDate(data.updatedAt),
        body: content.trim(),
      };
    });
}

function buildLlmsTxt(docs, skills) {
  const lines = [];
  const serviceIds = ['model-deployment', 'model-application', 'agent-development'];
  const serviceTitle = (locale, id) => messages[locale].services[id].title;
  const serviceDesc = (locale, id) => messages[locale].services[id].description;

  lines.push('# 水杉智境工作室 / Metasequoia AI Studio');
  lines.push('');
  lines.push(
    '> 一支专注 Agent 工作流与智能体工程的交付团队：从私有化推理底座到 Agent 工作流上线运行，交付可控、可度量、可运维的企业级智能体系统。',
  );
  lines.push('');
  lines.push('Bilingual site (中文 / English). Every page below has a /zh/ and an /en/ variant.');
  lines.push(`Contact: c@m9ai.work`);
  lines.push('');

  lines.push('## 服务 / Services');
  lines.push('');
  for (const id of serviceIds) {
    lines.push(
      `- [${serviceTitle('zh', id)} (${serviceTitle('en', id)})](${url(`/zh/services/${id}`)}): ${serviceDesc('zh', id)} ${serviceDesc('en', id)}`,
    );
  }
  lines.push('');

  const publishedDocs = docs.filter((doc) => !doc.slug.endsWith('-en'));
  lines.push('## 文档 / Documentation');
  lines.push('');
  for (const doc of publishedDocs) {
    const detail = [doc.description, doc.updatedAt ? `updated ${doc.updatedAt}` : '']
      .filter(Boolean)
      .join(' — ');
    lines.push(`- [${doc.title}](${url(`/zh/docs/${doc.slug}`)})${detail ? `: ${detail}` : ''}`);
  }
  lines.push('');

  lines.push('## Skill 市集 / Agent Skills');
  lines.push('');
  for (const skill of skills) {
    const zh = skill.zh || {};
    const en = skill.en || {};
    lines.push(
      `- [${zh.name} (${en.name})](${url(`/zh/apps/${skill.id}`)}): ${zh.tagline} ${en.tagline}`,
    );
  }
  lines.push('');

  const caseSlugs = Object.keys(messages.zh.cases.studies);
  lines.push('## 客户案例 / Case Studies');
  lines.push('');
  for (const slug of caseSlugs) {
    const zh = messages.zh.cases.studies[slug];
    const en = messages.en.cases.studies[slug] || {};
    lines.push(
      `- [${zh.title} (${en.title || zh.title})](${url(`/zh/cases/${slug}`)}): ${zh.description}`,
    );
  }
  lines.push('');

  lines.push('## 其它页面 / Other pages');
  lines.push('');
  lines.push(`- [首页 / Home](${url('/zh')})`);
  lines.push(`- [Skill 市集](${url('/zh/store')})`);
  lines.push(`- [联系我们 / Contact](${url('/zh/contact')})`);
  lines.push(`- [隐私政策 / Privacy Policy](${url('/zh/privacy-policy')})`);
  lines.push(`- [服务条款 / Terms of Service](${url('/zh/terms-of-service')})`);
  lines.push('');

  lines.push('## 机器可读来源 / Machine-readable sources');
  lines.push('');
  lines.push(`- [sitemap.xml](${SITE_URL}/sitemap.xml): 全站 URL 清单（含 hreflang）`);
  lines.push(`- [llms-full.txt](${SITE_URL}/llms-full.txt): 本站文档的完整正文`);
  lines.push(`- [search-index.json](${SITE_URL}/search-index.json): 全站内容的 JSON 摘要`);
  lines.push(`- 文档原文：${SITE_URL}/docs/<slug>.md（可直接抓取 Markdown）`);
  lines.push('');

  return lines.join('\n');
}

/** 全文版：把每篇文档的正文原样拼进去，供需要完整上下文的场景使用。 */
function buildLlmsFullTxt(docs) {
  const lines = [];
  lines.push('# 水杉智境工作室 — 文档全文');
  lines.push('');
  lines.push(`Source: ${SITE_URL}`);
  lines.push(`Generated from: public/docs/*.md`);
  lines.push('');

  for (const doc of docs) {
    lines.push('---');
    lines.push('');
    lines.push(`## ${doc.title}`);
    lines.push('');
    const meta = [
      doc.description,
      doc.category ? `分类：${doc.category}` : '',
      doc.tags?.length ? `标签：${doc.tags.join('、')}` : '',
      doc.updatedAt ? `更新：${doc.updatedAt}` : '',
      `原文：${url(`/zh/docs/${doc.slug.replace(/-en$/, '')}`)}`,
    ].filter(Boolean);
    if (meta.length) {
      lines.push(meta.join(' | '));
      lines.push('');
    }
    lines.push(doc.body);
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const docs = readDocs();
  const skills = loadSkills();

  const publicDir = path.join(process.cwd(), 'public');

  const llmsPath = path.join(publicDir, 'llms.txt');
  fs.writeFileSync(llmsPath, buildLlmsTxt(docs, skills));

  const fullPath = path.join(publicDir, 'llms-full.txt');
  fs.writeFileSync(fullPath, buildLlmsFullTxt(docs));

  console.log(
    `✅ llms.txt 已生成：${docs.filter((d) => !d.slug.endsWith('-en')).length} 篇文档 / ${skills.length} 个 Skill`,
  );
  console.log(`📁 ${llmsPath}`);
  console.log(`📁 ${fullPath}`);
}

main();
