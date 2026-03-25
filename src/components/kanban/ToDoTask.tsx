import type { Task } from '../../types'
import TaskCard from './TaskCard'

type StartDragFn = (e: React.MouseEvent | React.TouchEvent, cardEl: HTMLDivElement, taskId: string) => void;

const ToDoTask = ({ toDoTasks, onStartDrag }: { toDoTasks: Task[], onStartDrag: StartDragFn }) => {
  return (
    <div data-status="To Do" className="w-80 flex-shrink-0 bg-gray-100 rounded-lg p-3 flex flex-col max-h-[80vh] transition-colors">
      <div className="font-bold mb-3 pb-2 border-b border-gray-300 flex justify-between items-center text-gray-700">
        <span>To Do</span>
        <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs">{toDoTasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {toDoTasks.map(task => (
          <TaskCard key={task.id} task={task} onStartDrag={onStartDrag} />
        ))}
      </div>
    </div>
  )
}

export default ToDoTask
