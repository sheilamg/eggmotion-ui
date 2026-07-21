import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditorMenuDropdown({
  open,
  onClose,
  anchorRef,
  children,
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const update = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      const menuWidth = 220;
      let left = rect.right - menuWidth;
      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
      setPosition({ top: rect.bottom + 8, left });
    };

    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (
        anchorRef.current?.contains(e.target) ||
        e.target.closest('[data-editor-menu]')
      ) {
        return;
      }
      onClose();
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      data-editor-menu
      className="fixed z-[100] min-w-[220px] p-2 animate-fade-in"
      style={{
        top: position.top,
        left: position.left,
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
      role="menu"
    >
      {children}
    </div>,
    document.body,
  );
}
