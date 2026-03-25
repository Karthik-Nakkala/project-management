import type { Task } from "../../types"
import TaskCard from "./TaskCard"

const InProgressTask = ({ inProgressTasks, onStartDrag }: { inProgressTasks: Task[], onStartDrag: any }) => {
  return (
    <div className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-3 flex flex-col shadow-sm" data-status="In Progress">
      <div className="font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex justify-between items-center">
        <span>In Progress</span>
        <span className="bg-gray-200 text-gray-600 text-xs py-1 px-2 rounded-full">{inProgressTasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-[150px] custom-scrollbar pb-10">
        {inProgressTasks.length === 0 ? (
          <div className="h-24 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
             <span className="text-gray-400 text-sm font-medium">No tasks</span>
          </div>
        ) : (
          inProgressTasks.map(task => <TaskCard key={task.id} task={task} onStartDrag={onStartDrag} />)
        )}
      </div>
    </div>
  )
}

export default InProgressTask
