import React from 'react';

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

/** 序列化时转义 `<`，避免正文里出现 `</script>` 提前闭合标签。 */
function serialize(data: JsonLdValue): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * 在任意位置输出一段 JSON-LD。
 *
 * 放在 <head> 之外也可以 —— Google 与主流 AI 抓取器对 body 里的
 * ld+json 同样解析，这样可以就近跟着页面组件走，不必把每类页面的
 * 结构化数据都塞进 layout。
 */
export default function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
