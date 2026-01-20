'use client';
import { useEditor, EditorContent } from '@tiptap/react';
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
import { useEffect, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, List,
  CheckSquare, Link as LinkIcon, Image as ImageIcon,
  Quote, Redo, Undo, AlignLeft, AlignCenter, AlignRight,
  Highlighter, Palette, type LucideIcon
} from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TEXT_COLORS = [
  { name: 'Default', color: null },
  { name: 'Gray', color: '#6b7280' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Yellow', color: '#eab308' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Pink', color: '#ec4899' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', color: null },
  { name: 'Yellow', color: '#fef08a' },
  { name: 'Green', color: '#bbf7d0' },
  { name: 'Blue', color: '#bfdbfe' },
  { name: 'Purple', color: '#e9d5ff' },
  { name: 'Pink', color: '#fbcfe8' },
  { name: 'Orange', color: '#fed7aa' },
];

const MenuBar = ({ editor }: { editor: any }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  if (!editor) return null;

  const btnStyle = (isActive: boolean) => ({
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    color: isActive ? 'white' : 'var(--color-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  });

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Link URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolButton = ({
    onClick,
    isActive,
    title,
    Icon
  }: {
    onClick: () => void;
    isActive: boolean;
    title: string;
    Icon: LucideIcon;
  }) => (
    <button type="button" onClick={onClick} style={btnStyle(isActive)} title={title}>
      <Icon size={18} />
    </button>
  );

  const Divider = () => (
    <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 4px' }} />
  );

  return (
    <div style={{
      padding: '8px',
      borderBottom: '1px solid var(--color-border)',
      background: 'white',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Text formatting */}
      <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold" Icon={Bold} />
      <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic" Icon={Italic} />
      <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline" Icon={UnderlineIcon} />

      <Divider />

      {/* Text color */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
          style={{
            ...btnStyle(showColorPicker),
            position: 'relative',
          }}
          title="Text Color"
        >
          <Palette size={18} />
          <div style={{
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '3px',
            backgroundColor: editor.getAttributes('textStyle').color || 'var(--color-muted)',
            borderRadius: '1px',
          }} />
        </button>
        {showColorPicker && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            padding: '8px',
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            zIndex: 50,
          }}>
            {TEXT_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  if (c.color) {
                    editor.chain().focus().setColor(c.color).run();
                  } else {
                    editor.chain().focus().unsetColor().run();
                  }
                  setShowColorPicker(false);
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  border: c.color ? 'none' : '2px dashed var(--color-border)',
                  backgroundColor: c.color || 'white',
                  cursor: 'pointer',
                }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
          style={btnStyle(editor.isActive('highlight') || showHighlightPicker)}
          title="Highlight"
        >
          <Highlighter size={18} />
        </button>
        {showHighlightPicker && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            padding: '8px',
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            zIndex: 50,
          }}>
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  if (c.color) {
                    editor.chain().focus().toggleHighlight({ color: c.color }).run();
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                  }
                  setShowHighlightPicker(false);
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  border: c.color ? 'none' : '2px dashed var(--color-border)',
                  backgroundColor: c.color || 'white',
                  cursor: 'pointer',
                }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* Headings */}
      <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2" Icon={Heading2} />
      <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3" Icon={Heading3} />

      <Divider />

      {/* Alignment */}
      <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left" Icon={AlignLeft} />
      <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center" Icon={AlignCenter} />
      <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right" Icon={AlignRight} />

      <Divider />

      {/* Lists */}
      <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List" Icon={List} />
      <ToolButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List" Icon={CheckSquare} />

      <Divider />

      {/* Blocks & Media */}
      <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote" Icon={Quote} />
      <ToolButton onClick={addLink} isActive={editor.isActive('link')} title="Add Link" Icon={LinkIcon} />
      <ToolButton onClick={addImage} isActive={false} title="Add Image" Icon={ImageIcon} />

      <div style={{ flex: 1 }} />

      {/* Undo/Redo */}
      <ToolButton onClick={() => editor.chain().focus().undo().run()} isActive={false} title="Undo" Icon={Undo} />
      <ToolButton onClick={() => editor.chain().focus().redo().run()} isActive={false} title="Redo" Icon={Redo} />
    </div>
  );
};

export default function Editor({ value, onChange }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
      TaskItem.configure({ nested: true }),
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
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Update editor content when value prop changes (e.g., when restoring draft)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!isMounted) return <div style={{ minHeight: '300px', background: '#f8f9fa' }} />;

  return (
    <div className="editor-wrapper" style={{
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'white',
    }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
