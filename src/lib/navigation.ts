/**
 * 统一的导航配置
 * 用于所有页面的浮动导航栏
 */

// 导航项类型
export interface NavItem {
  name: string;
  link: string;
  icon?: JSX.Element;
}

// 统一的浮动导航栏配置
// 顺序：logo, 知识宇宙, 社区, 登录
export const globalNavItems: NavItem[] = [
  {
    name: 'Roadmap',
    link: '/roadmap',
  },
  {
    name: 'Community',
    link: '/community',
  },
];

// 导出默认配置
export default globalNavItems;
