import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import { EMPTY_BODY } from '../../utils/journalContentUtils';

export default function JournalBodyEditor({
  body,
  onChange,
  onEditorReady,
  editable = true,
  placeholder = 'Empezá a escribir... o colocá un sticker ✨',
}) {
  const isExternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    content: body || EMPTY_BODY,
    editable,
    editorProps: {
      attributes: {
        class: 'journal-body-editor outline-none min-h-[320px] px-6 py-6 text-[15px] leading-relaxed',
        'aria-label': 'Contenido de la entrada',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isExternalUpdate.current) return;
      onChange(ed.getJSON());
    },
  });

  useEffect(() => {
    if (!onEditorReady) return undefined;
    if (editor) onEditorReady(editor);
    return () => onEditorReady(null);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor || !body) return;
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(body);
    if (current !== incoming) {
      isExternalUpdate.current = true;
      editor.commands.setContent(body, false);
      isExternalUpdate.current = false;
    }
  }, [editor, body]);

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editor, editable]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
