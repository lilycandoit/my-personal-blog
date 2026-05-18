'use client';
import { useEditor, EditorContent, type Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  CheckSquare, Link as LinkIcon, Image as ImageIcon,
  Quote, Redo, Undo, AlignLeft, AlignCenter, AlignRight,
  type LucideIcon
} from 'lucide-react';
import { formatImageSize, prepareImageForUpload } from '@/lib/imageCompression';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ALLOWED_INLINE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_INLINE_IMAGE_SIZE = 10 * 1024 * 1024;

function getImageFiles(files: FileList | File[]): File[] {
  return Array.from(files).filter((file) => file.type.startsWith('image/'));
}

async function prepareInlineImage(file: File) {
  if (!ALLOWED_INLINE_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.');
  }

  const prepared = await prepareImageForUpload(file);

  if (prepared.file.size > MAX_INLINE_IMAGE_SIZE) {
    const size = formatImageSize(prepared.file.size);
    const gifNote = file.type === 'image/gif' ? ' GIFs are kept original to preserve animation.' : '';
    throw new Error(`Image is still too large after preparation (${size}). Maximum size is 10MB.${gifNote}`);
  }

  return prepared;
}

async function uploadInlineImage(file: File, originalName: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'blog_unsigned';

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary.');
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error('Cloudinary did not return an image URL.');
  }

  return {
    src: data.secure_url as string,
    alt: originalName,
    title: originalName,
  };
}

function ToolButton({
  onClick,
  isActive,
  title,
  Icon,
  disabled = false,
}: {
  onClick: () => void;
  isActive: boolean;
  title: string;
  Icon: LucideIcon;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`editor-toolbar-button ${isActive ? 'is-active' : ''}`}
      title={title}
    >
      <Icon size={18} />
    </button>
  );
}

function Divider() {
  return <div className="editor-toolbar-divider" />;
}

