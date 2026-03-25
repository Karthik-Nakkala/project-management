import { useState, useEffect } from 'react';

interface DragState {
  isDragging: boolean;
  dragElement: HTMLElement | null;
  originalElement: HTMLElement | null;
  placeholderElement: HTMLElement | null;
  startX: number;
  startY: number;
}

export function useDrag() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragElement: null,
    originalElement: null,
    placeholderElement: null,
    startX: 0,
    startY: 0,
  });

  const startDrag = (e: React.MouseEvent | React.TouchEvent, originalElement: HTMLElement, taskId: string) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

     // Clone original element for drag image
    const clone = originalElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = `${clientY}px`;
    clone.style.left = `${clientX}px`;
    clone.style.opacity = '0.8';
    clone.style.zIndex = '9999';
    clone.style.width = `${originalElement.offsetWidth}px`;
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

     // Create placeholder in original position (same height)
    const placeholder = document.createElement('div');
    placeholder.style.height = `${originalElement.offsetHeight}px`;
    placeholder.style.margin = originalElement.style.margin;
    placeholder.style.backgroundColor = '#e2e8f0'; // grey
    placeholder.style.borderRadius = '0.375rem';
    originalElement.style.opacity = '0'; // hide original
    originalElement.parentNode?.insertBefore(placeholder, originalElement);

      // Store drag state
    setDragState({
      isDragging: true,
      dragElement: clone,
      originalElement,
      placeholderElement: placeholder,
      startX: clientX - originalElement.getBoundingClientRect().left,
      startY: clientY - originalElement.getBoundingClientRect().top,
    });

      // Store task ID globally for drop handler
    window.__dragTaskId = taskId;
  };

  const moveDrag = (e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging || !dragState.dragElement) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    dragState.dragElement.style.top = `${clientY - dragState.startY}px`;
    dragState.dragElement.style.left = `${clientX - dragState.startX}px`;

    // Highlight drop zones (we'll implement this later)
    highlightDropZones(clientX, clientY);
  };

  const endDrag = (onDrop: (taskId: string, targetStatus: string) => void) => {
    if (!dragState.isDragging) return;
    // Check drop target
    const targetElement = document.elementsFromPoint(
      (dragState.dragElement?.getBoundingClientRect().left ?? 0) + 10,
      (dragState.dragElement?.getBoundingClientRect().top ?? 0) + 10
    )[0];
    let targetStatus = null;
    // Find closest column with data-status attribute
    let el = targetElement;
    while (el && el !== document.body) {
      if (el.getAttribute && el.getAttribute('data-status')) {
        targetStatus = el.getAttribute('data-status');
        break;
      }

      el = el.parentElement!;
    }

    if (targetStatus && window.__dragTaskId) {
      onDrop(window.__dragTaskId, targetStatus);
    }

    // Cleaning up
    if (dragState.dragElement) document.body.removeChild(dragState.dragElement);
    if (dragState.originalElement) dragState.originalElement.style.opacity = '';
    if (dragState.placeholderElement) dragState.placeholderElement.remove();
    setDragState({
      isDragging: false,
      dragElement: null,
      originalElement: null,
      placeholderElement: null,
      startX: 0,
      startY: 0,
    });
    removeHighlightDropZones();
    window.__dragTaskId = null;
  };

  // Helper for highlight
  const highlightDropZones = (x: number, y: number) => {
    removeHighlightDropZones();
    const elements = document.elementsFromPoint(x, y);
    for (let el of elements) {
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

   useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', moveDrag);
      window.addEventListener('mouseup', () => endDrag(() => {})); // need proper onDrop
      window.addEventListener('touchmove', moveDrag);
      window.addEventListener('touchend', () => endDrag(() => {}));
      return () => {
        window.removeEventListener('mousemove', moveDrag);
        window.removeEventListener('mouseup', () => endDrag(() => {}));
        window.removeEventListener('touchmove', moveDrag);
        window.removeEventListener('touchend', () => endDrag(() => {}));
      };
    }
  }, [dragState.isDragging]);

    return { startDrag };
}


//this is global variable for task id
declare global {
  interface Window {
    __dragTaskId: string | null;
  }
}
window.__dragTaskId = null;