import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSave,
  MdCampaign,
  MdSearch,
  MdOutlinePushPin,
  MdUnpublished,
  MdArchive,
  MdWarning,
  MdRestartAlt
} from 'react-icons/md';
import Button from '../Button';
import Card from '../Card';
import {
  NoticeService,
  Notice,
  NoticeCategory,
  NoticeStatus,
  NoticePriority,
  NoticeAudience,
  CreateNoticeInput,
  UpdateNoticeInput
} from '../../lib/appwrite';
import { useAuth } from '../../contexts/AuthContext';
import RichTextEditor from './RichTextEditor';
import { sanitizeNoticeHtml } from '../modules/noticesShared';

type StatusFilter = 'all' | NoticeStatus;

const CATEGORY_OPTIONS: { value: NoticeCategory; label: string }[] = [
  { value: 'academic', label: 'Academic' },
  { value: 'src', label: 'SRC' },
  { value: 'event', label: 'Event' },
  { value: 'general', label: 'General' },
  { value: 'opportunity', label: 'Opportunity' }
];

const AUDIENCE_OPTIONS: { value: NoticeAudience; label: string }[] = [
  { value: 'all', label: 'All Students' },
  { value: 'level_100', label: 'Level 100' },
  { value: 'level_200', label: 'Level 200' },
  { value: 'level_300', label: 'Level 300' },
  { value: 'level_400', label: 'Level 400' }
];

