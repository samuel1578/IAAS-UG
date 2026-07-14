import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

/**
 * SkeletonCard — a card-shaped loading placeholder.
 *
 * Matches the existing `Card` component's surface styling
 * (rounded-xl + shadow-md) so a grid/list of loading cards lines up visually
 * with the real content that will replace it (course cards, material rows,
 * user-management rows, etc.). Contains a SkeletonText block by default, with
 * an optional placeholder "title" bar above it.
 */

export interface SkeletonCardProps {
  /** Number of body text lines inside the card. Defaults to 3. */
  lines?: number;
  /** Show a taller "title" placeholder bar above the body text. Defaults to true. */
  showTitle?: boolean;
  /** Padding utility for the card interior. Defaults to 'p-6'. */
  paddingClassName?: string;
  /** Extra classes applied to the card container. */
  className?: string;
}

const SkeletonCard = ({
  lines = 3,
  showTitle = true,
  paddingClassName = 'p-6',
  className = '',
}: SkeletonCardProps) => {
  // Mirrors Card.jsx base styles (bg-white rounded-xl shadow-md) minus the
  // interactive hover motion, which is not appropriate for a placeholder.
  const cardClasses = [
    'bg-white',
    'rounded-xl',
    'shadow-md',
    'overflow-hidden',
    paddingClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div aria-hidden="true" className={cardClasses}>
      {showTitle && (
        <Skeleton width="55%" height="1.25rem" rounded="md" className="mb-4" />
      )}
      <SkeletonText lines={lines} />
    </div>
  );
};

export default SkeletonCard;
