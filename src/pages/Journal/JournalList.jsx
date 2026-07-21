import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import BrandedLoadingScreen from '../../components/ui/BrandedLoadingScreen';

import Eyebrow from '../../components/ui/Eyebrow';

import SurfaceCard from '../../components/ui/SurfaceCard';

import EggAvatar from '../../components/ui/EggAvatar';

import NeonButton from '../../components/ui/NeonButton';

import { useJournalList } from '../../hooks/useJournal';

import { filterJournalEntries, getFirstStickerEmoji } from '../../utils/journalUtils';
import { getEntryPreviewText } from '../../utils/journalContentUtils';

import { getEmotionNeonColor } from '../../utils/emotionUtils';



function groupByMonth(entries) {

  const groups = {};

  entries.forEach((entry) => {

    const date = new Date(entry.createdAt);

    const key = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

    if (!groups[key]) groups[key] = [];

    groups[key].push(entry);

  });

  return Object.entries(groups);

}



export default function JournalList() {

  const navigate = useNavigate();

  const { entries, loading } = useJournalList();

  const [search, setSearch] = useState('');

  const [dateFrom, setDateFrom] = useState('');

  const [dateTo, setDateTo] = useState('');



  const filteredEntries = useMemo(

    () => filterJournalEntries(entries, { query: search, dateFrom, dateTo }),

    [entries, search, dateFrom, dateTo],

  );



  if (loading) {

    return <BrandedLoadingScreen message="Cargando diario..." />;

  }



  if (!entries.length) {

    return (

      <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col items-center text-center gap-5">

        <EggAvatar size={96} glow="#F15BB5" />

        <div>

          <Eyebrow color="#F15BB5">✎ CUADERNO</Eyebrow>

          <h2 className="font-display text-2xl font-bold mt-2" style={{ color: 'var(--text)' }}>

            Tu cuaderno está en blanco

          </h2>

          <p className="text-sm mt-2 max-w-sm" style={{ color: 'var(--text2)' }}>

            Escribí lo primero que pase por tu cabeza.

          </p>

        </div>

        <NeonButton color="#F15BB5" onClick={() => navigate('/journal/new')}>

          EMPEZAR A ESCRIBIR

        </NeonButton>

      </div>

    );

  }



  const grouped = groupByMonth(filteredEntries);



  return (

    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">

      <div className="flex items-end justify-between gap-4">

        <div>

          <Eyebrow color="#F15BB5">✎ CUADERNO</Eyebrow>

          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>

            Tus entradas

          </h2>

        </div>

        <NeonButton color="#F15BB5" onClick={() => navigate('/journal/new')}>

          + NUEVA

        </NeonButton>

      </div>



      <SurfaceCard className="p-4 space-y-4">

        <div>

          <p className="font-pixel text-[7px] mb-2" style={{ color: 'var(--text2)' }}>

            BUSCAR

          </p>

          <input

            value={search}

            onChange={(e) => setSearch(e.target.value)}

            placeholder="Palabra clave en título o texto..."

            aria-label="Buscar entradas"

            className="w-full p-3 rounded-lg text-sm outline-none min-h-[44px]"

            style={{

              backgroundColor: 'var(--surface2)',

              border: '1px solid var(--border)',

              color: 'var(--text)',

            }}

          />

        </div>

        <div>

          <p className="font-pixel text-[7px] mb-2" style={{ color: 'var(--text2)' }}>

            FILTRAR POR FECHA

          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <input

              type="date"

              value={dateFrom}

              onChange={(e) => setDateFrom(e.target.value)}

              aria-label="Desde"

              className="w-full p-3 rounded-lg text-sm outline-none min-h-[44px]"

              style={{

                backgroundColor: 'var(--surface2)',

                border: '1px solid var(--border)',

                color: 'var(--text)',

              }}

            />

            <input

              type="date"

              value={dateTo}

              onChange={(e) => setDateTo(e.target.value)}

              aria-label="Hasta"

              className="w-full p-3 rounded-lg text-sm outline-none min-h-[44px]"

              style={{

                backgroundColor: 'var(--surface2)',

                border: '1px solid var(--border)',

                color: 'var(--text)',

              }}

            />

          </div>

        </div>

        {(search || dateFrom || dateTo) && (

          <button

            type="button"

            onClick={() => {

              setSearch('');

              setDateFrom('');

              setDateTo('');

            }}

            className="font-pixel text-[7px] press-effect min-h-[44px] px-3"

            style={{ color: '#00F5D4' }}

          >

            LIMPIAR FILTROS

          </button>

        )}

      </SurfaceCard>



      {!filteredEntries.length ? (

        <SurfaceCard className="p-6 text-center">

          <p style={{ color: 'var(--text2)' }}>No hay entradas con esos filtros.</p>

        </SurfaceCard>

      ) : (

        grouped.map(([month, monthEntries]) => (

          <div key={month}>

            <p className="font-pixel text-[8px] mb-3 capitalize" style={{ color: 'var(--text2)' }}>

              {month}

            </p>

            <div className="flex flex-col gap-3">

              {monthEntries.map((entry) => {

                const preview = getEntryPreviewText(entry) || 'Entrada sin texto';

                const title = entry.content?.title?.trim() || new Date(entry.createdAt).toLocaleDateString('es-AR');

                const sticker = getFirstStickerEmoji(entry);

                const linked = entry.linkedCheckIn;

                const linkedColor = linked?.label ? getEmotionNeonColor(linked.label) : '#9B5DE5';



                return (

                  <SurfaceCard

                    key={entry.id}

                    className="p-4 press-effect cursor-pointer"

                    onClick={() => navigate(`/journal/${entry.id}`)}

                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex-1 min-w-0">

                        <p className="font-display font-semibold" style={{ color: 'var(--text)' }}>{title}</p>

                        <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--text2)' }}>{preview}</p>

                        {linked && (

                          <p className="font-pixel text-[7px] mt-2" style={{ color: linkedColor }}>

                            {linked.emoji} vinculado a {linked.label}

                          </p>

                        )}

                      </div>

                      {sticker && (

                        <span className="text-2xl shrink-0" aria-hidden="true">{sticker}</span>

                      )}

                    </div>

                  </SurfaceCard>

                );

              })}

            </div>

          </div>

        ))

      )}

    </div>

  );

}

