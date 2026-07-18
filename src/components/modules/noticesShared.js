// Shared notice helpers used by both the SRC Noticeboard and the Dashboard
// Home "Latest Notices" preview. Keeping eligibility/filtering logic in one
// place guarantees the two surfaces stay consistent (same published-only,
// audience, and expiry rules; same newest-published-first ordering).

import DOMPurify from 'dompurify';

export const CATEGORY_LABELS = {
  academic: 'Academic',
  src: 'SRC',
  event: 'Event',
  general: 'General',
  opportunity: 'Opportunity'
};

export const PRIORITY_LABELS = {
  normal: 'Normal',
  important: 'Important',
  urgent: 'Urgent'
};

// Restrained, on-brand priority treatment. Text label is always present.
export const PRIORITY_STYLES = {
  normal: 'bg-gray-100 text-gray-600 border border-[#E5E7EB]',
  important: 'bg-[#FFF8E1] text-[#8a6d00] border border-[#F2A900]',
  urgent: 'bg-[#F2A900] text-[#004620] border border-[#D98A00]'
};

export const CATEGORY_STYLES = {
  academic: 'bg-[#E6F4EA] text-[#1E4620] border border-[#E5E7EB]',
  src: 'bg-[#00592D] text-white border border-[#004620]',
  event: 'bg-[#F2A900] bg-opacity-20 text-[#D98A00] border border-[#F2A900]',
  general: 'bg-gray-100 text-gray-600 border border-[#E5E7EB]',
  opportunity: 'bg-[#E6F4EA] text-[#1E4620] border border-[#E5E7EB]'
};

export const AUDIENCE_LABELS = {
  all: 'All Students',
  level_100: 'Level 100',
  level_200: 'Level 200',
  level_300: 'Level 300',
  level_400: 'Level 400'
};

// Map a student's profile level (string e.g. "300") to its audience enum.
// Missing/invalid level → null so we only show audience="all".
export function levelToAudience(level) {
  if (typeof level !== 'string' && typeof level !== 'number') return null;
  const key = `level_${String(level).trim()}`;
  if (key === 'level_100' || key === 'level_200' || key === 'level_300' || key === 'level_400') {
    return key;
  }
  return null;
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Public date: prefer publishedAt, fall back to createdAt. Never crashes.
export function publicDate(notice) {
  return formatDate(notice.publishedAt) || formatDate(notice.createdAt);
}

// A notice is hidden once expiresAt exists and is in the past.
export function isExpired(notice, now) {
  if (!notice.expiresAt) return false;
  const d = new Date(notice.expiresAt);
  if (isNaN(d.getTime())) return false;
  return d.getTime() <= now;
}

export function isAudienceVisible(notice, studentAudience) {
  if (notice.audience === 'all') return true;
  if (!studentAudience) return false;
  return notice.audience === studentAudience;
}

// Apply the shared student eligibility rules (audience + expiry) to a list of
// already-published notices. Returns a new array in newest-published-first
// order (the service already orders by publishedAt DESC; this preserves it).
export function filterEligibleNotices(notices, studentAudience, now) {
  return (notices || [])
    .filter((n) => isAudienceVisible(n, studentAudience))
    .filter((n) => !isExpired(n, now));
}

// --- Rich content sanitization ---------------------------------------------

// Allowed tags/attributes for sanitized notice HTML. Keeps the rich content
// limited to the formatting the admin editor can produce (no images, scripts,
// styles, iframes, etc.). Links are allowed but forced safe at render time.
export const RICH_HTML_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u',
    'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'span'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
};

// Sanitize admin-authored rich HTML before it is stored or rendered. Removes
// scripts, event handlers, inline styles, and any disallowed markup so the
// stored `content` string is always safe to inject.
export function sanitizeNoticeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, RICH_HTML_SANITIZE_CONFIG);
}
