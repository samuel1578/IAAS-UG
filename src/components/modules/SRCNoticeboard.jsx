import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdNotifications, MdAccessTime, MdCampaign } from 'react-icons/md';
import Card from '../Card';
import NoticeDetailModal from './NoticeDetailModal';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  CATEGORY_STYLES,
  PRIORITY_STYLES,
  levelToAudience,
  publicDate,
  filterEligibleNotices
} from './noticesShared';
import { NoticeService } from '../../lib/appwrite';
import { useAuth } from '../../contexts/AuthContext';

const SRCNoticeboard = () => {
  const { userProfile } = useAuth();
  const [notices, setNotices] = useState([]);
  const [selected, setSelected] = useState(null);

  const studentAudience = levelToAudience(userProfile ? userProfile.level : null);
  const now = Date.now();

  const loadNotices = useCallback(async () => {
    try {
      const result = await NoticeService.getPublishedNotices(100);
      if (!result.success) {
        console.error('SRC Noticeboard fetch failed:', result.error);
        setNotices([]);
        return;
      }
      // Audience + expiry filtering via the shared helper; newest-published-first
      // order is preserved from the service query.
      setNotices(filterEligibleNotices(result.notices, studentAudience, now));
    } catch (err) {
      // Log the real failure; the empty-state message covers both zero
      // results and fetch failures, so no separate error UI is rendered.
      console.error('SRC Noticeboard load error:', err);
      setNotices([]);
    }
  }, [studentAudience, now]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#00592D] mb-2">SRC Noticeboard</h2>
          <p className="text-gray-600">Stay updated with the latest announcements and events</p>
        </div>
        {notices.length > 0 && (
          <button
            type="button"
            onClick={loadNotices}
            className="shrink-0 text-sm px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#00592D] hover:bg-[#E6F4EA] transition-colors"
          >
            Refresh
          </button>
        )}
      </div>

      {notices.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-[#E5E7EB] p-8 text-center">
          <MdNotifications className="w-10 h-10 text-[#00592D] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No student notices at this time.</h3>
        </div>
      )}

      {notices.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          className="space-y-4"
        >
          {notices.map((notice) => {
            const date = publicDate(notice);
            return (
              <motion.div
                key={notice.$id}
                variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.3 } } }}
              >
                <Card hover={true}>
                  <button
                    type="button"
                    onClick={() => setSelected(notice)}
                    className="w-full text-left p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00592D] rounded-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#00592D] rounded-full flex items-center justify-center flex-shrink-0">
                        <MdCampaign className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${CATEGORY_STYLES[notice.category]}`}
                          >
                            {CATEGORY_LABELS[notice.category]}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${PRIORITY_STYLES[notice.priority]}`}
                          >
                            {PRIORITY_LABELS[notice.priority]}
                          </span>
                          {date && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MdAccessTime className="w-4 h-4" />
                              <span>{date}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{notice.title}</h3>
                        <p className="text-gray-600 leading-relaxed line-clamp-3">{notice.summary}</p>
                        <p className="text-xs text-gray-500 mt-3">By {notice.authorName}</p>
                      </div>
                    </div>
                  </button>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <NoticeDetailModal notice={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default SRCNoticeboard;
