import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import { normalizeSticker } from '../../utils/journalContentUtils';

function StickerNode({ sticker, isSelected, onSelect, onChange, stageSize, interactionActive, placementMode }) {
  const shapeRef = useRef(null);
  const trRef = useRef(null);
  const [image, setImage] = useState(null);

  const normalized = normalizeSticker(sticker);
  const x = (normalized.x / 100) * stageSize.width;
  const y = (normalized.y / 100) * stageSize.height;
  const fontSize = 36 * normalized.scaleX;

  useEffect(() => {
    if (normalized.type !== 'drawing' || !normalized.src) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = normalized.src;
  }, [normalized.type, normalized.src]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const draggable = interactionActive && isSelected && !placementMode;

  const commitTransform = useCallback(() => {
    const node = shapeRef.current;
    if (!node || !stageSize.width) return;

    const nodeScaleX = node.scaleX();
    const nodeScaleY = node.scaleY();
    const newX = (node.x() / stageSize.width) * 100;
    const newY = (node.y() / stageSize.height) * 100;

    // Scale is baked into fontSize/width — node scale is only temporary (transformer/drag).
    // Multiply so drag keeps stored scale and resize accumulates correctly.
    const newScaleX = Math.max(0.3, normalized.scaleX * nodeScaleX);
    const newScaleY = Math.max(0.3, normalized.scaleY * nodeScaleY);

    onChange(normalized.id, {
      x: newX,
      y: newY,
      rotation: node.rotation(),
      scaleX: newScaleX,
      scaleY: newScaleY,
    });

    node.scaleX(1);
    node.scaleY(1);
  }, [
    normalized.id,
    normalized.scaleX,
    normalized.scaleY,
    onChange,
    stageSize.height,
    stageSize.width,
  ]);

  if (normalized.type === 'drawing' && image) {
    const size = 80 * normalized.scaleX;
    return (
      <>
        <KonvaImage
          ref={shapeRef}
          image={image}
          x={x}
          y={y}
          width={size}
          height={size}
          offsetX={size / 2}
          offsetY={size / 2}
          rotation={normalized.rotation}
          draggable={draggable}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={commitTransform}
          onTransformEnd={commitTransform}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 24 || newBox.height < 24) return oldBox;
              return newBox;
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Text
        ref={shapeRef}
        text={normalized.emoji}
        x={x}
        y={y}
        fontSize={fontSize}
        offsetX={fontSize / 2}
        offsetY={fontSize / 2}
        rotation={normalized.rotation}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={commitTransform}
        onTransformEnd={commitTransform}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

export default function JournalStickerLayer({
  stickers,
  selectedId,
  onSelect,
  onChange,
  onRemove,
  onPlace,
  placementMode,
  interactionActive,
  containerRef,
}) {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setStageSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!selectedId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.closest('.journal-body-editor')) return;
        e.preventDefault();
        onRemove(selectedId);
        onSelect(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, onRemove, onSelect]);

  if (!stageSize.width || !stageSize.height) return null;

  const listening = interactionActive;

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      className="absolute inset-0"
      style={{
        zIndex: 2,
        pointerEvents: listening ? 'auto' : 'none',
        cursor: placementMode ? 'crosshair' : 'default',
      }}
      onMouseDown={(e) => {
        if (placementMode && e.target === e.target.getStage()) {
          const pos = e.target.getPointerPosition();
          if (pos) {
            onPlace({
              x: (pos.x / stageSize.width) * 100,
              y: (pos.y / stageSize.height) * 100,
            });
          }
        } else if (e.target === e.target.getStage()) {
          onSelect(null);
        }
      }}
      onTouchStart={(e) => {
        if (placementMode && e.target === e.target.getStage()) {
          const pos = e.target.getPointerPosition();
          if (pos) {
            onPlace({
              x: (pos.x / stageSize.width) * 100,
              y: (pos.y / stageSize.height) * 100,
            });
          }
        } else if (e.target === e.target.getStage()) {
          onSelect(null);
        }
      }}
    >
      <Layer>
        {stickers.map((sticker) => (
          <StickerNode
            key={sticker.id}
            sticker={sticker}
            isSelected={selectedId === sticker.id}
            onSelect={() => onSelect(sticker.id)}
            onChange={onChange}
            stageSize={stageSize}
            interactionActive={interactionActive}
            placementMode={placementMode}
          />
        ))}
      </Layer>
    </Stage>
  );
}
