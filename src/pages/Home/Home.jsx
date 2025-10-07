import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, TextField, Tooltip, Typography, Collapse } from '@mui/material';
import { motion } from "motion/react"
import LockIcon from '@mui/icons-material/Lock';
import TextRevealHome from '../../components/text/TextRevealHome';
import LavaBackground from '../../components/background/lavaBackground';

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

  const handleOtroDia = () => {
    setSelection('otro');
    setIsMenuOpen(false);
  };

  const handleContinue = () => {
    try {
      sessionStorage.setItem('creationDate', creationDateIso);
    } catch {}
    navigate('/create');
  };

  //bg color --> [#cdd8d2]
  return (
    <Box className="flex flex-col min-h-screen bg-radial-gradient(circle at top, #2C2545 0%, #1C1928 100%) text-white">
      <Box className="flex-1 flex flex-col items-center px-4 pt-12">
      <LavaBackground/>
        {/* <motion.h1 
        initial={{opacity: 0}} 
        animate={{ 
          opacity: [0,1,0.8,1],
          textShadow: ["0 0 0px #B094FF",
          "0 0 6px #B094FF",
          "0 0 12px #B094FF",
          "0 0 8px #B094FF, 0 0 24px #C9AFFF",]}}
          transition={{ duration: 1.8, ease: "easeInOut", times: [0,0.4,0.6,1]}}
          style={{
            fontFamily: "'Orbitron', sans-serif", 
            fontWeight: "400",
            textAlign: "center",
            fontSize: "2.5rem",
            color: "#e5deff",
            letterSpacing: "1px"
          }}
          >
          ¿Cómo me siento{' '}
          <span className="relative inline-block">
            {isMenuOpen && (
              <span className="absolute -inset-1 rounded-full ring-2 ring-purple-500 animate-pulse"></span>
            )}
            <motion.button
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 8px #FFB3B3, 0 0 16px #FFD580",
                color: "#FFD580",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                border: "none",
                background: "transparent",
                color: "#FFB3B3",
                fontWeight: 600,
                fontFamily: "'Orbitron', sans-serif",
                textShadow: "0 0 6px #FFB3B3, 0 0 12px #FFB3B355",
                cursor: "pointer",
                padding: "0 0.2em",
              }}
            >
              hoy
            </motion.button>  
            
            <Box
              id="hoy-radial-menu"
              className="pointer-events-none absolute left-1/2 top-1/2"
              aria-hidden={!isMenuOpen}
            >
              <Tooltip title="Disponible próximamente" placement="top" arrow>
                <span
                  className={`pointer-events-auto transition-all duration-300 absolute -translate-x-1/2 -translate-y-1/2 ${
                    isMenuOpen ? 'translate-x-24 opacity-100' : 'opacity-0'
                  }`}
                >
                  <Button
                    variant="contained"
                    disabled
                    startIcon={<LockIcon fontSize="small" />}
                    className="!bg-gray-700 !text-gray-400 !normal-case !text-sm !rounded-full px-3 py-2"
                  >
                    mañana
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </span>
          ?
        </motion.h1>

        <Collapse in={isMenuOpen} timeout={250} unmountOnExit>
          <Box className="mt-1 flex justify-center">
            <Button
              onClick={handleOtroDia}
              variant="contained"
              className="!bg-gray-800 hover:!bg-gray-700 !text-white !normal-case !text-sm !rounded-full"
            >
              otro día
            </Button>
          </Box>
        </Collapse> */}
        <TextRevealHome />

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

        <Paper
          variant="outlined"
          className="mt-10 h-40 w-full max-w-md bg-gray-800/40 border-gray-700 flex items-center justify-center text-gray-400"
        >
          Espacio para imagen
        </Paper>
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