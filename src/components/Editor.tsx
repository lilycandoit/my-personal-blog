'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import {
  Bold, Italic, Heading2, Heading3, List,
  CheckSquare, Link as LinkIcon, Image as ImageIcon,
  Quote, Redo, Undo
} from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
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
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div style={{
      padding: '8px',
      borderBottom: '1px solid var(--color-border)',
      background: 'white',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      alignItems: 'center'
    }}>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))} title="Bold"><Bold size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive('italic'))} title="Italic"><Italic size={18} /></button>
      <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 4px' }} />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))} title="H2"><Heading2 size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive('heading', { level: 3 }))} title="H3"><Heading3 size={18} /></button>
      <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 4px' }} />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))} title="Bullet List"><List size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()} style={btnStyle(editor.isActive('taskList'))} title="Task List"><CheckSquare size={18} /></button>
      <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 4px' }} />
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive('blockquote'))} title="Quote"><Quote size={18} /></button>
      <button type="button" onClick={addLink} style={btnStyle(editor.isActive('link'))} title="Add Link"><LinkIcon size={18} /></button>
      <button type="button" onClick={addImage} style={btnStyle(false)} title="Add Image"><ImageIcon size={18} /></button>
      <div style={{ flex: 1 }} />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} style={btnStyle(false)} title="Undo"><Undo size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} style={btnStyle(false)} title="Redo"><Redo size={18} /></button>
    </div>
  )
}

import { useEffect, useState } from 'react';

export default function Editor({ value, onChange }: EditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable link from StarterKit to avoid duplicate
        link: false,
      }),
      Typography,
      Link.configure({ openOnClick: false }),
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
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


