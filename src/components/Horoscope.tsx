import React, { useState, useEffect } from 'react';
import { Stars, Sparkles, Moon, Sun } from 'lucide-react';

interface HoroscopeProps {
  selectedDate: Date;
}

const zodiacSigns = [
  { name: 'Aries', dates: 'Mar 21 - Apr 19', symbol: '♈', element: 'Fire', planet: 'Mars' },
  { name: 'Taurus', dates: 'Apr 20 - May 20', symbol: '♉', element: 'Earth', planet: 'Venus' },
  { name: 'Gemini', dates: 'May 21 - Jun 20', symbol: '♊', element: 'Air', planet: 'Mercury' },
  { name: 'Cancer', dates: 'Jun 21 - Jul 22', symbol: '♋', element: 'Water', planet: 'Moon' },
  { name: 'Leo', dates: 'Jul 23 - Aug 22', symbol: '♌', element: 'Fire', planet: 'Sun' },
  { name: 'Virgo', dates: 'Aug 23 - Sep 22', symbol: '♍', element: 'Earth', planet: 'Mercury' },
  { name: 'Libra', dates: 'Sep 23 - Oct 22', symbol: '♎', element: 'Air', planet: 'Venus' },
  { name: 'Scorpio', dates: 'Oct 23 - Nov 21', symbol: '♏', element: 'Water', planet: 'Mars' },
  { name: 'Sagittarius', dates: 'Nov 22 - Dec 21', symbol: '♐', element: 'Fire', planet: 'Jupiter' },
  { name: 'Capricorn', dates: 'Dec 22 - Jan 19', symbol: '♑', element: 'Earth', planet: 'Saturn' },
  { name: 'Aquarius', dates: 'Jan 20 - Feb 18', symbol: '♒', element: 'Air', planet: 'Uranus' },
  { name: 'Pisces', dates: 'Feb 19 - Mar 20', symbol: '♓', element: 'Water', planet: 'Neptune' }
];

const horoscopeReadings = {
  general: [
    "The cosmic energies align favorably for new beginnings and creative endeavors.",
    "Today brings opportunities for deep reflection and spiritual growth.",
    "The stars encourage you to trust your intuition and embrace change.",
    "A harmonious day for relationships and meaningful connections.",
    "The universe supports your ambitions and long-term goals.",
    "Focus on balance and finding harmony in all aspects of life.",
    "Your natural talents shine brightly under today's celestial influence.",
    "The cosmic winds bring messages of hope and renewal.",
    "Today is perfect for meditation and connecting with your inner wisdom.",
    "The stars whisper secrets of abundance and prosperity."
  ],
  love: [
    "Venus dances through your romantic sector, bringing passion and deep connections.",
    "The moon's gentle influence opens hearts to new possibilities in love.",
    "Cosmic energies favor honest communication in relationships.",
    "Today's planetary alignment brings healing to matters of the heart.",
    "The stars encourage you to express your feelings openly and authentically.",
    "Love flows freely when you embrace vulnerability and trust.",
    "The universe conspires to bring soulmates together under today's sky.",
    "Romantic opportunities bloom like flowers under the cosmic light.",
    "Your heart chakra resonates with the frequency of universal love.",
    "The celestial dance above mirrors the dance of hearts below."
  ],
  career: [
    "Jupiter's influence brings expansion and growth in professional matters.",
    "The stars align to support your career ambitions and leadership qualities.",
    "Today's cosmic energy favors networking and building valuable connections.",
    "Your professional intuition is heightened by Mercury's position.",
    "The universe opens doors to new opportunities and advancement.",
    "Saturn's wisdom guides you toward long-term career stability.",
    "Creative projects receive special blessing from the cosmic forces.",
    "Your unique skills are recognized and appreciated by others.",
    "The planetary alignment supports bold moves in your career path.",
    "Success flows naturally when you align with your true purpose."
  ]
};

export const Horoscope: React.FC<HoroscopeProps> = ({ selectedDate }) => {
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [dailyReading, setDailyReading] = useState({
    general: '',
    love: '',
    career: ''
  });

  useEffect(() => {
    if (selectedSign) {
      const dateString = selectedDate.toDateString();
      const signIndex = zodiacSigns.findIndex(sign => sign.name === selectedSign);
      const dateHash = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      
      setDailyReading({
        general: horoscopeReadings.general[(dateHash + signIndex) % horoscopeReadings.general.length],
        love: horoscopeReadings.love[(dateHash + signIndex + 1) % horoscopeReadings.love.length],
        career: horoscopeReadings.career[(dateHash + signIndex + 2) % horoscopeReadings.career.length]
      });
    }
  }, [selectedSign, selectedDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Stars className="w-8 h-8 text-purple-400" />
          <span>Daily Horoscope</span>
          <Sparkles className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Discover what the stars have in store for {formatDate(selectedDate)}
        </p>
      </div>

      {!selectedSign ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {zodiacSigns.map((sign) => (
            <button
              key={sign.name}
              onClick={() => setSelectedSign(sign.name)}
              className="group p-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {sign.symbol}
                </div>
                <h3 className="text-white font-semibold mb-1">{sign.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{sign.dates}</p>
                <div className="flex items-center justify-center space-x-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    sign.element === 'Fire' ? 'bg-red-500/20 text-red-300' :
                    sign.element === 'Earth' ? 'bg-green-500/20 text-green-300' :
                    sign.element === 'Air' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {sign.element}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">
                {zodiacSigns.find(sign => sign.name === selectedSign)?.symbol}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedSign}</h3>
                <p className="text-gray-400">
                  {zodiacSigns.find(sign => sign.name === selectedSign)?.dates}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSign('')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Change Sign
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Stars className="w-6 h-6 text-purple-400" />
                <h4 className="text-xl font-semibold text-white">General</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{dailyReading.general}</p>
            </div>

            <div className="bg-gradient-to-br from-pink-600/20 to-red-800/20 backdrop-blur-md border border-pink-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Moon className="w-6 h-6 text-pink-400" />
                <h4 className="text-xl font-semibold text-white">Love</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{dailyReading.love}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-800/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sun className="w-6 h-6 text-blue-400" />
                <h4 className="text-xl font-semibold text-white">Career</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{dailyReading.career}</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Your Cosmic Profile</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400">Element:</span>
                <span className="ml-2 text-white font-medium">
                  {zodiacSigns.find(sign => sign.name === selectedSign)?.element}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Ruling Planet:</span>
                <span className="ml-2 text-white font-medium">
                  {zodiacSigns.find(sign => sign.name === selectedSign)?.planet}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};