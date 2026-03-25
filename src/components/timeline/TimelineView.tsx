import { useMemo } from 'react';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { useFilters } from '../../hooks/useFilters';
import type { Priority } from '../../types';

const DAY_WIDTH = 40;
const ROW_HEIGHT = 44;

const TimelineView = () => {
  const filteredTasks = useFilteredTasks();
  const { clearFilters, hasActiveFilters } = useFilters();

  // Get current month range
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate day labels
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Compute if today is within month
  const todayInMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const todayX = todayInMonth ? (today.getDate() - 1) * DAY_WIDTH : null;

  // Helper to get x offset index for a date bounded inside the active month
  const getMonthClamp = (dateStr: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    
    // Check if the parsed date crosses month boundaries
    if (d < firstDayOfMonth) return 0; // clamp to 1st boundary
    if (d > lastDayOfMonth) return daysInMonth; // clamp to exact end boundary
    
    return d.getDate() - 1; // 0-indexed day for placement multiplier
  };

  // Filter tasks that actually intersect the current temporal month viewport
  const tasksInMonth = useMemo(() => {
    return filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const startDate = task.startDate ? new Date(task.startDate) : null;
      
      const dueInMonth = dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
      const startInMonth = startDate && startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
      
      // Keep tasks that span over the month bounds as well
      const spansMonth = startDate && startDate < firstDayOfMonth && dueDate > lastDayOfMonth;
      
      return dueInMonth || startInMonth || spansMonth;
    });
  }, [filteredTasks, currentMonth, currentYear, firstDayOfMonth, lastDayOfMonth]);

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full space-y-4 bg-slate-50 min-h-screen">
        <p className="text-gray-500 font-medium text-lg">No tasks match the current filters.</p>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer transition">
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  const priorityColors: Record<Priority, string> = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
  };

  return (
    <div className="p-4 overflow-x-auto overflow-y-auto bg-slate-50 relative h-full custom-scrollbar">
      <div style={{ width: daysInMonth * DAY_WIDTH, minHeight: '100%', position: 'relative' }} className="bg-white border border-gray-200 rounded-lg shadow-sm">
        
        {/* Day headers */}
        <div className="flex border-b border-gray-200 sticky top-0 bg-gray-50 z-20 shadow-sm rounded-t-lg">
          {days.map(day => (
            <div 
              key={day} 
              style={{ width: DAY_WIDTH }} 
              className={`flex-shrink-0 text-center py-2 text-xs font-semibold ${day === today.getDate() && todayInMonth ? 'text-blue-600 bg-blue-100/50' : 'text-gray-600 border-r border-gray-100'}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Vertical background tracking lines */}
        <div className="absolute top-[32px] bottom-0 left-0 right-0 flex pointer-events-none z-0">
          {days.map(day => (
             <div key={`grid-${day}`} style={{ width: DAY_WIDTH }} className="flex-shrink-0 border-r border-gray-50 h-full" />
          ))}
        </div>

        {/* Today tracking marker */}
        {todayX !== null && (
          <div
            className="absolute top-0 bottom-0 w-px bg-red-400 z-10 pointer-events-none opacity-50"
            style={{ left: todayX + DAY_WIDTH / 2 }}
          />
        )}

        {/* Task bounding logic mapping */}
        <div className="relative pt-4 pb-12 z-10" style={{ height: tasksInMonth.length * ROW_HEIGHT + 60 }}>
          {tasksInMonth.length === 0 && (
             <div className="text-center text-gray-500 mt-10 w-full absolute font-medium">No tasks span across this active month.</div>
          )}
          
          {tasksInMonth.map((task, idx) => {
            const startDate = task.startDate ? new Date(task.startDate) : null;
            let left = 0;
            let width = DAY_WIDTH;

            if (startDate) {
              const startDay = getMonthClamp(task.startDate);
              const endDay = getMonthClamp(task.dueDate);
              if (startDay !== null && endDay !== null) {
                left = startDay * DAY_WIDTH + (DAY_WIDTH * 0.1);
                // Min width guarantees tiny tasks aren't swallowed into sub-pixel nothingness
                width = Math.max((endDay - startDay) * DAY_WIDTH, DAY_WIDTH * 0.8); 
              }
            } else {
              // Single day due-date pinpoint marker logic for standard kanban tasks without an initial start date definition
              const dueDay = getMonthClamp(task.dueDate);
              if (dueDay !== null) {
                left = dueDay * DAY_WIDTH + (DAY_WIDTH * 0.25);
                width = DAY_WIDTH * 0.5;
              }
            }

            return (
              <div
                key={task.id}
                className={`absolute ${priorityColors[task.priority]} shadow rounded transition-transform hover:scale-[1.01] flex items-center overflow-hidden cursor-default`}
                style={{
                  top: idx * ROW_HEIGHT + 10,
                  left,
                  width,
                  height: 32,
                  zIndex: 10
                }}
                title={`${task.title}\nDue: ${task.dueDate}${startDate ? `\nStart: ${task.startDate}` : ''}`}
              >
                {!startDate && (
                   <div style={{width: 16, height: 16, border: '2px solid white', borderRadius: '50%', margin: 'auto' }} />
                )}
                <div className={`px-2 text-[11px] font-bold text-white whitespace-nowrap truncate opacity-90 ${!startDate ? 'hidden' : ''}`}>
                  {task.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
