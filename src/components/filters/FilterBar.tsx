import React, { useState } from 'react';
import { useFilters } from '../../hooks/useFilters';
import type { Status, Priority } from '../../types';
import { users } from '../../data/users';

const FilterBar = () => {
  const { filters, updateFilters, clearFilters, hasActiveFilters } = useFilters();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
  const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleStatusChange = (status: Status, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    updateFilters({ status: newStatus });
  };

  const handlePriorityChange = (priority: Priority, checked: boolean) => {
    const newPriority = checked
      ? [...filters.priority, priority]
      : filters.priority.filter(p => p !== priority);
    updateFilters({ priority: newPriority });
  };

  const handleAssigneeChange = (userId: string, checked: boolean) => {
    const newAssignee = checked
      ? [...filters.assigneeIds, userId]
      : filters.assigneeIds.filter(id => id !== userId);
    updateFilters({ assigneeIds: newAssignee });
  };

  const handleDueDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ dueDateFrom: e.target.value || null });
  };

  const handleDueDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ dueDateTo: e.target.value || null });
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white relative z-50">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('status')}
            className="border rounded px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700"
          >
            Status {filters.status.length > 0 && <span className="bg-blue-100 text-blue-800 ml-1 px-1.5 py-0.5 rounded-full text-xs">{filters.status.length}</span>}
          </button>
          {openDropdown === 'status' && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg p-2 z-30 min-w-[150px]">
              {statuses.map(s => (
                <label key={s} className="flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={filters.status.includes(s)}
                    onChange={(e) => handleStatusChange(s, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Priority dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('priority')}
            className="border rounded px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700"
          >
            Priority {filters.priority.length > 0 && <span className="bg-blue-100 text-blue-800 ml-1 px-1.5 py-0.5 rounded-full text-xs">{filters.priority.length}</span>}
          </button>
          {openDropdown === 'priority' && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg p-2 z-30 min-w-[150px]">
              {priorities.map(p => (
                <label key={p} className="flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={filters.priority.includes(p)}
                    onChange={(e) => handlePriorityChange(p, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">{p}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Assignee dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('assignee')}
            className="border rounded px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700"
          >
            Assignee {filters.assigneeIds.length > 0 && <span className="bg-blue-100 text-blue-800 ml-1 px-1.5 py-0.5 rounded-full text-xs">{filters.assigneeIds.length}</span>}
          </button>
          {openDropdown === 'assignee' && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg p-2 z-30 min-w-[200px]">
              {users.map(user => (
                <label key={user.id} className="flex items-center gap-2 py-1.5 px-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={filters.assigneeIds.includes(user.id)}
                    onChange={(e) => handleAssigneeChange(user.id, e.target.checked)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                      {user.initials}
                    </span>
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Due date range */}
        <div className="flex items-center border rounded bg-white overflow-hidden text-sm">
          <input
            type="date"
            value={filters.dueDateFrom || ''}
            onChange={handleDueDateFromChange}
            className="px-2 py-1.5 outline-none text-gray-700 w-[130px] cursor-pointer"
          />
          <span className="text-gray-400 px-1 bg-gray-50 py-1.5 border-x">to</span>
          <input
            type="date"
            value={filters.dueDateTo || ''}
            onChange={handleDueDateToChange}
            className="px-2 py-1.5 outline-none text-gray-700 w-[130px] cursor-pointer"
          />
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-700 font-medium ml-2 transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>
      
      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setOpenDropdown(null)} 
          style={{ backgroundColor: 'transparent' }}
        />
      )}
    </div>
  );
};

export default FilterBar;
