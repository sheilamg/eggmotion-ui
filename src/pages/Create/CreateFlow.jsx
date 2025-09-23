import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography, Zoom } from '@mui/material';
import ClassificationStep from './steps/ClassificationStep';

const steps = ['Clasificación', 'Detalle', 'Confirmación'];

function CreateFlow() {
  const [creationDate, setCreationDate] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [classification, setClassification] = useState('');

  useEffect(() => {
    try {
      const val = sessionStorage.getItem('creationDate');
      setCreationDate(val || '');
    } catch {
      setCreationDate('');
    }
  }, []);

  const isFirstStepCompleted = useMemo(() => Boolean(classification), [classification]);

  const handleNext = () => {
    if (activeStep === 0 && !isFirstStepCompleted) return;
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box className="min-h-screen bg-gray-900 text-white flex items-start pt-8 pb-10">
      <Container maxWidth="sm">
        <Paper variant="outlined" className="bg-gray-800 border-gray-700 p-4 sm:p-6">
          <Typography variant="h6" className="mb-4">Crear emoción</Typography>
          <Typography variant="caption" className="text-gray-400">creationDate: {creationDate || '—'}</Typography>

          <Box className="mt-4">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box className="mt-6">
            {activeStep === 0 && (
              <ClassificationStep
                value={classification}
                onChange={setClassification}
              />
            )}

            {activeStep === 1 && (
              <Box className="text-gray-300">Contenido del paso 2 (pendiente)</Box>
            )}

            {activeStep === 2 && (
              <Box className="text-gray-300">Contenido del paso 3 (pendiente)</Box>
            )}
          </Box>

          <Box className="mt-8 flex items-center justify-between">
            <Button
              variant="text"
              color="inherit"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Atrás
            </Button>

            <Zoom in={activeStep !== 0 || isFirstStepCompleted} unmountOnExit>
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  className="!bg-purple-600 hover:!bg-purple-700"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                </Button>
              </span>
            </Zoom>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreateFlow; 