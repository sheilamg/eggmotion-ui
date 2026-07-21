import { useCallback, useEffect, useRef, useState } from 'react';
import NeonButton from '../ui/NeonButton';
import {
  DRAWING_COLORS,
  STROKE_SIZES,
  exportDrawingAsDataUrl,
  getCanvasPoint,
  hasDrawableContent,
  redrawDrawingCanvas,
} from '../../utils/drawingUtils';

export default function DrawingOverlay({ open, onComplete, onDiscard }) {
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const currentStrokeRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [color, setColor] = useState(DRAWING_COLORS[0].value);
  const [sizeKey, setSizeKey] = useState('medium');
  const [tool, setTool] = useState('pen');
  const [strokeCount, setStrokeCount] = useState(0);
  const [canFinish, setCanFinish] = useState(false);

  const syncFinishState = useCallback(() => {
    setCanFinish(hasDrawableContent(strokesRef.current));
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawDrawingCanvas(canvas, strokesRef.current);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    strokesRef.current = [];
    currentStrokeRef.current = null;
    isDrawingRef.current = false;
    setStrokeCount(0);
    setCanFinish(false);
    setTool('pen');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [open, resizeCanvas]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const commitStroke = () => {
    if (currentStrokeRef.current?.points.length > 1) {
      strokesRef.current.push(currentStrokeRef.current);
      setStrokeCount(strokesRef.current.length);
      syncFinishState();
    }
    currentStrokeRef.current = null;
    isDrawingRef.current = false;
  };

  const handlePointerDown = (e) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    const { x, y } = getCanvasPoint(canvasRef.current, e.clientX, e.clientY);
    isDrawingRef.current = true;
    currentStrokeRef.current = {
      points: [[x, y, e.pressure || 0.5]],
      color,
      size: STROKE_SIZES[sizeKey],
      tool,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || !currentStrokeRef.current || !canvasRef.current) return;
    e.preventDefault();
    const { x, y } = getCanvasPoint(canvasRef.current, e.clientX, e.clientY);
    currentStrokeRef.current.points.push([x, y, e.pressure || 0.5]);
    redrawDrawingCanvas(canvasRef.current, [
      ...strokesRef.current,
      currentStrokeRef.current,
    ]);
  };

  const handlePointerUp = (e) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    canvasRef.current.releasePointerCapture(e.pointerId);
    commitStroke();
    if (canvasRef.current) {
      redrawDrawingCanvas(canvasRef.current, strokesRef.current);
    }
  };

  const handleUndo = () => {
    strokesRef.current.pop();
    setStrokeCount(strokesRef.current.length);
    syncFinishState();
    if (canvasRef.current) {
      redrawDrawingCanvas(canvasRef.current, strokesRef.current);
    }
  };

  const handleDone = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawableContent(strokesRef.current)) return;
    const dataUrl = exportDrawingAsDataUrl(canvas, strokesRef.current);
    if (dataUrl) onComplete(dataUrl);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ backgroundColor: 'var(--bg)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Modo dibujo"
    >
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <p className="font-pixel text-[8px] shrink-0" style={{ color: '#FEE440' }}>
          ✏ DIBUJO LIBRE
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          {DRAWING_COLORS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={tool === 'pen' && color === item.value}
              onClick={() => {
                setTool('pen');
                setColor(item.value);
              }}
              className="press-effect rounded-full min-h-[36px] min-w-[36px]"
              style={{
                width: 28,
                height: 28,
                backgroundColor: item.value,
                border:
                  tool === 'pen' && color === item.value
                    ? '2px solid var(--text)'
                    : '2px solid transparent',
                boxShadow: tool === 'pen' && color === item.value ? `0 0 10px ${item.value}` : 'none',
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {Object.entries(STROKE_SIZES).map(([key, value]) => (
            <button
              key={key}
              type="button"
              aria-pressed={sizeKey === key}
              onClick={() => setSizeKey(key)}
              className="font-pixel text-[7px] px-2 py-2 min-h-[36px] press-effect rounded"
              style={{
                color: sizeKey === key ? '#FEE440' : 'var(--text2)',
                border: `1px solid ${sizeKey === key ? '#FEE44080' : 'var(--border)'}`,
                backgroundColor: sizeKey === key ? '#FEE44015' : 'transparent',
              }}
            >
              {key === 'thin' ? 'FINO' : key === 'medium' ? 'MEDIO' : 'GRUESO'}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-pressed={tool === 'eraser'}
          onClick={() => setTool((t) => (t === 'eraser' ? 'pen' : 'eraser'))}
          className="font-pixel text-[7px] px-3 py-2 min-h-[36px] press-effect rounded"
          style={{
            color: tool === 'eraser' ? '#00F5D4' : 'var(--text2)',
            border: `1px solid ${tool === 'eraser' ? '#00F5D480' : 'var(--border)'}`,
            backgroundColor: tool === 'eraser' ? '#00F5D415' : 'transparent',
          }}
        >
          GOMA
        </button>

        <button
          type="button"
          onClick={handleUndo}
          disabled={strokeCount === 0}
          className="font-pixel text-[7px] px-3 py-2 min-h-[36px] press-effect rounded"
          style={{
            color: strokeCount > 0 ? 'var(--text)' : 'var(--text2)',
            border: '1px solid var(--border)',
            opacity: strokeCount > 0 ? 1 : 0.5,
          }}
        >
          DESHACER
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onDiscard}
          className="font-pixel text-[7px] px-3 py-2 min-h-[44px] press-effect"
          style={{ color: 'var(--text2)' }}
        >
          DESCARTAR
        </button>

        <NeonButton color="#FEE440" disabled={!canFinish} onClick={handleDone}>
          LISTO
        </NeonButton>
      </div>

      <canvas
        ref={canvasRef}
        className="flex-1 w-full touch-none cursor-crosshair"
        style={{ backgroundColor: 'var(--bg2)' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
}
