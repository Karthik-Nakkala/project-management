import React from 'react'
import type { Task } from '../../types'

const InProgressTask = ({ inProgressTasks }: { inProgressTasks: Task[] }) => {
  return (
    <div>
      {
        inProgressTasks.map(task=>{
            return <div key={task.id}>{task.title}</div>
        })
      }
    </div>
  )
}

export default InProgressTask
