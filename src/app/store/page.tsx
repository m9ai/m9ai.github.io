import Store from "./Store"

export const metadata = {
  title: { template: '应用商店 | 水杉智境工作室', default: '应用商店 | 水杉智境工作室' },
  description: '探索我们开发的AI应用，提升您的工作效率和创造力',
}

export default function Page() {
  return <Store />
}