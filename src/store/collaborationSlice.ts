import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Collaborator {
  id: string;
  name: string;
  initials: string;
  color: string; 
}

interface CollaborationState {
  activeUsers: Collaborator[];
  userTaskMap: Record<string, string | null>; // userId -> taskId
}

const initialCollaborators: Collaborator[] = [
  { id: 'user1', name: 'Alice', initials: 'AL', color: '#10B981' }, // green
  { id: 'user2', name: 'Bob', initials: 'BO', color: '#3B82F6' },   // blue
  { id: 'user3', name: 'Charlie', initials: 'CH', color: '#F59E0B' }, // orange
  { id: 'user4', name: 'Diana', initials: 'DI', color: '#EF4444' },   // red
];

const initialState: CollaborationState = {
  activeUsers: initialCollaborators,
  userTaskMap: {
    user1: null,
    user2: null,
    user3: null,
    user4: null,
  },
};

export const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    setUserViewing: (state, action: PayloadAction<{ userId: string; taskId: string | null }>) => {
      const { userId, taskId } = action.payload;
      if (state.userTaskMap.hasOwnProperty(userId)) {
        state.userTaskMap[userId] = taskId;
      }
    },
  },
});

export const { setUserViewing } = collaborationSlice.actions;
export default collaborationSlice.reducer;
