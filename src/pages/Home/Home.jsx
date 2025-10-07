import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, TextField, Tooltip, Typography, Collapse } from '@mui/material';
import { AnimatePresence, motion } from "motion/react"
import LockIcon from '@mui/icons-material/Lock';
import TextRevealHome from '../../components/text/TextRevealHome';
import LavaBackground from '../../components/background/lavaBackground';
import egg320 from "../../assets/egg320.gif"
import eggfalling320 from "../../assets/eggfalling320.gif"

function Home() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selection, setSelection] = useState('hoy'); // 'hoy' | 'otro'
  const [dateValue, setDateValue] = useState(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [timeValue, setTimeValue] = useState(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${min}`;
  });

  //img animation
  const [showGif, setShowGif] = useState(false);
  const [phase, setPhase] = useState("falling");

  const creationDateIso = useMemo(() => {
    if (selection === 'hoy') {
      return new Date().toISOString();
    }
    const [year, month, day] = dateValue.split('-').map(Number);
    const [hour, minute] = timeValue.split(':').map(Number);
    const local = new Date(year, (month || 1) - 1, day || 1, hour || 0, minute || 0, 0, 0);
    return local.toISOString();
  }, [selection, dateValue, timeValue]);

  const handleHoyClick = () => {
    setIsMenuOpen((v) => !v);
  };

  const handleContinue = () => {
    try {
      sessionStorage.setItem('creationDate', creationDateIso);
    } catch {}
    navigate('/create');
  };

  useEffect(() => {
    if (showGif && phase === "falling") {
      const timer = setTimeout(() => setPhase("idle"), 4100); // duración de la caída
      return () => clearTimeout(timer);
    }
  }, [showGif, phase]);

  //bg color --> [#cdd8d2]
  return (
    <Box className="flex flex-col min-h-screen bg-radial-gradient(circle at top, #2C2545 0%, #1C1928 100%) text-white">
      <Box className="flex-1 flex flex-col items-center px-4 pt-12">
      <LavaBackground/>
        <TextRevealHome 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        setSelection={setSelection}
        onComplete={() => setShowGif(true) }
        />

        {selection === 'otro' && (
          <Stack spacing={2} className="mt-8 w-full max-w-sm">
            <TextField
              label="Fecha"
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ className: 'text-white' }}
              className="[&_.MuiInputBase-root]:!text-white [&_.MuiOutlinedInput-notchedOutline]:!border-gray-600 [&_.MuiInputBase-root]:!bg-gray-800"
            />
            <TextField
              label="Hora"
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ className: 'text-white' }}
              className="[&_.MuiInputBase-root]:!text-white [&_.MuiOutlinedInput-notchedOutline]:!border-gray-600 [&_.MuiInputBase-root]:!bg-gray-800"
            />
          </Stack>
        )}

        <AnimatePresence>
          { showGif && ( 
          <>
           { phase == "falling" && (
            <motion.img
              key="falling"
              src={eggfalling320}
              alt="Personaje cayendo"
              style={{
                position: "absolute",
                top: "0%",
                left: "20%",
                width: "200px",
                transform: "translate(-50%, 0)",
                pointerEvents: "none",
              }}
              initial={{ y: "-20%", opacity: 1 }}
              animate={{
                y: "50vh",
                opacity: 1,
                transition: {
                  duration: 4,
                  ease: "linear",
                },
              }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            />
           )}

           {phase == "idle" && (
             <motion.img 
             key="idle"
             src={egg320} 
             alt="Animacion" 
             style={{
               position: "absolute",
               top: "50%",
               left: "20%",
               width: "200px",
               transform: "translate(-50%, -50%)",
               pointerEvents: "none",
             }}
             //initial={{ y: 20, scale: 0.95 }}  // solo posición y escala inicial
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeOut"}}}
             //animate={{ y: 0, scale: 1 }}      // movimiento fluido
             //transition={{ duration: 1.5, ease: "easeIn" }}
             //exit={{ y: 20, scale: 0.95 }}     // si desaparece, también fluido
             /> 
           )}
          </>
          )}  
        </AnimatePresence>
      </Box>

      <Box className="px-4 pb-8">
        <Button
          onClick={handleContinue}
          variant="contained"
          color="primary"
          fullWidth
          className="!max-w-md !mx-auto !block !bg-purple-600 hover:!bg-purple-700 !text-white !font-semibold !py-3"
        >
          Continuar
        </Button>
        <Typography variant="caption" align="center" className="mt-2 block text-gray-400 select-none">
          creationDate: {creationDateIso}
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;