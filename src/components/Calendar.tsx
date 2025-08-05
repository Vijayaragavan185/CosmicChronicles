import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarProps {
  selectedDate: Date;
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  isOpen,
  onClose,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  if (!isOpen) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      days.push(
        <div
          className={`
            relative p-3 cursor-pointer transition-all duration-200 rounded-lg
            ${!isSameMonth(day, monthStart)
              ? "text-gray-500 hover:bg-white/5"
              : isSameDay(day, selectedDate)
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              : isSameDay(day, new Date())
              ? "bg-white/20 text-white hover:bg-white/30"
              : "text-white hover:bg-white/10"
            }
          `}
          key={day.toString()}
          onClick={() => onDateSelect(cloneDay)}
        >
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const monthFormat = "MMMM";

  const goToToday = () => {
    onDateSelect(new Date());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Select Date</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <h3 className="text-lg font-semibold text-white">
            {format(currentMonth, monthFormat)}
          </h3>
          
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {rows}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={goToToday}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
          >
            Go to Today
          </button>
        </div>
      </div>
    </div>
  );
};