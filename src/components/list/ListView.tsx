import { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveTask } from '../../store/store';
import type { RootState, AppDispatch } from '../../store/store';
import type { Priority, Status } from '../../types';
import { formatDueDate } from '../../utils/dateFormatter';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { useFilters } from '../../hooks/useFilters';

const ROW_HEIGHT = 60;
const BUFFER = 5;

const ListView = () => {
  const tasks = useFilteredTasks();
  const { hasActiveFilters, clearFilters } = useFilters();
  const dispatch = useDispatch<AppDispatch>();
  
  const activeUsers = useSelector((state: RootState) => state.collaboration.activeUsers);
  const userTaskMap = useSelector((state: RootState) => state.collaboration.userTaskMap);

  const [sortField, setSortField] = useState<'title' | 'priority' | 'dueDate'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sorted tasks
  const sortedTasks = useMemo(() => {
    const sorted = [...tasks];
    sorted.sort((a, b) => {
      if (sortField === 'title') {
        const cmp = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? cmp : -cmp;
      } else if (sortField === 'priority') {
        const priorityOrder: Record<Priority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        const cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
        return sortOrder === 'asc' ? cmp : -cmp;
      } else {
        // dueDate
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        const cmp = dateA - dateB;
        return sortOrder === 'asc' ? cmp : -cmp;
      }
    });
    return sorted;
  }, [tasks, sortField, sortOrder]);

  // Virtual scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => setScrollTop(container.scrollTop);
    const handleResize = () => setContainerHeight(container.clientHeight);
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial height calculation
    handleResize();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalRows = sortedTasks.length;
  // Calculate rendering window
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(totalRows - 1, Math.floor((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER);
  
  // Only slice the portion of the array currently visible + buffer
  const visibleRows = sortedTasks.slice(startIndex, endIndex + 1);

  const handleStatusChange = (taskId: string, newStatus: Status) => {
    dispatch(moveTask({ taskId, newStatus }));
  };

  const handleSort = (field: 'title' | 'priority' | 'dueDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full space-y-4 bg-slate-50">
        <p className="text-gray-500 font-medium text-lg">No tasks match the current filters.</p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer transition"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col bg-slate-50 w-full overflow-hidden">
      {/* Table header */}
      <div className="flex font-bold border-b border-gray-300 pb-3 mb-2 text-gray-700 mx-2">
        <div 
          className="w-1/3 cursor-pointer hover:bg-gray-100 p-1 rounded transition select-none flex items-center" 
          onClick={() => handleSort('title')}
        >
          Title {sortField === 'title' && <span className="ml-1 text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
        </div>
        <div 
          className="w-1/6 cursor-pointer hover:bg-gray-100 p-1 rounded transition select-none flex items-center" 
          onClick={() => handleSort('priority')}
        >
          Priority {sortField === 'priority' && <span className="ml-1 text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
        </div>
        <div 
          className="w-1/6 cursor-pointer hover:bg-gray-100 p-1 rounded transition select-none flex items-center" 
          onClick={() => handleSort('dueDate')}
        >
          Due Date {sortField === 'dueDate' && <span className="ml-1 text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
        </div>
        <div className="w-1/6 p-1 flex items-center">Status</div>
        <div className="w-1/6 p-1 flex items-center pl-4">Assignee</div>
      </div>

      {/* Virtual scroll container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto border border-gray-200 bg-white rounded-lg shadow-sm"
      >
        <div style={{ height: totalRows * ROW_HEIGHT, position: 'relative' }}>
          {visibleRows.map((task, idx) => {
            const actualIndex = startIndex + idx;
            const { formatted, isOverdue } = formatDueDate(task.dueDate);
            
            const collaborators = Object.entries(userTaskMap)
              .filter(([_, taskId]) => taskId === task.id)
              .map(([userId]) => activeUsers.find(u => u.id === userId))
              .filter(Boolean) as typeof activeUsers;

            const priorityColor = 
              task.priority === 'Critical' ? 'bg-red-500 text-white' :
              task.priority === 'High' ? 'bg-orange-500 text-white' :
              task.priority === 'Medium' ? 'bg-yellow-500 text-white' :
              'bg-green-500 text-white';

            return (
              <div
                key={task.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${actualIndex * ROW_HEIGHT}px)`,
                  height: ROW_HEIGHT,
                  width: '100%',
                }}
                className="flex items-center border-b border-gray-100 px-3 hover:bg-slate-50 transition-colors"
              >
                <div className="w-1/3 truncate font-medium text-gray-800 pr-4" title={task.title}>{task.title}</div>
                <div className="w-1/6 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${priorityColor}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="w-1/6 pr-4">
                  <span className={`text-sm font-medium ${isOverdue ? "text-red-500 font-bold" : "text-gray-500"}`}>
                    {formatted}
                  </span>
                </div>
                <div className="w-1/6 pr-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Status)}
                    className="border border-gray-300 rounded p-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 shadow-sm cursor-pointer"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="w-1/6 flex justify-start items-center pl-4 gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm" title={task.assignee.name}>
                    {task.assignee.initials}
                  </div>
                  
                  {collaborators.length > 0 && (
                    <div className="flex -space-x-1.5 border-l pl-2 border-gray-200 transition-all duration-300">
                      {collaborators.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-white z-10 shadow-sm"
                          style={{ backgroundColor: user.color }}
                          title={`${user.name} is viewing this`}
                        >
                          {user.initials}
                        </div>
                      ))}
                      {collaborators.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-400 border border-white text-white flex items-center justify-center text-[9px] font-bold z-10 shadow-sm">
                          +{collaborators.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListView;
