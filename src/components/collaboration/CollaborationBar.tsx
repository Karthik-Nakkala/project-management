import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

const CollaborationBar = () => {
  const activeUsers = useSelector((state: RootState) => state.collaboration.activeUsers);
  const userTaskMap = useSelector((state: RootState) => state.collaboration.userTaskMap);

  const viewingCount = Object.values(userTaskMap).filter(taskId => taskId !== null).length;

  return (
    <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center text-sm shadow-inner z-10 relative">
      <div className="flex gap-2 items-center">
        <div className="flex -space-x-2">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold shadow-sm transition-transform hover:scale-110 hover:z-10 relative"
              style={{ backgroundColor: user.color }}
              title={`${user.name} - ${userTaskMap[user.id] ? 'Viewing ' + userTaskMap[user.id] : 'Idle'}`}
            >
              <div 
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${userTaskMap[user.id] ? 'bg-green-400' : 'bg-gray-400'}`}
              />
              {user.initials}
            </div>
          ))}
        </div>
        <span className="font-medium text-gray-700 ml-2">
           {viewingCount} collaborator{viewingCount === 1 ? ' is' : 's are'} actively viewing tasks
        </span>
      </div>
    </div>
  );
};

export default CollaborationBar;
