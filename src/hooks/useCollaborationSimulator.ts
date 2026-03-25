import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setUserViewing } from '../store/collaborationSlice';

export const useCollaborationSimulator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.app.tasks);

  useEffect(() => {
    if (tasks.length === 0) return;

    const intervals: ReturnType<typeof setInterval>[] = [];

    const userIds = ['user1', 'user2', 'user3', 'user4'];
    
    userIds.forEach((userId) => {
      const interval = setInterval(() => {
        // Randomly pick an event to simulate switching attention or dropping off
        const randomIndex = Math.floor(Math.random() * tasks.length);
        const taskId = tasks[randomIndex].id;
        
        // 10% chance to unfocus a task completely
        if (Math.random() > 0.9) {
          dispatch(setUserViewing({ userId, taskId: null }));
        } else {
          dispatch(setUserViewing({ userId, taskId }));
        }
      }, 5000 + Math.random() * 5000);
      
      intervals.push(interval);
    });

    return () => {
      intervals.forEach(clearInterval);
      
      // Cleanup: on unmount reset all viewing tracking
      userIds.forEach((userId) => {
        dispatch(setUserViewing({ userId, taskId: null }));
      });
    };
  }, [dispatch, tasks]);
};
