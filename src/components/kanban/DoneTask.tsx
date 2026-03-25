import React from 'react'
import type { Task } from '../../types'

const DoneTask = ({ doneTasks }: { doneTasks: Task[] }) => {
  return (
    <div>
      {
        doneTasks.map(task=>(<div key={task.id}>{task.title}</div>))
      }
    </div>
  )
}

export default DoneTask
