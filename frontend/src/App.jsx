import React, { useState } from 'react';
import { Menu, PanelLeftOpen } from 'lucide-react';
import ProjectSidebar from './components/ProjectSidebar';
import TaskView from './components/TaskView';

const App = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Toggle - Visible on mobile when sidebar closed */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white rounded-md shadow-md text-slate-600 hover:text-slate-900 transition-colors border border-slate-100"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Desktop Sidebar Toggle - Floating button when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="hidden md:block fixed top-6 left-6 z-50 animate-in fade-in zoom-in duration-300">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white rounded-lg shadow-md text-slate-400 hover:text-indigo-600 transition-all border border-slate-200 hover:border-indigo-100 hover:shadow-lg"
            title="Open Sidebar"
          >
            <PanelLeftOpen size={20} />
          </button>
        </div>
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative
        ${isSidebarOpen ? 'md:translate-x-0 md:w-72 md:opacity-100' : 'md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden md:border-none'}
        `}
      >
        <div className="w-72 h-full flex flex-col"> 
          <ProjectSidebar
            selectedProjectId={selectedProject?._id}
            onSelectProject={(project) => {
              setSelectedProject(project);
              // On mobile, close sidebar after selection
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full transition-all duration-300">
        {selectedProject ? (
          <TaskView project={selectedProject} isSidebarOpen={isSidebarOpen} />
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-slate-50/50">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-sm shadow-indigo-100">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Welcome to TaskManager</h2>
            <p className="text-slate-500 max-w-md leading-relaxed text-lg">
              Select a project from the sidebar to view and manage your tasks, or create a new project to get started.
            </p>
          </div>
        )}
        
        {/* Mobile Empty State */}
        {!selectedProject && (
          <div className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center mt-16">
             <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">TaskManager</h2>
             <p className="text-slate-500 text-sm">Open the menu to select or create a project.</p>
          </div>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;