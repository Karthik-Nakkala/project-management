import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { Task, Priority } from "../../types";
import { formatDueDate } from "../../utils/dateFormatter";

const priorityStyles: Record<Priority, string> = {
  Critical: "bg-red-500 text-white",
  High: "bg-orange-500 text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-green-500 text-white",
};

type StartDragFn = (e: React.MouseEvent | React.TouchEvent, cardEl: HTMLDivElement, taskId: string) => void;

const TaskCard = ({ task, onStartDrag }: { task: Task, onStartDrag: StartDragFn }) => {
  const { formatted, isOverdue } = formatDueDate(task.dueDate);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const activeUsers = useSelector((state: RootState) => state.collaboration.activeUsers);
  const userTaskMap = useSelector((state: RootState) => state.collaboration.userTaskMap);

  const collaborators = Object.entries(userTaskMap)
    .filter(([_, taskId]) => taskId === task.id)
    .map(([userId]) => activeUsers.find(u => u.id === userId))
    .filter(Boolean) as typeof activeUsers;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current) {
      onStartDrag(e, cardRef.current, task.id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (cardRef.current) {
      onStartDrag(e, cardRef.current, task.id);
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="bg-white rounded shadow p-3 hover:shadow-md transition flex flex-col cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-500">{task.id}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-3">{task.title}</h4>
      
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
        <div className="flex flex-col">
           <span className={`text-xs font-medium ${isOverdue ? "text-red-500 font-bold" : "text-gray-500"}`}>
             {formatted}
           </span>
           {collaborators.length > 0 && (
            <div className="flex -space-x-1 mt-1.5 transition-all duration-300">
              {collaborators.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-white z-10 shadow-sm"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name} is viewing this`}
                >
                  {user.initials}
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-gray-400 border border-white text-white flex items-center justify-center text-[9px] z-10 shadow-sm">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
           )}
        </div>
        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs ml-2 flex-shrink-0 self-end shadow-sm" title={task.assignee.name}>
          {task.assignee.initials}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
