import Skeleton from './Skeleton';

/**
 * SkeletonText — one or more lines of placeholder text.
 *
 * Renders `lines` skeleton bars stacked vertically. Line widths are varied so
 * the block reads like a real paragraph (the last line trails off to ~65%)
 * instead of looking like a stack of identical gray bars.
 */

export interface SkeletonTextProps {
  /** Number of text lines to render. Defaults to 1. */
  lines?: number;
  /** Height of each line. A number is pixels; a string is used verbatim. Defaults to '0.75rem'. */
  lineHeight?: number | string;
  /** Vertical gap between lines (Tailwind spacing class). Defaults to 'gap-2'. */
  gapClassName?: string;
  /** Extra classes applied to the wrapping container. */
  className?: string;
}

// Repeating pattern of widths so multi-line blocks look natural. The final
// rendered line always uses the "trailing" width regardless of this pattern.
const WIDTH_PATTERN = ['100%', '92%', '96%', '88%'];
const TRAILING_WIDTH = '65%';

const SkeletonText = ({
  lines = 1,
  lineHeight = '0.75rem',
  gapClassName = 'gap-2',
  className = '',
}: SkeletonTextProps) => {
  const safeLines = Math.max(1, Math.floor(lines));

  const containerClasses = ['flex', 'flex-col', gapClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {Array.from({ length: safeLines }).map((_, index) => {
        const isLast = index === safeLines - 1;
        // Single-line text should span full width; only trail off the last
        // line when there is more than one line.
        const width =
          isLast && safeLines > 1
            ? TRAILING_WIDTH
            : WIDTH_PATTERN[index % WIDTH_PATTERN.length];

        return (
          <Skeleton
            key={index}
            width={width}
            height={lineHeight}
            rounded="sm"
          />
        );
      })}
    </div>
  );
};

export default SkeletonText;
