import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useFilters } from './useFilters';

export const useFilteredTasks = () => {
  const tasks = useSelector((state: RootState) => state.app.tasks);
  const { filters } = useFilters();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status.length && !filters.status.includes(task.status)) return false;
      if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
      if (filters.assigneeIds.length && !filters.assigneeIds.includes(task.assignee.id)) return false;
      
      const taskDate = new Date(task.dueDate).getTime();
      if (filters.dueDateFrom && taskDate < new Date(filters.dueDateFrom).getTime()) return false;
      if (filters.dueDateTo && taskDate > new Date(filters.dueDateTo).getTime()) return false;
      
      return true;
    });
  }, [tasks, filters]);

  return filteredTasks;
};
