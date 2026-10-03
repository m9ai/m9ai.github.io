'use client';

import { MotionConfig } from 'motion/react';

/**
 * 把 MotionConfig 单独包一层 'use client'。
 *
 * `motion/react` 的入口用了 `export *`，直接在服务端 layout 里 import
 * 会触发 Next 的 client boundary 限制（It's currently unsupported to use
 * "export *" in a client boundary）。放进客户端组件后由客户端模块图解析即可。
 *
 * reducedMotion="user"：尊重系统的「减弱动态效果」设置，
 * 位移/缩放类变换自动降级为直接切换。
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
