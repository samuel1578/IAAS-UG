import Modal from '../Modal';
import RichContent from './RichContent';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  CATEGORY_STYLES,
  PRIORITY_STYLES,
  AUDIENCE_LABELS,
  publicDate,
  formatDate
} from './noticesShared';

// Shared full-notice detail modal used by both the SRC Noticeboard and the
// Dashboard Home "Latest Notices" preview. Keeps a single, consistent
// detail experience: no internal IDs, line breaks preserved, on-brand styling.
const NoticeDetailModal = ({ notice, onClose }) => (
  <Modal isOpen={!!notice} onClose={onClose} title={notice ? notice.title : ''}>
    {notice && (
      <div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
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
          <span className="text-xs text-gray-500">
            {AUDIENCE_LABELS[notice.audience]}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          By {notice.authorName}
          {publicDate(notice) && ` · ${publicDate(notice)}`}
          {notice.expiresAt && formatDate(notice.expiresAt) && (
            <> · Expires {formatDate(notice.expiresAt)}</>
          )}
        </p>
        <RichContent html={notice.content} />
      </div>
    )}
  </Modal>
);

export default NoticeDetailModal;
