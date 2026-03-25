import type { Task, Priority } from "../../types";
import { formatDueDate } from "../../utils/dateFormatter";

const priorityStyles: Record<Priority, string> = {
  Critical: "bg-red-500 text-white",
  High: "bg-orange-500 text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-green-500 text-white",
};

const TaskCard = ({ task }: { task: Task }) => {
  const { formatted, isOverdue } = formatDueDate(task.dueDate);

  return (
    <div className="bg-white rounded shadow p-3 hover:shadow-md transition flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-500">{task.id}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-3">{task.title}</h4>
      
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
        <span className={`text-xs font-medium ${isOverdue ? "text-red-500 font-bold" : "text-gray-500"}`}>
          {formatted}
        </span>
        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs ml-2 flex-shrink-0" title={task.assignee.name}>
          {task.assignee.initials}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
