import { sanitizeNoticeHtml } from './noticesShared';

// On-brand prose styling for rendered rich notice content. Mirrors the
// dashboard's deep-green text and Gelasio typography.
const PROSE_CLASS =
  'text-gray-700 leading-relaxed rich-notice-content';

// Returns true when the stored content already looks like rich HTML
// (contains a block/format tag). Plain-text legacy notices are rendered
// verbatim with whitespace preserved instead.
function isRichHtml(content: string): boolean {
  return /<(p|br|strong|b|em|i|u|h2|h3|ul|ol|li|blockquote|a|span)\b/i.test(content);
}
interface RichContentProps {
  html: string;
  className?: string;
}

// Shared safe rich-content renderer for notice bodies. Used by the student
// SRC Noticeboard detail view and the Dashboard Home notice detail modal.
const RichContent = ({ html, className = '' }: RichContentProps) => {
  if (isRichHtml(html)) {
    const clean = sanitizeNoticeHtml(html);
    return (
      <div
        className={`${PROSE_CLASS} ${className}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  // Legacy plain-text content: keep line breaks intact.
  return <div className={`${PROSE_CLASS} whitespace-pre-wrap ${className}`}>{html}</div>;
};

export default RichContent;
