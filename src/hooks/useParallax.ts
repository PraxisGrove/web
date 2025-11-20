'use client';

import React, { useEffect, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

interface ParallaxOptions {
  speed?: number;
  offset?: number;
  direction?: 'up' | 'down';
  disabled?: boolean;
}

export function useParallax({
  speed = 0.5,
  offset = 0,
  direction = 'up',
  disabled = false,
}: ParallaxOptions = {}) {
  const { scrollY } = useScroll();
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  // 计算视差偏移量
  const initial = elementTop - clientHeight;
  const final = elementTop + offset;

  const yRange = useTransform(
    scrollY,
    [initial, final],
    disabled
      ? [0, 0]
      : direction === 'up'
        ? [0, -(final - initial) * speed]
        : [0, (final - initial) * speed]
  );

  useEffect(() => {
    const element = document.documentElement;
    const onResize = () => {
      setElementTop(element.scrollTop || window.pageYOffset);
      setClientHeight(window.innerHeight);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return yRange;
}

// 多层视差效果 Hook - 重构为避免在回调中使用 Hook
export function useMultiLayerParallax(layers: ParallaxOptions[] = []) {
  const { scrollY } = useScroll();

  // 预先创建所有需要的 transforms
  const transforms = React.useMemo(() => {
    const results = [];
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const {
        speed = 0.5,
        offset = 0,
        direction = 'up',
        disabled = false,
      } = layer;

      results.push({
        speed,
        offset,
        direction,
        disabled,
      });
    }
    return results;
  }, [layers]);

  // 为每个层创建 transform，但限制最大数量以避免动态 Hook
  const transform1 = useTransform(
    scrollY,
    [0, 1000],
    transforms[0]
      ? transforms[0].disabled
        ? [0, 0]
        : transforms[0].direction === 'up'
          ? [0, -1000 * transforms[0].speed + transforms[0].offset]
          : [0, 1000 * transforms[0].speed + transforms[0].offset]
      : [0, 0]
  );

  const transform2 = useTransform(
    scrollY,
    [0, 1000],
    transforms[1]
      ? transforms[1].disabled
        ? [0, 0]
        : transforms[1].direction === 'up'
          ? [0, -1000 * transforms[1].speed + transforms[1].offset]
          : [0, 1000 * transforms[1].speed + transforms[1].offset]
      : [0, 0]
  );

  const transform3 = useTransform(
    scrollY,
    [0, 1000],
    transforms[2]
      ? transforms[2].disabled
        ? [0, 0]
        : transforms[2].direction === 'up'
          ? [0, -1000 * transforms[2].speed + transforms[2].offset]
          : [0, 1000 * transforms[2].speed + transforms[2].offset]
      : [0, 0]
  );

  return React.useMemo(() => {
    const result = [transform1];
    if (transforms.length > 1) result.push(transform2);
    if (transforms.length > 2) result.push(transform3);
    return result.slice(0, transforms.length);
  }, [transform1, transform2, transform3, transforms.length]);
}

// 基于元素位置的视差 Hook
export function useElementParallax(
  elementRef: React.RefObject<HTMLElement | null>,
  options: ParallaxOptions = {}
) {
  const { direction = 'up', disabled = false } = options;
  const { scrollY } = useScroll();
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);

  useEffect(() => {
    const updateElementPosition = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setElementTop(rect.top + window.pageYOffset);
        setElementHeight(rect.height);
      }
    };

    updateElementPosition();
    window.addEventListener('resize', updateElementPosition);
    window.addEventListener('scroll', updateElementPosition);

    return () => {
      window.removeEventListener('resize', updateElementPosition);
      window.removeEventListener('scroll', updateElementPosition);
    };
  }, [elementRef]);

  const y = useTransform(
    scrollY,
    [elementTop - window.innerHeight, elementTop + elementHeight],
    disabled ? [0, 0] : direction === 'up' ? [100, -100] : [-100, 100]
  );

  return y;
}

// 性能优化的视差 Hook
export function useOptimizedParallax(
  options: ParallaxOptions & {
    throttle?: number;
    reducedMotion?: boolean;
  } = {}
) {
  const {
    speed = 0.5,
    offset = 0,
    direction = 'up',
    disabled = false,
    reducedMotion = false,
  } = options;

  const [scrollY, setScrollY] = useState(0);
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (disabled || reducedMotion || prefersReducedMotion) {
      return;
    }

    const updateScrollY = () => {
      setScrollY(window.pageYOffset);
      setTicking(false);
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        setTicking(true);
      }
    };

    const handleScroll = () => {
      requestTick();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [disabled, reducedMotion, ticking]);

  const transform =
    disabled || reducedMotion
      ? 0
      : direction === 'up'
        ? -(scrollY * speed) + offset
        : scrollY * speed + offset;

  return {
    transform: `translateY(${transform}px)`,
    y: transform,
  };
}
