export const formatDueDate = (dateStr: string) => {
  const due = new Date(dateStr);
  const now = new Date();
  
  // Normalize to midnight for accurate day difference tracking bounds
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = dueDay.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let formatted = '';
  let isOverdue = false;

  if (diffDays === 0) {
    formatted = 'Due Today';
    isOverdue = true; 
  } else if (diffDays < 0) {
    isOverdue = true;
    const daysOverdue = Math.abs(diffDays);
    if (daysOverdue > 7) {
      formatted = `${daysOverdue} days overdue`;
    } else {
      formatted = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } else {
    // Future date
    formatted = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return { formatted, isOverdue };
};
