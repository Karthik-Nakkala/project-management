import { Provider, useSelector, useDispatch } from 'react-redux'
import { store, setView } from './store/store'
import type { AppDispatch } from './store/store'
import KanbanBoard from './components/kanban/KanbanBoard'
import ListView from './components/list/ListView'
import FilterBar from './components/filters/FilterBar'
import TimelineView from './components/timeline/TimelineView'
import CollaborationBar from './components/collaboration/CollaborationBar'
import { useCollaborationSimulator } from './hooks/useCollaborationSimulator'

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentView = useSelector((state: any) => state.app.currentView);
  
  useCollaborationSimulator();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Velozity Project Management</h1>
        <div className="flex bg-gray-100 p-1 rounded-md">
          <button 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${currentView === 'kanban' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => dispatch(setView('kanban'))}
          >
            Kanban
          </button>
          <button 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${currentView === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => dispatch(setView('list'))}
          >
            List
          </button>
          <button 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${currentView === 'timeline' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => dispatch(setView('timeline'))}
          >
            Timeline
          </button>
        </div>
      </header>
      
      <CollaborationBar />
      <FilterBar />

      <main className="flex-1 overflow-hidden relative">
        {currentView === 'kanban' && <KanbanBoard />}
        {currentView === 'list' && <ListView />}
        {currentView === 'timeline' && <TimelineView />}
      </main>
    </div>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
