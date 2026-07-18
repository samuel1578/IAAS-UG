import { useCallback, useEffect, useState } from 'react';
import { MdNotifications, MdAccessTime } from 'react-icons/md';
import Button from '../Button';
import Skeleton from '../skeletons/Skeleton';
import NoticeDetailModal from './NoticeDetailModal';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  CATEGORY_STYLES,
  PRIORITY_STYLES,
  levelToAudience,
  publicDate
} from './noticesShared';
import { NoticeService } from '../../lib/appwrite';
import { useAuth } from '../../contexts/AuthContext';

const PREVIEW_COUNT = 2;

// Dashboard Home "Latest Notices" preview. Reuses the same eligibility rules
// as the SRC Noticeboard (status=published, audience match, not expired) and
// the same NoticeService query. Shows only the newest 2 eligible notices.
const LatestNotices = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const studentAudience = levelToAudience(userProfile ? userProfile.level : null);

  const loadNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const now = Date.now();
    const result = await NoticeService.getPublishedNotices(100);
    if (!result.success) {
      setError(true);
      setNotices([]);
      setIsLoading(false);
      return;
    }
    // Same audience + expiry filtering as SRC Noticeboard; service returns
    // newest-published-first, so the first PREVIEW_COUNT are the latest.
    const eligible = (result.notices || [])
      .filter((n) => {
        if (n.audience === 'all') return true;
        if (!studentAudience) return false;
        return n.audience === studentAudience;
      })
      .filter((n) => {
        if (!n.expiresAt) return true;
        const d = new Date(n.expiresAt);
        if (isNaN(d.getTime())) return true;
        return d.getTime() > now;
      });
    setNotices(eligible.slice(0, PREVIEW_COUNT));
    setIsLoading(false);
  }, [studentAudience]);

  useEffect(() => {
    let cancelled = false;
    loadNotices().finally(() => {
      if (cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [loadNotices]);

  if (isLoading) {
    return (
      <ul className="space-y-3" aria-busy="true" aria-label="Loading latest notices">
        {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
          <li
            key={i}
            className="flex flex-col gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3"
          >
            <div className="flex items-center gap-2">
              <Skeleton width="5rem" height="1.25rem" rounded="full" />
              <Skeleton width="4rem" height="1.25rem" rounded="full" />
            </div>
            <Skeleton width="80%" height="0.875rem" rounded="md" />
            <Skeleton width="60%" height="0.75rem" rounded="md" />
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-[#1E4620]/70 text-sm sm:text-base leading-relaxed">
          We couldn't load the latest notices right now.
        </p>
        <Button
          variant="outline"
          size="small"
          icon={MdNotifications}
          onClick={() => onNavigate('noticeboard')}
        >
          Open Noticeboard
        </Button>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-[#1E4620]/70 text-sm sm:text-base leading-relaxed">
          No new notices right now. Academic and SRC updates will appear here when published.
        </p>
        <Button
          variant="outline"
          size="small"
          icon={MdNotifications}
          onClick={() => onNavigate('noticeboard')}
        >
          Open Noticeboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2.5">
        {notices.map((notice) => {
          const date = publicDate(notice);
          return (
            <li key={notice.$id}>
              <button
                type="button"
                onClick={() => setSelected(notice)}
                className="w-full flex flex-col items-start gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] p-3 text-left transition-colors hover:bg-[#E6F4EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00592D]"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${CATEGORY_STYLES[notice.category]}`}
                  >
                    {CATEGORY_LABELS[notice.category]}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${PRIORITY_STYLES[notice.priority]}`}
                  >
                    {PRIORITY_LABELS[notice.priority]}
                  </span>
                  {date && (
                    <span className="flex items-center gap-1 text-xs text-[#1E4620]/70">
                      <MdAccessTime className="h-3.5 w-3.5" />
                      {date}
                    </span>
                  )}
                </span>
                <span className="block font-semibold text-[#1E4620] text-sm sm:text-base leading-tight">
                  {notice.title}
                </span>
                <span className="line-clamp-2 block text-xs sm:text-sm text-[#1E4620]/70">
                  {notice.summary}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Button
        variant="outline"
        size="small"
        icon={MdNotifications}
        onClick={() => onNavigate('noticeboard')}
      >
        View All Notices
      </Button>

      <NoticeDetailModal notice={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default LatestNotices;
