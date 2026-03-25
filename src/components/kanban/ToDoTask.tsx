import React from 'react'
import type { Task } from '../../types'

const ToDoTask = ({ toDoTasks }: { toDoTasks: Task[] }) => {
  return (
    <div>
      {toDoTasks.map(task=>{
        return <div key={task.id}>{task.title}</div>
      })}
    </div>
  )
}

export default ToDoTask
