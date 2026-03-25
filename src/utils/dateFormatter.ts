export const formatDueDate = (dueDate: string): { formatted: string; isOverdue: boolean } => {
  const dateObj = new Date(dueDate);
  const now = new Date();
  
  // Format string like 'Jan 12, 2024'
  const formatted = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate if overdue (ignoring time)
  // Set time components to 0 for a pure date comparison
  dateObj.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const isOverdue = dateObj.getTime() < now.getTime();

  return { formatted, isOverdue };
};
