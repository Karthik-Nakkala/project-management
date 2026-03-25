import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"
import type { Task, Status } from "../../types"
import ToDoTask from "./ToDoTask"
import InProgressTask from "./InProgressTask"
import InReviewTask from "./InReviewTask"
import DoneTask from "./DoneTask"


const KanbanBoard = () => {

    const tasks: Task[]=useSelector((state: RootState) => state.app.tasks)


    // Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';


    const tasksByStatus=tasks.reduce((acc,task)=>{

        if(!acc[task.status]){
            acc[task.status]=[];
        }

        acc[task.status].push(task);
        return acc;
    },{} as Record<Status, Task[]>)



  return (
    <div>
      <ToDoTask toDoTasks={tasksByStatus['To Do'] ?? []}/>
      <InProgressTask inProgressTasks={tasksByStatus['In Progress'] ?? []}/>
      <InReviewTask inReviewTasks={tasksByStatus['In Review'] ?? []}/>
      <DoneTask doneTasks={tasksByStatus['Done'] ?? []}/>
    </div>
  )
}



export default KanbanBoard
