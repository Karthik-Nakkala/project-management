import { useSearchParams } from 'react-router-dom';
import type { Status, Priority } from '../types';

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getArrayParam = (key: string): string[] => {
    return searchParams.getAll(key);
  };

  const status = getArrayParam('status') as Status[];
  const priority = getArrayParam('priority') as Priority[];
  const assigneeIds = getArrayParam('assignee');
  const dueDateFrom = searchParams.get('dueFrom');
  const dueDateTo = searchParams.get('dueTo');

  const updateFilters = (updates: Partial<{
    status: Status[];
    priority: Priority[];
    assigneeIds: string[];
    dueDateFrom: string | null;
    dueDateTo: string | null;
  }>) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (updates.status !== undefined) {
      newParams.delete('status');
      updates.status.forEach(s => newParams.append('status', s));
    }
    if (updates.priority !== undefined) {
      newParams.delete('priority');
      updates.priority.forEach(p => newParams.append('priority', p));
    }
    if (updates.assigneeIds !== undefined) {
      newParams.delete('assignee');
      updates.assigneeIds.forEach(id => newParams.append('assignee', id));
    }
    if (updates.dueDateFrom !== undefined) {
      if (updates.dueDateFrom) newParams.set('dueFrom', updates.dueDateFrom);
      else newParams.delete('dueFrom');
    }
    if (updates.dueDateTo !== undefined) {
      if (updates.dueDateTo) newParams.set('dueTo', updates.dueDateTo);
      else newParams.delete('dueTo');
    }
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = status.length > 0 || priority.length > 0 || assigneeIds.length > 0 || !!dueDateFrom || !!dueDateTo;

  return {
    filters: { status, priority, assigneeIds, dueDateFrom, dueDateTo },
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
};
