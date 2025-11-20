'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { aceternityTheme, aceternityUtils } from '@/lib/aceternity-theme';

// 主题上下文类型
interface AceternityThemeContextType {
  theme: typeof aceternityTheme;
  utils: typeof aceternityUtils;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  currentTheme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// 创建主题上下文
const AceternityThemeContext = createContext<
  AceternityThemeContextType | undefined
>(undefined);

// 主题提供者组件
export function AceternityThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'aceternity-theme',
}: {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}) {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(
    defaultTheme
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 初始化主题
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as
      | 'light'
      | 'dark'
      | 'system'
      | null;
    if (storedTheme) {
      setCurrentTheme(storedTheme);
    }
  }, [storageKey]);

  // 监听主题变化
  useEffect(() => {
    const updateTheme = () => {
      let isDark = false;

      if (currentTheme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = currentTheme === 'dark';
      }

      setIsDarkMode(isDark);

      // 更新 DOM 类名
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // 更新 CSS 自定义属性
      updateCSSVariables();
    };

    updateTheme();

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentTheme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  // 更新 CSS 自定义属性
  const updateCSSVariables = () => {
    const root = document.documentElement;

    // Aceternity 特定的 CSS 变量
    root.style.setProperty(
      '--aceternity-beam-primary',
      aceternityTheme.colors.beam.primary
    );
    root.style.setProperty(
      '--aceternity-beam-secondary',
      aceternityTheme.colors.beam.secondary
    );
    root.style.setProperty(
      '--aceternity-beam-glow',
      aceternityTheme.colors.beam.glow
    );

    root.style.setProperty(
      '--aceternity-navbar-bg',
      aceternityTheme.colors.navbar.background
    );
    root.style.setProperty(
      '--aceternity-navbar-border',
      aceternityTheme.colors.navbar.border
    );
    root.style.setProperty(
      '--aceternity-navbar-shadow',
      aceternityTheme.colors.navbar.shadow
    );

    root.style.setProperty(
      '--aceternity-glass-bg',
      aceternityTheme.colors.glass.background
    );
    root.style.setProperty(
      '--aceternity-glass-border',
      aceternityTheme.colors.glass.border
    );

    // 动画持续时间
    root.style.setProperty(
      '--aceternity-beam-duration',
      `${aceternityTheme.animations.beam.duration}s`
    );
    root.style.setProperty(
      '--aceternity-float-duration',
      `${aceternityTheme.animations.float.duration}s`
    );
    root.style.setProperty(
      '--aceternity-gradient-duration',
      `${aceternityTheme.animations.gradient.duration}s`
    );
    root.style.setProperty(
      '--aceternity-pulse-duration',
      `${aceternityTheme.animations.pulse.duration}s`
    );
  };

  // 设置主题
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    localStorage.setItem(storageKey, theme);
  };

  // 切换暗色模式
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // 设置暗色模式
  const setDarkMode = (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: AceternityThemeContextType = {
    theme: aceternityTheme,
    utils: aceternityUtils,
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    currentTheme,
    setTheme,
  };

  return (
    <AceternityThemeContext.Provider value={value}>
      {children}
    </AceternityThemeContext.Provider>
  );
}

// 使用主题的 Hook
export function useAceternityTheme() {
  const context = useContext(AceternityThemeContext);
  if (context === undefined) {
    throw new Error(
      'useAceternityTheme must be used within an AceternityThemeProvider'
    );
  }
  return context;
}

// 主题切换组件
export function ThemeToggle({ className }: { className?: string }) {
  const { isDarkMode, toggleDarkMode } = useAceternityTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`focus:ring-primary relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDarkMode ? 'bg-primary' : 'bg-gray-200'
      } ${className}`}
      role="switch"
      aria-checked={isDarkMode}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isDarkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// 主题选择器组件
export function ThemeSelector({ className }: { className?: string }) {
  const { currentTheme, setTheme } = useAceternityTheme();

  const themes = [
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' },
    { value: 'system', label: '跟随系统' },
  ] as const;

  return (
    <select
      value={currentTheme}
      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
      className={`border-input bg-background ring-offset-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {themes.map((theme) => (
        <option key={theme.value} value={theme.value}>
          {theme.label}
        </option>
      ))}
    </select>
  );
}
