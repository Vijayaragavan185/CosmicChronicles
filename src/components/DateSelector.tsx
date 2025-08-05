import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onCalendarClick: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  onDateChange, 
  onCalendarClick 
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric'
    });
  };

  const changeDate = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + delta);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <button
        onClick={() => changeDate(-1)}
        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-300 hover:scale-105"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      
      <button
        onClick={onCalendarClick}
        className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <Calendar className="w-5 h-5 text-purple-400" />
        <span className="text-white font-medium text-lg">
          {formatDate(selectedDate)}
        </span>
      </button>
      
      <button
        onClick={() => changeDate(1)}
        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-300 hover:scale-105"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
      
      <button
        onClick={goToToday}
        className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
      >
        Today
      </button>
    </div>
  );
};