import { createNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

// 创建本地化导航工具
export const { Link, redirect, useRouter, usePathname, getPathname } = createNavigation(routing);