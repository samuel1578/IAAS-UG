import Skeleton from './Skeleton';

/**
 * SkeletonAvatar — a circular loading placeholder for a user avatar.
 *
 * Sized to match the existing user-initial circles in the app:
 *   - DashboardLayout user menu avatar  -> 32px  (w-8 h-8)
 *   - UserManagement student avatars    -> 48px  (w-12 h-12)
 *
 * `size` is the diameter in pixels (default 32) so it can align with either
 * of those, or any custom sizing a future screen needs.
 */

export interface SkeletonAvatarProps {
  /** Diameter in pixels. Defaults to 32 (matches DashboardLayout's w-8 h-8). */
  size?: number;
  /** Extra classes applied to the avatar placeholder. */
  className?: string;
}

const SkeletonAvatar = ({ size = 32, className = '' }: SkeletonAvatarProps) => {
  return (
    <Skeleton
      width={size}
      height={size}
      rounded="full"
      className={className}
    />
  );
};

export default SkeletonAvatar;
