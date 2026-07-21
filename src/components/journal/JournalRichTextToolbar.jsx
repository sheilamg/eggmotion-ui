import { useEffect, useReducer } from 'react';

const TOOLBAR_GROUPS = [
  [
    { cmd: 'bold', label: 'B', title: 'Negrita', active: 'bold' },
    { cmd: 'italic', label: 'I', title: 'Cursiva', active: 'italic', className: 'italic' },
    { cmd: 'strike', label: 'S', title: 'Tachado', active: 'strike', className: 'line-through' },
  ],
  [
    { cmd: 'bulletList', label: '•', title: 'Lista con viñetas', active: 'bulletList' },
    { cmd: 'orderedList', label: '1.', title: 'Lista numerada', active: 'orderedList', className: 'text-[7px]' },
  ],
  [
    { cmd: 'undo', label: '↶', title: 'Deshacer' },
    { cmd: 'redo', label: '↷', title: 'Rehacer' },
  ],
];

function runCommand(editor, cmd) {
  const chain = editor.chain().focus();
  switch (cmd) {
    case 'bold':
      chain.toggleBold().run();
      break;
    case 'italic':
      chain.toggleItalic().run();
      break;
    case 'strike':
      chain.toggleStrike().run();
      break;
    case 'bulletList':
      chain.toggleBulletList().run();
      break;
    case 'orderedList':
      chain.toggleOrderedList().run();
      break;
    case 'undo':
      editor.commands.undo();
      break;
    case 'redo':
      editor.commands.redo();
      break;
    default:
      break;
  }
}

export default function JournalRichTextToolbar({ editor, disabled = false }) {
  const [, rerender] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    if (!editor) return undefined;
    const update = () => rerender();
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-1 px-4 lg:px-8 pb-2"
      role="toolbar"
      aria-label="Formato de texto"
    >
      <div
        className="inline-flex flex-wrap items-center gap-0.5 p-1 rounded-lg"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        {TOOLBAR_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center">
            {groupIndex > 0 && (
              <span
                className="mx-1 h-5 w-px shrink-0"
                style={{ backgroundColor: 'var(--border)' }}
                aria-hidden
              />
            )}
            {group.map(({ cmd, label, title, active, className = '' }) => {
              const isActive = active ? editor.isActive(active) : false;
              const canRun =
                cmd === 'undo'
                  ? editor.can().undo()
                  : cmd === 'redo'
                    ? editor.can().redo()
                    : true;

              return (
                <button
                  key={cmd}
                  type="button"
                  title={title}
                  aria-label={title}
                  aria-pressed={active ? isActive : undefined}
                  disabled={disabled || !canRun}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => runCommand(editor, cmd)}
                  className={`font-display text-xs font-bold min-h-[36px] min-w-[36px] px-2 press-effect rounded transition-colors ${className}`}
                  style={{
                    color: isActive ? '#F15BB5' : canRun ? 'var(--text)' : 'var(--text2)',
                    backgroundColor: isActive ? '#F15BB520' : 'transparent',
                    border: isActive ? '1px solid #F15BB560' : '1px solid transparent',
                    opacity: canRun ? 1 : 0.45,
                    cursor: disabled || !canRun ? 'not-allowed' : 'pointer',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
