/**
 * 统一组件库导出
 * 解决 shadcn/ui、Aceternity UI 和 ReactBit UI 之间的命名冲突和功能重叠
 */

// ===== 基础组件 (优先使用 shadcn/ui) =====
export {
  Button,
  buttonVariants,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Textarea,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  Badge,
  Skeleton,
  Separator,
  ScrollArea,
  ScrollBar,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Calendar,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,

  // 滑块组件
  Slider,
} from '@/components/ui';

// ===== 动画和特效组件 (优先使用 Aceternity UI) =====
export {
  // 背景效果
  BackgroundBeams,

  // 导航组件
  FloatingNav,

  // 动画容器
  AnimatedContainer,
  AnimatedItem,
  InViewAnimation,
  HoverAnimation,

  // 特殊效果
  BeamScan,
  PulseGlow,
  Floating,
  GradientShift,
  ParticleEffect,
  // Magnetic, // 暂时移除，避免冲突
  RippleWave,

  // 样式组件
  AceternityGlassCard,
  GlowBorder,
  FloatingShadow,
  GradientText,
  EnhancedButton,
  EnhancedCard,
  EnhancedInput,
  EnhancedContainer,
  EnhancedDivider,

  // 扩展组件
  HeroSection,
  FeatureCard,
  FeatureGrid,
  StatsCounter,
  StatsGrid,
  Timeline,
  InteractiveCard,
  ProgressIndicator,
  NotificationBanner,

  // 高级动画
  CountUp,
  ParticleBackground,
  FlipCard,

  // 增强特效
  Parallax,
  ScrollReveal,
  MouseFollower,
  TextSplit,
  LiquidButton,
  FloatingElement,
  AnimatedBorder,
  ParticleExplosion,
} from '@/components/aceternity';

// ===== ReactBit UI 组件 (用于特定动画需求) =====
export {
  AnimatedButton as ReactBitButton,
  AnimatedCard as ReactBitCard,
  AnimatedText as ReactBitText,
  AnimatedIcon as ReactBitIcon,
  AnimatedList as ReactBitList,
  AnimatedBackground as ReactBitBackground,
  LoadingSpinner as ReactBitSpinner,
  AnimatedInput as ReactBitInput,
} from '@/components/reactbit';

// ===== 解决命名冲突的重命名导出 =====

// Aceternity UI 的重命名导出
export {
  Typewriter as AceternityTypewriter,
  AdvancedRippleEffect as AceternityRippleEffect,
  AdvancedMagnetic as AceternityMagnetic,
} from '@/components/aceternity';

// ReactBit UI 的占位符组件重命名
export { ProgressBar as ReactBitProgressBar } from '@/components/reactbit';

// ===== 主题和配置 =====
export {
  AceternityThemeProvider,
  useAceternityTheme,
  ThemeToggle,
  ThemeSelector,
  aceternityTheme,
  aceternityUtils,
} from '@/components/aceternity';

export {
  reactBitConfig,
  reactBitUtils,
  getCurrentTheme,
  getCurrentAnimationConfig,
  updateReactBitConfig,
  resetReactBitConfig,
} from '@/components/reactbit';

// ===== 3D 组件 =====
// 注意：3D 组件不在统一导出中，以避免 SSR 问题
// 请直接从 '@/components/3d' 导入或使用动态导入

// ===== 类型导出 =====
// 注意：ButtonProps 和 InputProps 在 shadcn/ui 中不存在，已移除导出

export type {
  AceternityTheme,
  AceternityColors,
  AceternityAnimations,
} from '@/lib/aceternity-theme';

export type {
  ReactBitTheme,
  AnimationConfig,
  ReactBitProps,
  AnimationType,
  SizeType,
  VariantType,
  PositionType,
  DirectionType,
  AlignType,
} from '@/components/reactbit/types';

// ===== 推荐使用指南 =====
/**
 * 组件使用优先级指南：
 *
 * 1. 基础UI组件 -> 使用 shadcn/ui
 *    - Button, Card, Input, Select 等
 *    - 提供最佳的可访问性和一致性
 *
 * 2. 动画和特效 -> 使用 Aceternity UI
 *    - BackgroundBeams, FloatingNav, ParticleEffect 等
 *    - 提供高质量的视觉效果
 *
 * 3. 特定动画需求 -> 使用 ReactBit UI
 *    - ReactBitButton, ReactBitText, ReactBitSpinner 等
 *    - 提供更细粒度的动画控制
 *
 * 4. 避免功能重叠：
 *    - 优先使用 shadcn/ui 的基础组件
 *    - 需要动画时，在基础组件上包装 Aceternity UI 效果
 *    - 只在需要特定动画行为时使用 ReactBit UI
 */

// Layout Components
export { PageLayout } from '../layout/PageLayout';
