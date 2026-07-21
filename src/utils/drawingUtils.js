import { getStroke } from 'perfect-freehand';

export const DRAWING_COLORS = [
  { id: 'pink', value: '#F15BB5', label: 'Rosa' },
  { id: 'violet', value: '#9B5DE5', label: 'Violeta' },
  { id: 'cyan', value: '#00F5D4', label: 'Cian' },
  { id: 'yellow', value: '#FEE440', label: 'Amarillo' },
  { id: 'lime', value: '#39FF14', label: 'Lima' },
  { id: 'rose', value: '#FF1E73', label: 'Frambuesa' },
];

export const STROKE_SIZES = {
  thin: 3,
  medium: 8,
  thick: 16,
};

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );

  d.push('Z');
  return d.join(' ');
}

export function drawStrokeOnContext(ctx, stroke) {
  if (!stroke.points?.length) return;

  const outline = getStroke(stroke.points, {
    size: stroke.size,
    thinning: 0.62,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
  });

  if (outline.length < 2) return;

  const path = new Path2D(getSvgPathFromStroke(outline));

  ctx.save();
  if (stroke.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = stroke.color;
  }
  ctx.fill(path);
  ctx.restore();
}

export function redrawDrawingCanvas(canvas, strokes) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes.forEach((stroke) => drawStrokeOnContext(ctx, stroke));
}

function getContentBounds(strokes) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let hasPoints = false;

  strokes.forEach((stroke) => {
    if (stroke.tool === 'eraser') return;
    stroke.points.forEach(([x, y]) => {
      hasPoints = true;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  if (!hasPoints) return null;

  const pad = 20;
  return {
    x: Math.max(0, minX - pad),
    y: Math.max(0, minY - pad),
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}

export function exportDrawingAsDataUrl(canvas, strokes) {
  const bounds = getContentBounds(strokes);
  if (!bounds || bounds.width < 1 || bounds.height < 1) {
    return null;
  }

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = Math.ceil(bounds.width);
  exportCanvas.height = Math.ceil(bounds.height);
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) return null;

  const shifted = strokes.map((stroke) => ({
    ...stroke,
    points: stroke.points.map(([x, y, ...rest]) => [x - bounds.x, y - bounds.y, ...rest]),
  }));

  shifted.forEach((stroke) => drawStrokeOnContext(ctx, stroke));
  return exportCanvas.toDataURL('image/png');
}

export function getCanvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

export function hasDrawableContent(strokes) {
  return strokes.some((stroke) => stroke.tool === 'pen' && stroke.points.length > 1);
}
