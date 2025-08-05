import React, { useState, useEffect } from 'react';
import { Brain, Check, X, Trophy } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the closest star to Earth?",
    options: ["Alpha Centauri", "Sirius", "The Sun", "Proxima Centauri"],
    correct: 2,
    explanation: "The Sun is our closest star at about 93 million miles away. Proxima Centauri is the closest star outside our solar system."
  },
  {
    id: 2,
    question: "How many planets are in our solar system?",
    options: ["7", "8", "9", "10"],
    correct: 1,
    explanation: "There are 8 planets in our solar system since Pluto was reclassified as a dwarf planet in 2006."
  },
  {
    id: 3,
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Earth"],
    correct: 1,
    explanation: "Jupiter is the largest planet, with a mass greater than all other planets combined!"
  },
  {
    id: 4,
    question: "What galaxy do we live in?",
    options: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"],
    correct: 1,
    explanation: "We live in the Milky Way galaxy, which contains over 100 billion stars."
  },
  {
    id: 5,
    question: "What is a light-year?",
    options: ["A unit of time", "A unit of distance", "A unit of mass", "A unit of energy"],
    correct: 1,
    explanation: "A light-year is the distance light travels in one year, approximately 6 trillion miles."
  },
  {
    id: 6,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Mercury", "Jupiter"],
    correct: 1,
    explanation: "Mars appears red due to iron oxide (rust) on its surface."
  },
  {
    id: 7,
    question: "What is the hottest planet in our solar system?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correct: 1,
    explanation: "Venus is the hottest planet due to its thick atmosphere that traps heat, reaching 900°F (480°C)."
  },
  {
    id: 8,
    question: "How long does it take for light from the Sun to reach Earth?",
    options: ["8 seconds", "8 minutes", "8 hours", "8 days"],
    correct: 1,
    explanation: "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth."
  }
];

export const SpaceQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 10);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / (questions.length * 10)) * 100;
    if (percentage >= 80) return "Stellar performance! You're a space expert! 🌟";
    if (percentage >= 60) return "Great job! You know your way around the cosmos! 🚀";
    if (percentage >= 40) return "Not bad! Keep exploring the universe! 🌙";
    return "Keep learning about space - there's so much to discover! 🌍";
  };

  if (quizComplete) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
          <div className="text-4xl font-bold text-purple-400 mb-2">
            {score} / {questions.length * 10}
          </div>
          <p className="text-gray-300 mb-6">{getScoreMessage()}</p>
          <button
            onClick={resetQuiz}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <span>Question {currentQuestion + 1} of {questions.length}</span>
          </h3>
          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">Score: {score}</div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
        <h4 className="text-xl font-semibold text-white mb-6">
          {question.question}
        </h4>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={answered}
              className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
                !answered
                  ? 'bg-white/5 hover:bg-white/10 text-white'
                  : index === question.correct
                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                  : index === selectedAnswer && index !== question.correct
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answered && (
                  <div>
                    {index === question.correct && <Check className="w-5 h-5 text-green-400" />}
                    {index === selectedAnswer && index !== question.correct && <X className="w-5 h-5 text-red-400" />}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-gray-300 mb-4">{question.explanation}</p>
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};