import React from 'react'
import type { Task } from '../../types'

const InReviewTask = ({ inReviewTasks }: { inReviewTasks: Task[] }) => {
  return (
    <div>
      {
        inReviewTasks.map(task=>(<div key={task.id}>{task.title}</div>))
      }
    </div>
  )
}

export default InReviewTask