const PRIORITY_OPTIONS: { value: NoticePriority; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Important' },
  { value: 'urgent', label: 'Urgent' }
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

const MAX = { title: 255, summary: 500, content: 5000 };

interface NoticeFormState {
  title: string;
  summary: string;
  content: string;
  category: NoticeCategory;
  audience: NoticeAudience;
  priority: NoticePriority;
  status: 'draft' | 'published';
  expiresAt: string;
}

const EMPTY_FORM: NoticeFormState = {
  title: '',
  summary: '',
  content: '',
  category: 'general',
  audience: 'all',
  priority: 'normal',
  status: 'draft',
  expiresAt: ''
};

const NoticeManagement: React.FC = () => {
  const { user, userProfile } = useAuth();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState<NoticeFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    const result = await NoticeService.getAllNotices(100);
    if (result.success) {
      setNotices(result.notices ?? []);
    } else {
      setError(result.error || 'Failed to load notices');
      setNotices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    if (showForm) {
      if (editingNotice) {
        setForm({
          title: editingNotice.title,
          summary: editingNotice.summary,
          content: editingNotice.content,
          category: editingNotice.category,
          audience: editingNotice.audience,
          priority: editingNotice.priority,
          status: editingNotice.status === 'published' ? 'published' : 'draft',
          expiresAt: editingNotice.expiresAt
            ? toLocalInputValue(editingNotice.expiresAt)
            : ''
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setFormErrors({});
    }
  }, [showForm, editingNotice]);

  const visibleNotices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notices.filter((n) => {
      if (statusFilter !== 'all' && n.status !== statusFilter) return false;
      if (q && !n.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [notices, search, statusFilter]);

  const openAddForm = () => {
    setEditingNotice(null);
    setShowForm(true);
  };

  const openEditForm = (notice: Notice) => {
    setEditingNotice(notice);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingNotice(null);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const title = form.title.trim();
    const summary = form.summary.trim();
    const content = form.content.trim();

    if (!title) errs.title = 'Title is required';
    else if (title.length > MAX.title) errs.title = `Title must be ${MAX.title} characters or fewer`;

    if (!summary) errs.summary = 'Summary is required';
    else if (summary.length > MAX.summary) errs.summary = `Summary must be ${MAX.summary} characters or fewer`;

    if (!content) errs.content = 'Content is required';
    else if (content.length > MAX.content) errs.content = `Content must be ${MAX.content} characters or fewer`;

    if (!form.category) errs.category = 'Category is required';
    if (!form.audience) errs.audience = 'Audience is required';
    if (!form.priority) errs.priority = 'Priority is required';
    if (!form.status) errs.status = 'Status is required';

    if (form.expiresAt) {
      const d = new Date(form.expiresAt);
      if (isNaN(d.getTime())) errs.expiresAt = 'Enter a valid date/time';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormSubmitting(true);
    setError(null);

    const expiresAt = form.expiresAt ? new Date(form.expiresAt).toISOString() : null;
    const authorName = NoticeService.resolveAuthorName(user, userProfile);

    let result;
    if (editingNotice) {
      const payload: UpdateNoticeInput = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        content: sanitizeNoticeHtml(form.content),
        category: form.category,
        priority: form.priority,
        audience: form.audience,
        expiresAt
      };
      result = await NoticeService.updateNotice(editingNotice.$id, payload);
    } else {
      const payload: CreateNoticeInput = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        content: sanitizeNoticeHtml(form.content),
        category: form.category,
        priority: form.priority,
        audience: form.audience,
        status: form.status,
        expiresAt
      };
      result = await NoticeService.createNotice(payload, authorName);
    }

    setFormSubmitting(false);

    if (result.success) {
      closeForm();
      fetchNotices();
    } else {
      setError(result.error || 'Failed to save notice');
    }
  };

  const changeStatus = async (notice: Notice, status: NoticeStatus) => {
    setBusyId(notice.$id);
    setError(null);
    const result = await NoticeService.updateNoticeStatus(
      notice.$id,
      status,
      notice.publishedAt
    );
    setBusyId(null);
    if (result.success) {
      fetchNotices();
    } else {
      setError(result.error || 'Failed to update notice status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete?.$id) return;
    setDeleting(true);
    setError(null);
    const result = await NoticeService.deleteNotice(confirmDelete.$id);
    setDeleting(false);
    if (result.success) {
      setNotices((prev) => prev.filter((n) => n.$id !== confirmDelete.$id));
      setConfirmDelete(null);
    } else {
      setError(result.error || 'Failed to delete notice');
      setConfirmDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00592D] mb-1">Notice Management</h1>
          <p className="text-sm text-gray-600">
            Create and manage announcements shared with students.
          </p>
        </div>
        <Button variant="primary" size="medium" onClick={openAddForm} icon={MdAdd}>
          Create Notice
        </Button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Search + status filter */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <MdSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            aria-label="Search notices by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices by title..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                statusFilter === f.value
                  ? 'bg-[#00592D] text-white border-[#00592D]'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {(search || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#00592D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notices...</p>
        </div>
      ) : notices.length === 0 ? (
        <Card hover={false}>
          <div className="p-10 text-center">
            <div className="w-14 h-14 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCampaign className="w-7 h-7 text-[#00592D]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No notices yet</h3>
            <p className="text-sm text-gray-500 mb-5">
              Create your first notice to start sharing updates with students.
            </p>
            <Button variant="primary" size="medium" onClick={openAddForm} icon={MdAdd}>
              Create Notice
            </Button>
          </div>
        </Card>
      ) : visibleNotices.length === 0 ? (
        <Card hover={false}>
          <div className="p-10 text-center text-gray-500">
            <p className="mb-3">No notices match your current search or filter.</p>
            <Button
              variant="ghost"
              size="small"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
            >
              Reset search &amp; filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleNotices.map((notice) => (
            <Card hover={false} key={notice.$id}>
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <StatusBadge status={notice.status} />
                      <PriorityBadge priority={notice.priority} />
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold capitalize">
                        {notice.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#1E4620] font-semibold capitalize">
                        {audienceLabel(notice.audience)}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 truncate">
                      {notice.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.summary}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      By {notice.authorName} · Created {formatDate(notice.createdAt)}
                      {notice.status === 'published' && notice.publishedAt
                        ? ` · Published ${formatDate(notice.publishedAt)}`
                        : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col lg:w-auto">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => openEditForm(notice)}
                      className="flex-1 lg:flex-initial"
                    >
                      <MdEdit className="w-4 h-4" />
                      Edit
                    </Button>

                    {notice.status === 'draft' && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => changeStatus(notice, 'published')}
                        disabled={busyId === notice.$id}
                        className="flex-1 lg:flex-initial border-[#00592D] text-[#00592D]"
                      >
                        <MdOutlinePushPin className="w-4 h-4" />
                        Publish
                      </Button>
                    )}

                    {notice.status === 'published' && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => changeStatus(notice, 'draft')}
                        disabled={busyId === notice.$id}
                        className="flex-1 lg:flex-initial border-gray-300 text-gray-600"
                      >
                        <MdUnpublished className="w-4 h-4" />
                        Unpublish
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => changeStatus(notice, 'archived')}
                      disabled={busyId === notice.$id || notice.status === 'archived'}
                      className="flex-1 lg:flex-initial border-gray-300 text-gray-600"
                    >
                      <MdArchive className="w-4 h-4" />
                      Archive
                    </Button>

                    {notice.status === 'archived' && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => changeStatus(notice, 'draft')}
                        disabled={busyId === notice.$id}
                        className="flex-1 lg:flex-initial border-gray-300 text-gray-600"
                      >
                        <MdRestartAlt className="w-4 h-4" />
                        Restore
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setConfirmDelete(notice)}
                      className="flex-1 lg:flex-initial border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <MdDelete className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#00592D]">
                    {editingNotice ? 'Edit Notice' : 'Create Notice'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
                  <FormField label="Title" required error={formErrors.title}>
                    <input
                      type="text"
                      required
                      value={form.title}
                      maxLength={MAX.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      placeholder="e.g. Course Registration Deadline"
                    />
                    <CharCounter value={form.title} max={MAX.title} />
                  </FormField>

                  <FormField label="Summary" required error={formErrors.summary}>
                    <textarea
                      rows={2}
                      required
                      value={form.summary}
                      maxLength={MAX.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      placeholder="Short summary for cards and previews"
                    />
                    <CharCounter value={form.summary} max={MAX.summary} />
                  </FormField>

                  <FormField label="Full Content" required error={formErrors.content}>
                    <RichTextEditor
                      value={form.content}
                      onChange={(html) => setForm({ ...form, content: html })}
                    />
                    <CharCounter value={form.content} max={MAX.content} />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Category" required error={formErrors.category}>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value as NoticeCategory })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      >
                        {CATEGORY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Audience" required error={formErrors.audience}>
                      <select
                        value={form.audience}
                        onChange={(e) =>
                          setForm({ ...form, audience: e.target.value as NoticeAudience })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      >
                        {AUDIENCE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Priority" required error={formErrors.priority}>
                      <select
                        value={form.priority}
                        onChange={(e) =>
                          setForm({ ...form, priority: e.target.value as NoticePriority })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      >
                        {PRIORITY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Status" required error={formErrors.status}>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            status: e.target.value as 'draft' | 'published'
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField
                    label="Expires At"
                    error={formErrors.expiresAt}
                    hint="Optional. Leave blank for no expiry."
                  >
                    <input
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00592D] focus:border-transparent"
                    />
                  </FormField>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="ghost" type="button" onClick={closeForm}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={formSubmitting}
                      icon={MdSave}
                    >
                      {formSubmitting
                        ? 'Saving...'
                        : editingNotice
                        ? 'Update Notice'
                        : 'Create Notice'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <MdWarning className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Delete Notice</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Delete{' '}
                  <span className="font-semibold text-[#00592D]">
                    &ldquo;{confirmDelete.title}&rdquo;
                  </span>
                  ? This action is permanent and cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" type="button" onClick={() => setConfirmDelete(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={deleting}
                    onClick={handleConfirmDelete}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- helpers ---------- */

function audienceLabel(audience: NoticeAudience): string {
  const map: Record<NoticeAudience, string> = {
    all: 'All Students',
    level_100: 'Level 100',
    level_200: 'Level 200',
    level_300: 'Level 300',
    level_400: 'Level 400'
  };
  return map[audience];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function StatusBadge({ status }: { status: NoticeStatus }) {
  const styles: Record<NoticeStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-[#E6F4EA] text-[#1E4620]',
    archived: 'bg-gray-200 text-gray-500'
  };
  const labels: Record<NoticeStatus, string> = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived'
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: NoticePriority }) {
  const styles: Record<NoticePriority, string> = {
    normal: 'bg-gray-100 text-gray-600',
    important: 'bg-[#FFF8E1] text-[#8a6d00] border border-[#F2A900]',
    urgent: 'bg-red-100 text-red-700 border border-red-300'
  };
  const labels: Record<NoticePriority, string> = {
    normal: 'Normal',
    important: 'Important',
    urgent: 'Urgent'
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const near = len > max * 0.9;
  return (
    <div className="text-right text-xs mt-1">
      <span className={near ? 'text-[#D98A00] font-medium' : 'text-gray-400'}>
        {len}/{max}
      </span>
    </div>
  );
}

function FormField({
  label,
  required,
  error,
  hint,
  children
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export default NoticeManagement;
