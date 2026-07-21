import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournalEditor } from '../../hooks/useJournal';
import { useUserEmotionsCalendar } from '../../hooks/useUserEmotionsCalendar';
import { getEmotionNeonColor } from '../../utils/emotionUtils';
import BrandedLoadingScreen from '../../components/ui/BrandedLoadingScreen';
import Eyebrow from '../../components/ui/Eyebrow';
import NeonButton from '../../components/ui/NeonButton';
import SurfaceCard from '../../components/ui/SurfaceCard';
import StickerPicker from '../../components/journal/StickerPicker';
import LinkCheckInModal from '../../components/journal/LinkCheckInModal';
import EditorMenuDropdown from '../../components/journal/EditorMenuDropdown';
import JournalBodyEditor from '../../components/journal/JournalBodyEditor';
import JournalRichTextToolbar from '../../components/journal/JournalRichTextToolbar';
import JournalStickerLayer from '../../components/journal/JournalStickerLayer';
import DrawingOverlay from '../../components/journal/DrawingOverlay';
import AiAnalysisDisclaimer from '../../components/ai/AiAnalysisDisclaimer';

export default function JournalEditor({ entryId }) {
  const navigate = useNavigate();
  const { userEmotions } = useUserEmotionsCalendar();

  const {
    journalId,
    title,
    body,
    stickers,
    entryDate,
    linkedCheckIn,
    loading,
    notFound,
    saveState,
    isDirty,
    canSave,
    updateTitle,
    updateBody,
    updateEntryDate,
    addSticker,
    updateSticker,
    removeSticker,
    updateLinkedCheckIn,
    removeEntry,
    saveNow,
  } = useJournalEditor(entryId);

  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [pendingEmoji, setPendingEmoji] = useState(null);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [stickerEditMode, setStickerEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);

  const canvasRef = useRef(null);
  const stickerBtnRef = useRef(null);
  const menuBtnRef = useRef(null);
  const bodyEditorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  const placementMode = Boolean(pendingEmoji);
  const stickerModeActive = placementMode || stickerEditMode || Boolean(selectedStickerId);
  const textEditable = !stickerModeActive && !showDrawing;

  useEffect(() => {
    if (entryId === 'new' && journalId) {
      navigate(`/journal/${journalId}`, { replace: true });
    }
  }, [entryId, journalId, navigate]);

  useEffect(() => {
    if (loading) {
      bodyEditorRef.current = null;
      setEditorInstance(null);
    }
  }, [loading]);

  useEffect(() => {
    if (!pendingEmoji) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setPendingEmoji(null);
        setSelectedStickerId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pendingEmoji]);

  const handleEditorReady = useCallback((editor) => {
    bodyEditorRef.current = editor;
    setEditorInstance(editor);
  }, []);

  const handleStickerPick = (emoji) => {
    setShowStickerPicker(false);
    setPendingEmoji(emoji);
    setSelectedStickerId(null);
    setStickerEditMode(true);
  };

  const handlePlaceSticker = useCallback(
    (position) => {
      if (!pendingEmoji) return;
      addSticker({
        id: `${Date.now()}`,
        type: 'emoji',
        emoji: pendingEmoji,
        x: position.x,
        y: position.y,
        rotation: (Math.random() - 0.5) * 24,
        scaleX: 1,
        scaleY: 1,
      });
      setPendingEmoji(null);
      setStickerEditMode(true);
    },
    [addSticker, pendingEmoji],
  );

  const handleDrawingComplete = useCallback(
    (dataUrl) => {
      setShowDrawing(false);
      const stickerId = `${Date.now()}`;
      addSticker({
        id: stickerId,
        type: 'drawing',
        src: dataUrl,
        x: 50,
        y: 45,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      });
      setStickerEditMode(true);
      setSelectedStickerId(stickerId);
      setPendingEmoji(null);
    },
    [addSticker],
  );

  const handleOpenDrawing = () => {
    setShowDrawing(true);
    setShowStickerPicker(false);
    setPendingEmoji(null);
    setStickerEditMode(false);
    setSelectedStickerId(null);
  };

  const handleLinkConfirm = (checkInId) => {
    if (!checkInId) {
      updateLinkedCheckIn(null, null);
      return;
    }

    const selected = userEmotions.find((entry) => entry.id === checkInId);
    updateLinkedCheckIn(
      checkInId,
      selected
        ? {
            id: selected.id,
            label: selected.emotion?.emotion || selected.emotion?.name,
            emoji: selected.emotion?.emoji,
            creationDate: selected.creationDate,
            intensity: selected.intensity,
          }
        : { id: checkInId },
    );
  };

  const handleDelete = async () => {
    await removeEntry();
    navigate('/journal', { replace: true });
  };

  const linkedColor = linkedCheckIn?.label
    ? getEmotionNeonColor(linkedCheckIn.label)
    : '#9B5DE5';

  if (loading) {
    return <BrandedLoadingScreen message="Cargando entrada..." />;
  }

  if (notFound) {
    return (
      <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col items-center text-center gap-5">
        <SurfaceCard className="p-8 max-w-md">
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Esa entrada ya no existe
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>
            Puede haber sido eliminada o el enlace no es válido.
          </p>
          <NeonButton color="#F15BB5" onClick={() => navigate('/journal')}>
            VOLVER AL INICIO
          </NeonButton>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col min-h-[70vh] pb-28 lg:pb-8">
      <div
        className="flex items-center gap-2 px-4 lg:px-8 py-3 shrink-0 relative z-10"
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <button
          type="button"
          onClick={() => navigate('/journal')}
          className="font-pixel text-[8px] px-3 py-2 press-effect min-h-[44px] shrink-0"
          style={{ color: 'var(--text2)' }}
        >
          ← VOLVER
        </button>
        <Eyebrow color="#F15BB5" className="mb-0 shrink-0">
          ✎ CUADERNO
        </Eyebrow>
        <div className="flex-1 min-w-0" />

        <span
          className="font-pixel text-[7px] shrink-0 hidden sm:inline"
          aria-live="polite"
          style={{
            color:
              saveState === 'saved'
                ? '#39FF14'
                : saveState === 'error'
                  ? '#FF1E73'
                  : isDirty
                    ? '#FEE440'
                    : 'var(--text2)',
          }}
        >
          {saveState === 'saving' && 'Guardando...'}
          {saveState === 'saved' && 'Guardado ✓'}
          {saveState === 'error' && 'Error al guardar'}
          {saveState === 'idle' && isDirty && 'Cambios sin guardar'}
        </span>

        <button
          type="button"
          onClick={() => saveNow()}
          disabled={saveState === 'saving' || !canSave}
          className="font-pixel text-[7px] px-3 py-2 press-effect min-h-[44px] shrink-0"
          style={{
            border: `1px solid ${canSave ? '#F15BB5' : 'var(--border)'}`,
            borderRadius: 4,
            color: canSave ? '#F15BB5' : 'var(--text2)',
            backgroundColor: canSave ? '#F15BB520' : 'transparent',
            opacity: saveState === 'saving' || !canSave ? 0.6 : 1,
            cursor: saveState === 'saving' || !canSave ? 'not-allowed' : 'pointer',
          }}
          title="Guardar entrada"
        >
          GUARDAR
        </button>

        <button
          ref={stickerBtnRef}
          type="button"
          onClick={() => {
            setShowStickerPicker(true);
            setPendingEmoji(null);
          }}
          className="font-pixel text-[8px] px-3 py-2 press-effect min-h-[44px] min-w-[44px] shrink-0"
          style={{
            border: `1px solid ${showStickerPicker ? '#F15BB5' : 'var(--border)'}`,
            borderRadius: 4,
            color: showStickerPicker ? '#F15BB5' : 'var(--text2)',
            backgroundColor: showStickerPicker ? '#F15BB520' : 'transparent',
          }}
        >
          ✨ STICKER
        </button>

        <button
          type="button"
          onClick={() => {
            setStickerEditMode((v) => !v);
            setPendingEmoji(null);
            setSelectedStickerId(null);
          }}
          className="font-pixel text-[8px] px-3 py-2 press-effect min-h-[44px] shrink-0"
          style={{
            border: `1px solid ${stickerEditMode ? '#00F5D4' : 'var(--border)'}`,
            borderRadius: 4,
            color: stickerEditMode ? '#00F5D4' : 'var(--text2)',
            backgroundColor: stickerEditMode ? '#00F5D420' : 'transparent',
          }}
        >
          ✋ MOVER
        </button>

        <button
          ref={menuBtnRef}
          type="button"
          onClick={() => setShowMenu((open) => !open)}
          className="font-pixel text-[8px] px-3 py-2 press-effect min-h-[44px] min-w-[44px] shrink-0"
          style={{
            color: 'var(--text2)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            background: 'transparent',
          }}
          aria-label="Más opciones"
          aria-expanded={showMenu}
        >
          ···
        </button>

        <EditorMenuDropdown
          open={showMenu}
          onClose={() => setShowMenu(false)}
          anchorRef={menuBtnRef}
        >
          <button
            type="button"
            onClick={() => {
              setShowMenu(false);
              setShowLinkModal(true);
            }}
            className="w-full text-left px-3 py-3 text-sm min-h-[44px]"
            style={{ color: 'var(--text)' }}
          >
            Vincular check-in
          </button>
          {entryId !== 'new' && (
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                setShowDeleteConfirm(true);
              }}
              className="w-full text-left px-3 py-3 text-sm min-h-[44px]"
              style={{ color: '#FF1E73' }}
            >
              Eliminar entrada
            </button>
          )}
        </EditorMenuDropdown>
      </div>

      {(placementMode || stickerEditMode) && (
        <div
          className="px-4 lg:px-8 py-2 flex items-center justify-between gap-3"
          style={{
            backgroundColor: placementMode ? '#F15BB515' : '#00F5D415',
            borderBottom: `1px solid ${placementMode ? '#F15BB540' : '#00F5D440'}`,
          }}
        >
          <p className="text-sm" style={{ color: placementMode ? '#F15BB5' : '#00F5D4' }}>
            {placementMode
              ? `Tocá el cuaderno para colocar ${pendingEmoji}`
              : 'Modo mover — tocá un sticker para seleccionarlo'}
          </p>
          <button
            type="button"
            onClick={() => {
              setPendingEmoji(null);
              setStickerEditMode(false);
              setSelectedStickerId(null);
            }}
            className="font-pixel text-[7px] min-h-[44px] px-3 press-effect"
            style={{ color: 'var(--text2)' }}
          >
            LISTO
          </button>
        </div>
      )}

      {linkedCheckIn?.id && (
        <div className="px-4 lg:px-8 pt-4">
          <SurfaceCard className="p-3 flex items-center justify-between gap-3" borderLeft={linkedColor}>
            <div>
              <p className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
                CHECK-IN VINCULADO
              </p>
              <p className="font-display text-sm font-semibold" style={{ color: linkedColor }}>
                {linkedCheckIn.emoji} {linkedCheckIn.label || 'Check-in'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              className="font-pixel text-[7px] min-h-[44px] px-3 press-effect"
              style={{ color: '#00F5D4' }}
            >
              CAMBIAR
            </button>
          </SurfaceCard>
        </div>
      )}

      <div className="px-4 lg:px-8 py-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Título (opcional)"
          aria-label="Título"
          className="w-full p-3 rounded-lg text-sm outline-none font-display font-semibold min-h-[44px]"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
        <input
          type="datetime-local"
          value={entryDate}
          onChange={(e) => updateEntryDate(e.target.value)}
          aria-label="Fecha y hora"
          className="p-3 rounded-lg text-sm outline-none min-h-[44px]"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      <JournalRichTextToolbar
        editor={editorInstance}
        disabled={!textEditable}
        onDrawClick={handleOpenDrawing}
      />

      <div className="px-4 lg:px-8">
        <AiAnalysisDisclaimer context="journal" />
      </div>

      {selectedStickerId && (
        <p className="px-4 lg:px-8 pb-2 text-xs" style={{ color: 'var(--text2)' }}>
          Sticker seleccionado — arrastrá o eliminá con Supr
        </p>
      )}

      <div className="flex-1 mx-4 lg:mx-8 my-4">
        <div
          ref={canvasRef}
          className="relative w-full min-h-[400px] lg:min-h-[520px] journal-canvas"
          style={{
            backgroundColor: 'var(--bg2)',
            backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            borderRadius: 8,
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="relative z-[1]"
            style={{
              pointerEvents: textEditable ? 'auto' : 'none',
              opacity: textEditable ? 1 : 0.85,
            }}
          >
            <JournalBodyEditor
              body={body}
              onChange={updateBody}
              onEditorReady={handleEditorReady}
              editable={textEditable}
            />
          </div>

          <JournalStickerLayer
            stickers={stickers}
            selectedId={selectedStickerId}
            onSelect={(id) => {
              setSelectedStickerId(id);
              if (id) setStickerEditMode(true);
            }}
            onChange={updateSticker}
            onRemove={removeSticker}
            onPlace={handlePlaceSticker}
            placementMode={placementMode}
            interactionActive={stickerModeActive}
            containerRef={canvasRef}
          />
        </div>
      </div>

      <StickerPicker
        open={showStickerPicker}
        anchorRef={stickerBtnRef}
        onClose={() => setShowStickerPicker(false)}
        onSelectSticker={handleStickerPick}
      />

      <LinkCheckInModal
        open={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        checkIns={userEmotions}
        entryDate={entryDate}
        selectedId={linkedCheckIn?.id}
        onConfirm={handleLinkConfirm}
      />

      <DrawingOverlay
        open={showDrawing}
        onComplete={handleDrawingComplete}
        onDiscard={() => setShowDrawing(false)}
      />

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-journal-title"
        >
          <div className="w-full max-w-sm p-6 surface-card" style={{ borderRadius: 12 }}>
            <p id="delete-journal-title" className="font-display text-lg font-bold mb-2">
              ¿Eliminar esta entrada?
            </p>
            <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>
              No se puede recuperar.
            </p>
            <div className="flex gap-3">
              <NeonButton color="#FF1E73" className="flex-1" onClick={handleDelete}>
                ELIMINAR
              </NeonButton>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 font-pixel text-[8px] min-h-[44px]"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
