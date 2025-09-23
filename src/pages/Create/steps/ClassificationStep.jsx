import { useEffect, useMemo, useState } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-icon': {
    transition: 'transform 150ms ease, filter 150ms ease',
  },
  '& .MuiRating-iconHover': {
    transform: 'translateY(-2px) scale(1.05)',
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
  },
  '& .MuiRating-iconFilled': {
    transform: 'scale(1.08)',
  },
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'emocion mala',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'emocion neutral-mala',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'emocion neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'emocion neutral -buena',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'emocion buena',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export default function ClassificationStep({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const selectedLabel = useMemo(() => {
    switch (value) {
      case 'emocion buena':
        return 5;
      case 'emocion neutral -buena':
        return 4;
      case 'emocion neutral':
        return 3;
      case 'emocion neutral-mala':
        return 2;
      case 'emocion mala':
        return 1;
      default:
        return null;
    }
  }, [value]);

  const handleChange = (_, newValue) => {
    if (!newValue) return;
    const map = {
      5: 'emocion buena',
      4: 'emocion neutral -buena',
      3: 'emocion neutral',
      2: 'emocion neutral-mala',
      1: 'emocion mala',
    };
    onChange?.(map[newValue] || '');
  };

  return (
    <Fade in={mounted}>
      <Box className="flex flex-col items-center">
        <Typography variant="subtitle1" className="mb-4 text-gray-300">
          Selecciona cómo se clasifica tu emoción
        </Typography>
        <StyledRating
          name="classification"
          defaultValue={selectedLabel || 0}
          value={selectedLabel || null}
          max={5}
          IconContainerComponent={IconContainer}
          getLabelText={(val) => customIcons[val]?.label || ''}
          highlightSelectedOnly
          onChange={handleChange}
          className="scale-110"
        />
        <Typography variant="caption" className="mt-3 text-gray-400 min-h-5">
          {value || ' '}
        </Typography>
      </Box>
    </Fade>
  );
} 