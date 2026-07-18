import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdTitle,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdLink,
  MdUndo,
  MdRedo
} from 'react-icons/md';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// Reusable admin rich text editor for the notice `content` field. Emits HTML
// (the parent form sanitizes before saving). Toolbar is limited to the
// IAAS-UG-approved formatting set.
const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
        underline: {}
      })
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'min-h-[160px] px-3 py-2 focus:outline-none rich-notice-content'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  // Keep the editor in sync when the form is opened for a different notice or
  // reset (e.g. switching add/edit, or closing/reopening the modal).
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400">
        Loading editor…
      </div>
    );
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (https://…)', previous || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
      .run();
  };

  const ToolbarButton = ({
    active,
    onClick,
    label,
    children
  }: {
    active?: boolean;
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        active ? 'bg-[#00592D] text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#00592D] focus-within:border-transparent">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <MdFormatBold className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <MdFormatItalic className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <MdFormatUnderlined className="w-5 h-5" />
        </ToolbarButton>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="flex items-center gap-1 text-sm font-semibold">
            <MdTitle className="w-4 h-4" />2
          </span>
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="flex items-center gap-1 text-sm font-semibold">
            <MdTitle className="w-4 h-4" />3
          </span>
        </ToolbarButton>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          label="Bullet List"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <MdFormatListBulleted className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered List"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <MdFormatListNumbered className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <MdFormatQuote className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor.isActive('link')}
          onClick={setLink}
        >
          <MdLink className="w-5 h-5" />
        </ToolbarButton>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <MdUndo className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <MdRedo className="w-5 h-5" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
};

export default RichTextEditor;
