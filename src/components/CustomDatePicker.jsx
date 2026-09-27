import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './CustomDatePicker.css';

const MONTHS = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12'];
const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const CustomDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('days'); // 'days' | 'years'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(null);
  const dropdownRef = useRef(null);

  // Initialize from value (DD.MM.YYYY)
  useEffect(() => {
    if (value) {
      const [d, m, y] = value.split('.');
      if (d && m && y) {
        const date = new Date(y, parseInt(m)-1, d);
        setCurrentDate(date);
        setTempDate(date);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (view === 'years') {
      setTimeout(() => {
        const grid = document.getElementById('dp-years-grid-id');
        const selected = grid?.querySelector('.dp-selected');
        if (selected && grid) {
          grid.scrollTop = selected.offsetTop - grid.offsetTop - 50;
        }
      }, 0);
    }
  }, [view]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Make Monday 0, Sunday 6
  };

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    
    const days = [];
    // Prev month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    // Next month days to fill 42 slots (6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    return days;
  };

  const generateYears = () => {
    const years = [];
    for (let i = 1900; i <= 2030; i++) {
      years.push(i);
    }
    return years;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    if (nextDate.getFullYear() >= 2026) return;
    setCurrentDate(nextDate);
  };

  const selectDay = (dayObj) => {
    if (!dayObj.isCurrentMonth) return;
    // Don't allow selecting dates in disabled years (>= 2026)
    if (currentDate.getFullYear() >= 2026) return;
    setTempDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day));
  };

  const selectYear = (year) => {
    if (year >= 2026) return; // disabled
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('days');
  };

  const handleSelect = () => {
    if (tempDate) {
      const d = String(tempDate.getDate()).padStart(2, '0');
      const m = String(tempDate.getMonth() + 1).padStart(2, '0');
      const y = tempDate.getFullYear();
      onChange(`${d}.${m}.${y}`);
    }
    setIsOpen(false);
  };

  const formatDisplay = () => {
    return value || 'дд.мм.гггг';
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  return (
    <div className="custom-datepicker" ref={dropdownRef}>
      <div className="datepicker-input" onClick={() => setIsOpen(!isOpen)}>
        <span>{formatDisplay()}</span>
        <div className="datepicker-icons">
          {value && (
            <button className="dp-clear-btn" onClick={(e) => { e.stopPropagation(); onChange(''); setTempDate(null); }}>
              <X size={14} />
            </button>
          )}
          <Calendar size={18} color="#64748b" />
        </div>
      </div>
      
      {isOpen && (
        <div className="datepicker-dropdown">
          {view === 'days' ? (
            <div className="dp-days-view">
              <div className="dp-header">
                <button onClick={handlePrevMonth} className="dp-icon-btn"><ChevronLeft size={20}/></button>
                <div className="dp-header-text">
                  <span className="dp-month">{MONTHS[currentDate.getMonth()]}</span>
                  <span className="dp-year" onClick={() => setView('years')}>{currentDate.getFullYear()}</span>
                </div>
                <button onClick={handleNextMonth} className="dp-icon-btn"><ChevronRight size={20}/></button>
              </div>
              
              <div className="dp-weekdays">
                {DAYS.map(d => <span key={d}>{d}</span>)}
              </div>
              
              <div className="dp-days-grid">
                {generateDays().map((d, i) => {
                  const isSelected = tempDate && isSameDay(tempDate, new Date(currentDate.getFullYear(), currentDate.getMonth(), d.day));
                  return (
                    <button 
                      key={i} 
                      className={`dp-day-btn ${!d.isCurrentMonth ? 'dp-dim' : ''} ${d.isCurrentMonth && isSelected ? 'dp-selected' : ''}`}
                      onClick={() => selectDay(d)}
                    >
                      {d.day}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="dp-years-view">
              <button className="dp-back-btn" onClick={() => setView('days')}>Ortga qaytish</button>
              <div className="dp-years-grid" id="dp-years-grid-id">
                {generateYears().map(y => (
                  <button 
                    key={y} 
                    className={`dp-year-btn ${y === currentDate.getFullYear() ? 'dp-selected' : ''} ${y >= 2026 ? 'dp-disabled' : ''}`}
                    onClick={() => selectYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="dp-footer">
            <button className="dp-cancel" onClick={() => setIsOpen(false)}>Bekor qilish</button>
            <button className="dp-confirm" onClick={handleSelect}>Tanlash</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
