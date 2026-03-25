import React from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store, setView } from './store/store'
import type { RootState, AppDispatch } from './store/store'
import KanbanBoard from './components/kanban/KanbanBoard'
import ListView from './components/list/ListView'

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentView = useSelector((state: RootState) => state.app.currentView);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Velozity Project Management</h1>
        <div className="flex bg-gray-100 p-1 rounded-md">
          <button 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${currentView === 'kanban' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => dispatch(setView('kanban'))}
          >
            Kanban
          </button>
          <button 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${currentView === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => dispatch(setView('list'))}
          >
            List
          </button>
          <button 
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${currentView === 'timeline' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => dispatch(setView('timeline'))}
          >
            Timeline
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {currentView === 'kanban' && <KanbanBoard />}
        {currentView === 'list' && <ListView />}
        {currentView === 'timeline' && <div className="flex items-center justify-center p-8 h-full text-gray-500 font-medium">Timeline View Setup Pending</div>}
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
