/**
 * ReactBit UI 组件库导出
 * 基于 react-bits 的动画组件封装
 */

// 动画组件
export { AnimatedButton } from './animated-button';
export { AnimatedCard } from './animated-card';
export { AnimatedText } from './animated-text';
export { AnimatedIcon } from './animated-icon';
export { AnimatedList } from './animated-list';

// 背景效果组件
export { AnimatedBackground } from './animated-background';
export { GridScan } from './GridScan';
export {
  GradientBackground,
  ParticleField,
  HoverCard,
  ClickEffect,
  ScrollAnimation,
  ProgressBar,
  SkeletonLoader,
  AnimatedNavbar,
  SidebarMenu,
  TabNavigation,
  AnimatedSelect,
  AnimatedCheckbox,
  AnimatedToast,
  AnimatedModal,
  AnimatedAlert,
  AnimatedChart,
  AnimatedTable,
  AnimatedTimeline,
} from './placeholder-components';

// 加载动画组件
export { LoadingSpinner } from './loading-spinner';

// 表单组件
export { AnimatedInput } from './animated-input';

// 工具函数和配置
export {
  reactBitConfig,
  getCurrentTheme,
  getCurrentAnimationConfig,
  updateReactBitConfig,
  resetReactBitConfig,
} from './config';
export { reactBitUtils } from './utils';
export type { ReactBitTheme, AnimationConfig, ReactBitProps } from './types';