const MenuBar = ({
  editor,
  onImageFiles,
  isUploadingImage,
}: {
  editor: TiptapEditor | null;
  onImageFiles: (files: File[]) => void;
  isUploadingImage: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const addLink = () => {
    const url = window.prompt('Link URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const blockType = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : 'text';

  return (
    <div className="editor-toolbar">
      <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold" Icon={Bold} />
      <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic" Icon={Italic} />
      <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline" Icon={UnderlineIcon} />

      <Divider />

      <select
        aria-label="Text style"
        className="editor-style-select"
        value={blockType}
        onChange={(event) => {
          const nextType = event.target.value;
          if (nextType === 'h2') {
            editor.chain().focus().setHeading({ level: 2 }).run();
          } else if (nextType === 'h3') {
            editor.chain().focus().setHeading({ level: 3 }).run();
          } else {
            editor.chain().focus().setParagraph().run();
          }
        }}
      >
        <option value="text">Text</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select>

      <Divider />

      <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left" Icon={AlignLeft} />
      <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center" Icon={AlignCenter} />
      <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right" Icon={AlignRight} />

      <Divider />

      <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List" Icon={List} />
      <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List" Icon={ListOrdered} />
      <ToolButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List" Icon={CheckSquare} />

      <Divider />

      <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote" Icon={Quote} />
      <ToolButton onClick={addLink} isActive={editor.isActive('link')} title="Add Link" Icon={LinkIcon} />
      <ToolButton
        onClick={addImage}
        isActive={false}
        title={isUploadingImage ? 'Uploading Image' : 'Upload Inline Image'}
        Icon={ImageIcon}
        disabled={isUploadingImage}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={(event) => {
          const files = event.target.files ? getImageFiles(event.target.files) : [];
          if (files.length > 0) {
            onImageFiles(files);
          }
          event.target.value = '';
        }}
      />

      <div className="editor-toolbar-spacer" />

      <ToolButton onClick={() => editor.chain().focus().undo().run()} isActive={false} title="Undo" Icon={Undo} />
      <ToolButton onClick={() => editor.chain().focus().redo().run()} isActive={false} title="Redo" Icon={Redo} />
    </div>
  );
};

export default function Editor({ value, onChange }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const editorRef = useRef<TiptapEditor | null>(null);
  const onChangeRef = useRef(onChange);
  const changeTimeoutRef = useRef<number | null>(null);
  const lastEditorHtmlRef = useRef(value);
  const pendingHtmlRef = useRef<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current !== null) {
        window.clearTimeout(changeTimeoutRef.current);
      }
    };
  }, []);

  const flushPendingChange = useCallback(() => {
    if (changeTimeoutRef.current !== null) {
      window.clearTimeout(changeTimeoutRef.current);
      changeTimeoutRef.current = null;
    }

    if (pendingHtmlRef.current !== null) {
      onChangeRef.current(pendingHtmlRef.current);
      pendingHtmlRef.current = null;
    }
  }, []);

  const scheduleChange = useCallback((html: string) => {
    lastEditorHtmlRef.current = html;
    pendingHtmlRef.current = html;

    if (changeTimeoutRef.current !== null) {
      window.clearTimeout(changeTimeoutRef.current);
    }

    changeTimeoutRef.current = window.setTimeout(() => {
      flushPendingChange();
    }, 250);
  }, [flushPendingChange]);

  const insertInlineImages = useCallback(async (files: File[], position?: number) => {
    const editor = editorRef.current;
    if (!editor || editor.isDestroyed || files.length === 0) return;

    setUploadError(null);
    setUploadMessage(null);
    setIsUploadingImage(true);

    try {
      let insertAt = position;

      for (const [index, file] of files.entries()) {
        const countLabel = files.length > 1 ? ` ${index + 1} of ${files.length}` : '';
        setUploadMessage(`Preparing image${countLabel}...`);
        const prepared = await prepareInlineImage(file);

        setUploadMessage(
          prepared.compressed
            ? `Uploading compressed image${countLabel} (${formatImageSize(prepared.originalSize)} to ${formatImageSize(prepared.finalSize)})...`
            : `Uploading image${countLabel}...`
        );

        const attrs = await uploadInlineImage(prepared.file, file.name);
        const imageNode = { type: 'image', attrs };

        if (typeof insertAt === 'number') {
          editor.chain().focus().insertContentAt(insertAt, imageNode).run();
          insertAt += 1;
        } else {
          editor.chain().focus().setImage(attrs).run();
        }
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
      setUploadMessage(null);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Typography,
      Link.configure({ openOnClick: false }),
      Image,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
      handlePaste: (_view, event) => {
        const files = event.clipboardData?.files ? getImageFiles(event.clipboardData.files) : [];
        if (files.length === 0) return false;

        event.preventDefault();
        void insertInlineImages(files);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files?.length) return false;

        const files = getImageFiles(event.dataTransfer.files);
        if (files.length === 0) return false;

        event.preventDefault();
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void insertInlineImages(files, position);
        return true;
      },
      handleDOMEvents: {
        blur: () => {
          flushPendingChange();
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      scheduleChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Update editor content when value prop changes (e.g., when restoring draft)
  useEffect(() => {
    if (editor && value !== lastEditorHtmlRef.current) {
      lastEditorHtmlRef.current = value;
      pendingHtmlRef.current = null;
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!isMounted) return <div style={{ minHeight: '300px', background: '#f8f9fa' }} />;

  return (
    <div className="editor-wrapper">
      <MenuBar
        editor={editor}
        onImageFiles={insertInlineImages}
        isUploadingImage={isUploadingImage}
      />
      {(isUploadingImage || uploadError) && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: uploadError ? '#fef2f2' : '#eff6ff',
            borderBottom: '1px solid #e1e8f0',
            color: uploadError ? '#991b1b' : '#5d9cec',
            fontSize: '0.9rem',
          }}
        >
          {uploadError || uploadMessage || 'Uploading image...'}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
