import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const nebulaResponses = [
  "Greetings, cosmic explorer! I'm Nebula, your AI guide through the mysteries of the universe. How can I illuminate your path among the stars today?",
  "The cosmos whispers many secrets... What astronomical wonders would you like to explore?",
  "As vast as the universe itself, my knowledge spans galaxies. Ask me about planets, stars, or any celestial phenomena!",
  "From the birth of stars to the dance of galaxies, I'm here to share the wonders of space with you.",
  "The universe is full of incredible phenomena! Would you like to learn about black holes, nebulae, or perhaps the latest space discoveries?",
  "Every star has a story, every planet a tale. What cosmic narrative shall we explore together?",
  "I sense your curiosity burning bright like a supernova! What astronomical questions ignite your imagination?",
  "The celestial sphere holds infinite mysteries. Let me help you navigate through the cosmic knowledge!",
  "From quantum mechanics to cosmic inflation, the universe operates on principles both beautiful and complex. What fascinates you most?",
  "Like the aurora dancing across polar skies, let our conversation illuminate the wonders of space!"
];

const astronomyTopics = {
  "black hole": "Black holes are among the most fascinating objects in the universe! They're regions of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. Did you know that the supermassive black hole at the center of our galaxy, Sagittarius A*, has a mass of about 4 million suns?",
  "star": "Stars are cosmic furnaces that forge the elements essential for life! They're born in stellar nurseries called nebulae, live for millions to billions of years fusing hydrogen into helium, and die in spectacular ways - sometimes as supernovae that scatter heavy elements across the cosmos.",
  "planet": "Planets are celestial wanderers that orbit stars! In our solar system alone, we have eight diverse worlds, from scorching Venus to the gas giant Jupiter. Beyond our system, we've discovered thousands of exoplanets, some potentially harboring the conditions for life!",
  "galaxy": "Galaxies are vast collections of stars, gas, dust, and dark matter! Our Milky Way contains over 100 billion stars and is just one of trillions of galaxies in the observable universe. The nearest major galaxy, Andromeda, is racing toward us at 250,000 mph!",
  "nebula": "Nebulae are the cosmic clouds where stars are born and where they return when they die! These stellar nurseries and graveyards paint the universe in brilliant colors - from the red glow of hydrogen to the blue-green hues of oxygen.",
  "moon": "Moons are natural satellites that dance around planets! Our Moon stabilizes Earth's rotation and creates tides. Jupiter has 95 known moons, including Europa, which may harbor an ocean beneath its icy surface!",
  "comet": "Comets are cosmic snowballs from the outer reaches of our solar system! When they approach the Sun, they develop spectacular tails of gas and dust that can stretch millions of miles. They're time capsules from the early solar system!",
  "asteroid": "Asteroids are rocky remnants from the formation of our solar system! Most orbit between Mars and Jupiter in the asteroid belt. Some contain precious metals, and NASA is planning missions to mine them in the future!",
  "supernova": "Supernovae are the explosive deaths of massive stars! These cosmic fireworks can outshine entire galaxies and create elements heavier than iron. The shockwaves from supernovae can trigger the formation of new stars!",
  "telescope": "Telescopes are our windows to the universe! From Galileo's first observations to the James Webb Space Telescope's infrared vision, these instruments have revolutionized our understanding of the cosmos and revealed its hidden wonders."
};

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: '1',
        text: nebulaResponses[0],
        isUser: false,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [topic, response] of Object.entries(astronomyTopics)) {
      if (lowerMessage.includes(topic)) {
        return response;
      }
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello, stargazer! I'm Nebula, your cosmic companion. Ready to explore the wonders of the universe together?";
    }
    
    if (lowerMessage.includes('help')) {
      return "I'm here to help you explore the cosmos! Ask me about planets, stars, galaxies, black holes, or any astronomical phenomena. I can also share fascinating space facts and recent discoveries!";
    }
    
    if (lowerMessage.includes('space') || lowerMessage.includes('universe')) {
      return "The universe is an incredible place! It's about 13.8 billion years old, contains over 2 trillion galaxies, and is still expanding. What aspect of space would you like to explore?";
    }
    
    if (lowerMessage.includes('earth')) {
      return "Earth, our pale blue dot! It's the only known planet with life, has a protective magnetic field, and is perfectly positioned in the habitable zone. Did you know Earth is actually pear-shaped, not perfectly round?";
    }
    
    if (lowerMessage.includes('mars')) {
      return "Mars, the Red Planet! It has the largest volcano in the solar system (Olympus Mons), polar ice caps, and evidence of ancient water flows. NASA's rovers are currently exploring its surface for signs of past life!";
    }
    
    if (lowerMessage.includes('sun')) {
      return "Our Sun is a middle-aged star that's been shining for 4.6 billion years! It converts 600 million tons of hydrogen into helium every second, and its core temperature reaches 15 million degrees Celsius.";
    }

    const randomResponses = [
      "That's a fascinating question! The universe is full of mysteries waiting to be discovered. Could you tell me more about what specifically interests you?",
      "Your curiosity shines as bright as a quasar! While I ponder your question, perhaps you'd like to know about a related cosmic phenomenon?",
      "The cosmos has infinite stories to tell! What you're asking touches on the very fabric of space and time. Let me share what I know...",
      "Like the light from distant stars, your question travels across the vast expanse of knowledge. Let me illuminate this topic for you!",
      "In the grand cosmic dance, every question leads to new discoveries! What aspect of astronomy or space science would you like to explore?"
    ];
    
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <div className="bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl w-96 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Nebula</h3>
              <p className="text-gray-400 text-sm">Your Cosmic AI Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {!message.isUser && (
                  <div className="flex items-center space-x-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-400 font-medium">Nebula</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400 font-medium">Nebula</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about the cosmos..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};