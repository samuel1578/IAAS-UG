import type { CSSProperties } from 'react';

/**
 * Skeleton — base loading-placeholder primitive.
 *
 * A neutral, pulsing block used to represent content that is still loading.
 * Every other skeleton primitive (SkeletonText, SkeletonCard, SkeletonAvatar)
 * is built on top of this. It intentionally uses a light neutral gray (never
 * the brand green) so it reads clearly as "loading placeholder" rather than
 * styled content.
 *
 * This codebase's tailwind.config does not define a custom shimmer keyframe,
 * so we use Tailwind's built-in `animate-pulse`.
 */

type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface SkeletonProps {
  /** Width. A number is treated as pixels; a string is used verbatim (e.g. '100%', '12rem'). */
  width?: number | string;
  /** Height. A number is treated as pixels; a string is used verbatim (e.g. '1rem'). */
  height?: number | string;
  /**
   * Border radius. `true` -> medium radius, `false` -> no radius.
   * A size string ('sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full') selects
   * the matching Tailwind rounded utility. Defaults to `true` (rounded-md).
   */
  rounded?: boolean | RoundedSize;
  /** Extra classes appended after the base styles so callers can override. */
  className?: string;
}

// Explicit map so Tailwind's JIT can see every class literally (no dynamic
// `rounded-${x}` string building, which the purge step cannot detect).
const ROUNDED_CLASS: Record<RoundedSize, string> = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

function resolveRounded(rounded: SkeletonProps['rounded']): string {
  if (rounded === undefined || rounded === true) return ROUNDED_CLASS.md;
  if (rounded === false) return ROUNDED_CLASS.none;
  return ROUNDED_CLASS[rounded];
}

function toDimension(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

const Skeleton = ({ width, height, rounded, className = '' }: SkeletonProps) => {
  const style: CSSProperties = {
    width: toDimension(width),
    height: toDimension(height),
  };

  const classes = [
    'animate-pulse',
    'bg-gray-200',
    resolveRounded(rounded),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div aria-hidden="true" className={classes} style={style} />;
};

export default Skeleton;
