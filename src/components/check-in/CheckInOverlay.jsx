import { useEffect, useMemo, useState } from 'react';

import { useEmotions } from '../../hooks/useEmotions';

import { useUserEmotions } from '../../hooks/useUserEmotions';

import { getEmotionNeonColor, getIntensityOptions } from '../../utils/emotionUtils';

import { MOOD_TAGS } from '../../constants/moodTags.es';

import GrainOverlay from '../ui/GrainOverlay';

import Eyebrow from '../ui/Eyebrow';

import NeonButton from '../ui/NeonButton';

import EggAvatar from '../ui/EggAvatar';

import { useCheckIn } from '../../context/CheckInContext';

import { useToast } from '../../context/ToastContext';

import { getRequestErrorMessage } from '../../utils/networkError';



function getDefaultDateTime(initialDateTime) {

  if (!initialDateTime) return { date: '', time: '' };

  const start = initialDateTime.start

    ? new Date(initialDateTime.start)

    : new Date(initialDateTime);

  return {

    date: start.toISOString().slice(0, 10),

    time: start.toTimeString().slice(0, 5),

  };

}



function parseTagsFromEntry(entry) {

  if (Array.isArray(entry?.tags) && entry.tags.length) {

    return entry.tags;

  }

  return [];

}



export default function CheckInOverlay() {

  const {

    isOpen,

    closeCheckIn,

    initialDateTime,

    editEntry,

    isEditMode,

    notifySaved,

  } = useCheckIn();

  const { showToast } = useToast();

  const { emotions, loading, error } = useEmotions();

  const { saveEmotion, updateEmotion, saving, error: saveError } = useUserEmotions();



  const [layer, setLayer] = useState('pick');

  const [search, setSearch] = useState('');

  const [selected, setSelected] = useState(null);

  const [intensity, setIntensity] = useState(3);

  const [notes, setNotes] = useState('');

  const [tags, setTags] = useState([]);

  const [selectedDate, setSelectedDate] = useState('');

  const [selectedTime, setSelectedTime] = useState('');

  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);



  const intensityOptions = getIntensityOptions();



  useEffect(() => {

    if (!isOpen) {

      setLayer('pick');

      setSearch('');

      setSelected(null);

      setIntensity(3);

      setNotes('');

      setTags([]);

      setSaveErrorMsg('');

      setShowDiscardConfirm(false);

      return;

    }



    if (editEntry) {

      const emotionMatch = emotions.find(

        (e) => e.id === editEntry.emotion?.id,

      ) || {

        id: editEntry.emotion?.id,

        emotion: editEntry.emotion?.emotion || editEntry.emotion?.name,

        name: editEntry.emotion?.name || editEntry.emotion?.emotion,

        emoji: editEntry.emotion?.emoji,

      };

      setSelected(emotionMatch);

      setIntensity(editEntry.intensity || 3);

      setNotes(editEntry.note || '');

      setTags(parseTagsFromEntry(editEntry));

      setLayer('detail');

      return;

    }



    const defaults = getDefaultDateTime(initialDateTime);

    const now = new Date();

    setSelectedDate(defaults.date || now.toISOString().slice(0, 10));

    setSelectedTime(defaults.time || now.toTimeString().slice(0, 5));

    setLayer('pick');

  }, [isOpen, initialDateTime, editEntry, emotions]);



  const filteredEmotions = useMemo(() => {

    const query = search.trim().toLowerCase();

    if (!query) return emotions;

    return emotions.filter((emotion) => {

      const label = (emotion.emotion || emotion.name || '').toLowerCase();

      return label.includes(query);

    });

  }, [emotions, search]);



  const handleSelectEmotion = (emotion) => {

    setSelected(emotion);

  };



  const toggleTag = (tag) => {

    setTags((current) =>

      current.includes(tag)

        ? current.filter((x) => x !== tag)

        : [...current, tag],

    );

  };



  const persistEntry = async ({ quick = false } = {}) => {

    if (!selected) return;



    try {

      setSaveErrorMsg('');

      const payload = {

        emotion: selected.id,

        intensity: quick ? 3 : intensity,

        note: quick ? undefined : notes.trim() || undefined,

        tags: quick ? [] : tags,

        creationDate: isEditMode

          ? new Date(editEntry.creationDate)

          : new Date(`${selectedDate}T${selectedTime}:00`),

      };



      if (isEditMode) {

        await updateEmotion(editEntry.id, payload);

      } else {

        await saveEmotion(payload);

      }



      notifySaved();

      setLayer('success');

    } catch (err) {

      const message = getRequestErrorMessage(err, 'No se pudo guardar la emoción.');

      setSaveErrorMsg(message);

      showToast({

        message,

        onRetry: () => persistEntry({ quick }),

      });

    }

  };



  const handleCloseAttempt = () => {

    if (selected && layer !== 'success' && !isEditMode) {

      setShowDiscardConfirm(true);

      return;

    }

    closeCheckIn();

  };



  const selectedColor = useMemo(

    () => getEmotionNeonColor(selected?.emotion || selected?.name),

    [selected],

  );



  if (!isOpen) return null;



  return (

    <div

      className="fixed inset-0 z-50 flex animate-scale-in lg:justify-end"

      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}

      role="dialog"

      aria-modal="true"

      aria-labelledby="checkin-title"

      onClick={(e) => {

        if (e.target === e.currentTarget) handleCloseAttempt();

      }}

    >

      <div

        className="relative flex flex-col w-full h-full lg:h-full lg:w-[520px] lg:max-w-[520px] lg:shadow-2xl animate-scale-in"

        style={{ backgroundColor: 'var(--bg2)' }}

      >

        <GrainOverlay />



        <div

          className="flex items-center justify-between p-5 shrink-0"

          style={{ borderBottom: '1px solid var(--border)' }}

        >

          <div>

            <Eyebrow color="#00F5D4">

              ■ {isEditMode ? 'EDITAR' : 'REGISTRO EMOCIONAL'}

            </Eyebrow>

            <h2 id="checkin-title" className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>

              {layer === 'pick' && '¿Qué estás sintiendo?'}

              {layer === 'detail' && (isEditMode ? 'Editar registro' : 'Contame un poco más')}

              {layer === 'success' && 'Guardado ✓'}

            </h2>

          </div>

          <button

            type="button"

            onClick={handleCloseAttempt}

            className="font-pixel text-[9px] press-effect min-h-[44px] min-w-[44px]"

            style={{

              color: 'var(--text2)',

              border: '1px solid var(--border)',

              borderRadius: 4,

              padding: '6px 10px',

              cursor: 'pointer',

              background: 'transparent',

            }}

            aria-label="Cerrar registro emocional"

          >

            ✕ CERRAR

          </button>

        </div>



        <div className="flex-1 overflow-y-auto p-5">

          {loading && layer === 'pick' && (

            <p style={{ color: 'var(--text2)' }}>Cargando emociones...</p>

          )}

          {error && layer === 'pick' && (

            <p style={{ color: '#FF1E73' }}>{error}</p>

          )}



          {layer === 'pick' && !loading && (

            <div className="animate-fade-in flex flex-col gap-4">

              <input

                type="search"

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                placeholder="Buscá una emoción..."

                aria-label="Buscar emoción"

                className="w-full p-3 rounded-lg text-sm outline-none min-h-[44px]"

                style={{

                  backgroundColor: 'var(--surface)',

                  border: '1px solid var(--border)',

                  color: 'var(--text)',

                }}

              />



              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                {filteredEmotions.map((emotion) => {

                  const label = emotion.emotion || emotion.name;

                  const color = getEmotionNeonColor(label);

                  const isSelected = selected?.id === emotion.id;

                  return (

                    <button

                      key={emotion.id}

                      type="button"

                      onClick={() => handleSelectEmotion(emotion)}

                      className="press-effect flex flex-col items-center gap-2 p-4 min-h-[44px]"

                      style={{

                        backgroundColor: isSelected ? `${color}20` : 'var(--surface)',

                        border: `2px solid ${isSelected ? color : `${color}40`}`,

                        borderRadius: 8,

                        cursor: 'pointer',

                        boxShadow: isSelected ? `0 0 16px ${color}50` : 'none',

                      }}

                      aria-pressed={isSelected}

                      aria-label={label}

                    >

                      <span className="text-3xl">{emotion.emoji || '🙂'}</span>

                      <span

                        className="font-pixel text-[8px] text-center leading-tight"

                        style={{ color }}

                      >

                        {label}

                      </span>

                    </button>

                  );

                })}

              </div>



              {selected && (

                <div className="flex flex-col gap-3 pt-2">

                  <NeonButton color={selectedColor} onClick={() => persistEntry({ quick: true })} disabled={saving}>

                    {saving ? 'GUARDANDO...' : 'GUARDAR AHORA'}

                  </NeonButton>

                  <button

                    type="button"

                    onClick={() => setLayer('detail')}

                    className="font-pixel text-[8px] py-2 press-effect"

                    style={{

                      color: '#9B5DE5',

                      background: 'transparent',

                      border: 'none',

                      cursor: 'pointer',

                    }}

                  >

                    Agregar más detalle →

                  </button>

                </div>

              )}

            </div>

          )}



          {layer === 'detail' && selected && (

            <div className="animate-fade-in flex flex-col gap-5">

              <div

                className="flex items-center gap-4 p-4"

                style={{

                  backgroundColor: `${selectedColor}15`,

                  border: `2px solid ${selectedColor}`,

                  borderRadius: 8,

                  boxShadow: `0 0 20px ${selectedColor}30`,

                }}

              >

                <EggAvatar size={60} glow={selectedColor} />

                <div>

                  <p className="font-pixel text-[10px]" style={{ color: selectedColor }}>

                    SINTIENDO

                  </p>

                  <h3

                    className="font-display text-2xl font-bold"

                    style={{ color: selectedColor, textShadow: `0 0 12px ${selectedColor}` }}

                  >

                    {selected.emotion || selected.name}

                  </h3>

                </div>

              </div>



              {!isEditMode && (

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <Eyebrow color="#9B5DE5">◆ FECHA</Eyebrow>

                    <input

                      type="date"

                      value={selectedDate}

                      onChange={(e) => setSelectedDate(e.target.value)}

                      className="w-full p-3 rounded-lg text-sm"

                      style={{

                        backgroundColor: 'var(--surface)',

                        border: '1px solid var(--border)',

                        color: 'var(--text)',

                      }}

                    />

                  </div>

                  <div>

                    <Eyebrow color="#9B5DE5">◆ HORA</Eyebrow>

                    <input

                      type="time"

                      value={selectedTime}

                      onChange={(e) => setSelectedTime(e.target.value)}

                      className="w-full p-3 rounded-lg text-sm"

                      style={{

                        backgroundColor: 'var(--surface)',

                        border: '1px solid var(--border)',

                        color: 'var(--text)',

                      }}

                    />

                  </div>

                </div>

              )}



              <div>

                <Eyebrow color="#9B5DE5">◆ INTENSIDAD</Eyebrow>

                <div className="flex gap-2 mb-3">

                  {[1, 2, 3, 4, 5].map((n) => (

                    <button

                      key={n}

                      type="button"

                      onClick={() => setIntensity(n)}

                      className="flex-1 py-3 press-effect font-pixel text-[9px]"

                      style={{

                        backgroundColor: n <= intensity ? `${selectedColor}30` : 'var(--surface)',

                        border: `2px solid ${n <= intensity ? selectedColor : 'var(--border)'}`,

                        borderRadius: 4,

                        color: n <= intensity ? selectedColor : 'var(--text2)',

                        boxShadow: n <= intensity ? `0 0 8px ${selectedColor}40` : 'none',

                        cursor: 'pointer',

                      }}

                    >

                      {n}

                    </button>

                  ))}

                </div>

                <p className="font-pixel text-[8px] text-center" style={{ color: selectedColor }}>

                  {intensityOptions[intensity - 1]?.label}

                </p>

              </div>



              <div>

                <Eyebrow color="#F15BB5">✎ NOTAS (OPCIONAL)</Eyebrow>

                <textarea

                  value={notes}

                  onChange={(e) => setNotes(e.target.value)}

                  placeholder="¿Qué pasó? Sin presión..."

                  rows={4}

                  className="w-full p-3 text-sm rounded-lg resize-none outline-none"

                  style={{

                    backgroundColor: 'var(--surface)',

                    border: '1px solid var(--border)',

                    color: 'var(--text)',

                    boxSizing: 'border-box',

                  }}

                />

              </div>



              <div>

                <Eyebrow color="#00F5D4">◎ CONTEXTO</Eyebrow>

                <div className="flex flex-wrap gap-2">

                  {MOOD_TAGS.map((tag) => (

                    <button

                      key={tag}

                      type="button"

                      onClick={() => toggleTag(tag)}

                      className="font-pixel text-[8px] px-3 py-2 press-effect"

                      style={{

                        backgroundColor: tags.includes(tag) ? '#00F5D430' : 'var(--surface)',

                        border: `1px solid ${tags.includes(tag) ? '#00F5D4' : 'var(--border)'}`,

                        borderRadius: 4,

                        color: tags.includes(tag) ? '#00F5D4' : 'var(--text2)',

                        cursor: 'pointer',

                      }}

                    >

                      #{tag}

                    </button>

                  ))}

                </div>

              </div>



              {(saveErrorMsg || saveError) && (

                <p className="text-sm" style={{ color: '#FF1E73' }} role="alert">

                  {saveErrorMsg || saveError}

                </p>

              )}



              <div className="flex gap-3">

                <NeonButton

                  color="#9B5DE5"

                  onClick={() => persistEntry({ quick: false })}

                  className="flex-1"

                  disabled={saving}

                >

                  {saving ? 'GUARDANDO...' : isEditMode ? 'GUARDAR CAMBIOS' : 'GUARDAR'}

                </NeonButton>

                {!isEditMode && (

                  <button

                    type="button"

                    onClick={() => setLayer('pick')}

                    className="font-pixel text-[8px] px-4 py-2 press-effect"

                    style={{

                      color: 'var(--text2)',

                      border: '1px solid var(--border)',

                      borderRadius: 4,

                      cursor: 'pointer',

                      background: 'transparent',

                    }}

                  >

                    ← VOLVER

                  </button>

                )}

              </div>

            </div>

          )}



          {layer === 'success' && (

            <div className="animate-fade-in flex flex-col items-center justify-center pt-12 gap-6 text-center">

              <div className="animate-float">

                <EggAvatar size={120} glow="#39FF14" />

              </div>

              <div>

                <p className="font-pixel text-[9px] mb-2" style={{ color: '#39FF14' }}>

                  ✓ REGISTRADO

                </p>

                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>

                  ¡Entrada guardada!

                </h3>

                <p style={{ color: 'var(--text2)' }}>

                  Registrarte es un acto de cuidado. Lo estás haciendo muy bien.

                </p>

              </div>

              {selected && (

                <div

                  className="px-5 py-3"

                  style={{

                    backgroundColor: `${selectedColor}15`,

                    border: `1px solid ${selectedColor}`,

                    borderRadius: 8,

                  }}

                >

                  <span className="font-pixel text-[9px]" style={{ color: selectedColor }}>

                    {selected.emotion || selected.name} — {intensityOptions[intensity - 1]?.label}

                  </span>

                </div>

              )}

              <NeonButton color="#9B5DE5" onClick={closeCheckIn}>

                LISTO

              </NeonButton>

            </div>

          )}

        </div>

      </div>



      {showDiscardConfirm && (

        <div

          className="fixed inset-0 z-[60] flex items-center justify-center p-4"

          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}

        >

          <div

            className="w-full max-w-sm p-6 surface-card"

            style={{ borderRadius: 12, backgroundColor: 'var(--surface)' }}

          >

            <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>

              ¿Descartar este registro?

            </h3>

            <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>

              Perdés la emoción seleccionada si cerrás ahora.

            </p>

            <div className="flex gap-3">

              <NeonButton color="#FF1E73" onClick={closeCheckIn} className="flex-1">

                DESCARTAR

              </NeonButton>

              <button

                type="button"

                onClick={() => setShowDiscardConfirm(false)}

                className="flex-1 font-pixel text-[8px] py-3 press-effect"

                style={{

                  color: 'var(--text2)',

                  border: '1px solid var(--border)',

                  borderRadius: 4,

                  background: 'transparent',

                  cursor: 'pointer',

                }}

              >

                SEGUIR

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


