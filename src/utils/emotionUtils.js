import HappyIcon from '../components/icons/HappyIcon';
import CalmIcon from '../components/icons/CalmIcon';
import SadIcon from '../components/icons/SadIcon';
import AngryIcon from '../components/icons/AngryIcon';

export const getEmotionIcon = (emotionName) => {
  const iconMap = {
    'happy': HappyIcon,
    'calm': CalmIcon,
    'sad': SadIcon,
    'angry': AngryIcon,
    'feliz': HappyIcon,
    'tranquilo': CalmIcon,
    'triste': SadIcon,
    'enojado': AngryIcon,
  };
  
  return iconMap[emotionName?.toLowerCase()] || HappyIcon;
};

export const getEmotionColor = (emotionName, isSelected = false) => {
  const colorMap = {
    'happy': isSelected ? 'bg-yellow-400' : 'bg-gray-700',
    'calm': isSelected ? 'bg-blue-400' : 'bg-gray-700',
    'sad': isSelected ? 'bg-gray-400' : 'bg-gray-700',
    'angry': isSelected ? 'bg-red-500' : 'bg-gray-700',
    'feliz': isSelected ? 'bg-yellow-400' : 'bg-gray-700',
    'tranquilo': isSelected ? 'bg-blue-400' : 'bg-gray-700',
    'triste': isSelected ? 'bg-gray-400' : 'bg-gray-700',
    'enojado': isSelected ? 'bg-red-500' : 'bg-gray-700',
  };
  
  return colorMap[emotionName?.toLowerCase()] || (isSelected ? 'bg-purple-400' : 'bg-gray-700');
};

export const getIntensityOptions = () => [
  { value: 1, label: 'Muy bajo' },
  { value: 2, label: 'Bajo' },
  { value: 3, label: 'Medio' },
  { value: 4, label: 'Alto' },
  { value: 5, label: 'Muy alto' }
];


