import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { moveTask } from "../../store/store"
import type { Task, Status } from "../../types"
import { useFilteredTasks } from '../../hooks/useFilteredTasks'
import { useFilters } from '../../hooks/useFilters'
import ToDoTask from "./ToDoTask"
import InProgressTask from "./InProgressTask"
import InReviewTask from "./InReviewTask"
import DoneTask from "./DoneTask"

const KanbanBoard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const tasks = useFilteredTasks()
  const { hasActiveFilters, clearFilters } = useFilters()

  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<Status, Task[]>)

  // Drag State Refs
  const draggedTaskId = useRef<string | null>(null);
  const dragClone = useRef<HTMLElement | null>(null);
  const originalCard = useRef<HTMLElement | null>(null);
  const placeholder = useRef<HTMLElement | null>(null);
  const startOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const highlightDropZones = (x: number, y: number) => {
    removeHighlightDropZones();
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      if (el.getAttribute && el.getAttribute('data-status')) {
        el.classList.add('drag-over');
        break;
      }
    }
  };

  const removeHighlightDropZones = () => {
    document.querySelectorAll('[data-status].drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent, cardEl: HTMLDivElement, taskId: string) => {
    if ('touches' in e) {
      // Allow scroll behavior for touch instead of immediately capturing,
      // but if we are intercepting drag, preventDefault is helpful
      // We will only preventDefault if actively dragging
    } else {
      e.preventDefault();
    }
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = cardEl.getBoundingClientRect();
    startOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    draggedTaskId.current = taskId;
    originalCard.current = cardEl;

    const clone = cardEl.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = `${clientY - startOffset.current.y}px`;
    clone.style.left = `${clientX - startOffset.current.x}px`;
    clone.style.opacity = '0.9';
    clone.style.zIndex = '9999';
    clone.style.width = `${rect.width}px`;
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);
    dragClone.current = clone;

    const ph = document.createElement('div');
    ph.style.height = `${rect.height}px`;
    ph.style.backgroundColor = '#e2e8f0';
    ph.style.borderRadius = '0.375rem';
    originalCard.current.style.opacity = '0';
    originalCard.current.parentNode?.insertBefore(ph, originalCard.current);
    placeholder.current = ph;

    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
  };

  const moveDrag = (e: MouseEvent | TouchEvent) => {
    if (!dragClone.current) return;
    
    // Prevent scrolling while dragging horizontally or vertically
    if (e.cancelable) e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    
    dragClone.current.style.top = `${clientY - startOffset.current.y}px`;
    dragClone.current.style.left = `${clientX - startOffset.current.x}px`;

    highlightDropZones(clientX, clientY);
  };

  const endDrag = () => {
    const clone = dragClone.current;

    let targetStatus: Status | null = null;
    if (clone && draggedTaskId.current) {
      // Must read bounding rect BEFORE removing clone from DOM
      const rect = clone.getBoundingClientRect();
      const elements = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      for (const el of elements) {
        if (el.getAttribute && el.getAttribute('data-status')) {
          targetStatus = el.getAttribute('data-status') as Status;
          break;
        }
      }
    }

    if (clone) {
      document.body.removeChild(clone);
    }

    if (targetStatus && draggedTaskId.current) {
      dispatch(moveTask({ taskId: draggedTaskId.current, newStatus: targetStatus }));
    }

    if (originalCard.current) {
      originalCard.current.style.opacity = '';
    }
    if (placeholder.current) {
      placeholder.current.remove();
    }
    removeHighlightDropZones();

    draggedTaskId.current = null;
    dragClone.current = null;
    originalCard.current = null;
    placeholder.current = null;

    window.removeEventListener('mousemove', moveDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', moveDrag);
    window.removeEventListener('touchend', endDrag);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', moveDrag);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', moveDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full space-y-4 bg-slate-50 min-h-screen">
        <p className="text-gray-500 font-medium text-lg">No tasks match the current filters.</p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer transition"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto p-4 gap-4 h-full bg-slate-50 min-h-screen pt-6">
      <ToDoTask onStartDrag={startDrag} toDoTasks={tasksByStatus['To Do'] ?? []}/>
      <InProgressTask onStartDrag={startDrag} inProgressTasks={tasksByStatus['In Progress'] ?? []}/>
      <InReviewTask onStartDrag={startDrag} inReviewTasks={tasksByStatus['In Review'] ?? []}/>
      <DoneTask onStartDrag={startDrag} doneTasks={tasksByStatus['Done'] ?? []}/>
    </div>
  )
}

export default KanbanBoard
