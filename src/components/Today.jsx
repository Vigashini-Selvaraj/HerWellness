import React, { useState } from "react";
import "./Today.css"; // import your CSS

const TodayPage = ({ handlePageChange, userData }) => {
  const moods = ['Happy', 'Sad', 'Irritable', 'Anxious', 'Energetic', 'Tired', 'Neutral', 'Stressed'];
  const symptoms = ['Headache', 'Bloating', 'Cramps', 'Acne', 'Cravings', 'Tender Breasts', 'Nausea', 'Back Pain', 'Clear Skin', 'High Energy'];
  const energyLevels = ['Low', 'Medium', 'High'];
  const flowLevels = ['Spotting', 'Light', 'Medium', 'Heavy'];

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedEnergy, setSelectedEnergy] = useState('');
  const [selectedFlow, setSelectedFlow] = useState('');
  const [notes, setNotes] = useState('');

  const handleMoodClick = (mood) => {
    setSelectedMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  };

  const handleSymptomClick = (symptom) => {
    setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const handleSave = () => {
    console.log('Logging data:', { moods: selectedMoods, symptoms: selectedSymptoms, energy: selectedEnergy, flow: selectedFlow, notes });
    handlePageChange('home');
  };

  const nextPhaseDays = () => {
    const nextPeriodDate = new Date(userData?.nextPeriod);
    const today = new Date();
    const diffInTime = nextPeriodDate.getTime() - today.getTime();
    return Math.ceil(diffInTime / (1000 * 3600 * 24));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 text-gray-800">
      {/* Sidebar Nav - same as App.jsx */}
      <aside className="z-10 fixed bottom-0 w-full lg:static lg:w-20 bg-white lg:rounded-2xl lg:shadow-xl p-2 lg:h-screen lg:flex lg:flex-col items-center justify-start lg:m-4">
        <div className="flex justify-around lg:flex-col lg:space-y-4 w-full">
          <div className="py-3 px-4 rounded-full cursor-pointer bg-rose-500 text-white">📝 Today</div>
          <div onClick={() => handlePageChange('home')} className="py-3 px-4 rounded-full cursor-pointer bg-gray-100 hover:bg-rose-100">🏠 Home</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20 lg:pb-4 lg:p-8 space-y-6">
        <header className="lg:py-8 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-rose-800">
            Today's Log 📝
          </h1>
          <p className="text-lg text-gray-600 mt-2">Tell us how you are feeling today.</p>
        </header>

        {/* Mood & Symptom Selection */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 space-y-6">
          <div className="section">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Mood</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {moods.map(mood => (
                <button key={mood} onClick={() => handleMoodClick(mood)}
                  className={`py-3 px-4 rounded-full font-medium transition-all duration-200 ${selectedMoods.includes(mood) ? 'bg-rose-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-rose-100'}`}>
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save & Cancel */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleSave} className="py-3 px-6 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:scale-105">
            Log Data
          </button>
          <button onClick={() => handlePageChange('home')} className="py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-full shadow-lg hover:scale-105">
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
};

export default TodayPage;
