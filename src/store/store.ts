import  { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, Status } from '../types';
import { generateTasks } from '../data/generateTasks';

// Generate initial tasks (500+)
const initialTasks: Task[] = generateTasks();

interface AppState {
  tasks: Task[];
  currentView: 'kanban' | 'list' | 'timeline';
}

const initialState: AppState = {
  tasks: initialTasks,
  currentView: 'kanban',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<AppState['currentView']>) => {
      state.currentView = action.payload;
    },
    // We'll add more reducers later for updating tasks, etc.
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newStatus: Status }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
      }
    },
  },
});

export const { setView, updateTask, moveTask } = appSlice.actions;

import collaborationReducer from './collaborationSlice';

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    collaboration: collaborationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;