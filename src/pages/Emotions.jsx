import React, { useState } from 'react';
import HappyIcon from '../components/icons/HappyIcon';
import CalmIcon from '../components/icons/CalmIcon';
import SadIcon from '../components/icons/SadIcon';
import AngryIcon from '../components/icons/AngryIcon';
import eggCharacter from '../assets/egg-character.png';
//import { createEmotion } from '../api/emotions';

const Emotions = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [note, setNote] = useState('');

  const handleEmotionClick = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleSave = async () => {
    if (selectedEmotion) {
      const today = new Date().toISOString().split('T')[0];
      //await createEmotion({ emotion: selectedEmotion, note, date: today });
      // Optionally, give user feedback
      setSelectedEmotion(null);
      setNote('');
    }
  };

  return (
    <div className="p-4 text-center text-white bg-gray-900 min-h-screen flex flex-col items-center">
      <div className="my-8">
        <img src={eggCharacter} alt="Egg Character" className="w-48 h-48 mx-auto" />
      </div>
      <h2 className="text-2xl mb-8">How are you feeling?</h2>
      <div className="flex justify-around w-full max-w-md my-8">
        <div onClick={() => handleEmotionClick('happy')} className={`cursor-pointer p-4 rounded-full transition-all duration-200 ${selectedEmotion === 'happy' ? 'bg-yellow-400 scale-110' : 'bg-gray-700'}`}>
          <HappyIcon />
          <p className="mt-2">Happy</p>
        </div>
        <div onClick={() => handleEmotionClick('calm')} className={`cursor-pointer p-4 rounded-full transition-all duration-200 ${selectedEmotion === 'calm' ? 'bg-blue-400 scale-110' : 'bg-gray-700'}`}>
          <CalmIcon />
          <p className="mt-2">Calm</p>
        </div>
        <div onClick={() => handleEmotionClick('sad')} className={`cursor-pointer p-4 rounded-full transition-all duration-200 ${selectedEmotion === 'sad' ? 'bg-gray-400 scale-110' : 'bg-gray-700'}`}>
          <SadIcon />
          <p className="mt-2">Sad</p>
        </div>
        <div onClick={() => handleEmotionClick('angry')} className={`cursor-pointer p-4 rounded-full transition-all duration-200 ${selectedEmotion === 'angry' ? 'bg-red-500 scale-110' : 'bg-gray-700'}`}>
          <AngryIcon />
          <p className="mt-2">Angry</p>
        </div>
      </div>
      <div className="my-8 w-full max-w-md">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Had a nice time at the park"
          className="w-full min-h-[100px] bg-gray-800 border-none text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-colors duration-300">
        Save
      </button>
    </div>
  );
};

export default Emotions; 