import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Folder, Layout, ChevronRight, X, PanelLeftClose } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ProjectSidebar = ({ onSelectProject, selectedProjectId, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects?limit=50`);
      setProjects(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/projects`, { name: newProjectName, description: newProjectDesc });
      setProjects([...projects, response.data]);
      setNewProjectName('');
      setNewProjectDesc('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
        setProjects(projects.filter((p) => p._id !== projectId));
        if (selectedProjectId === projectId) {
          onSelectProject(null);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col shadow-lg z-10 font-sans">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 rounded-lg p-1.5 shadow-md shadow-indigo-200">
               <Layout className="text-white" size={20} />
             </div>
             <h2 className="text-lg font-bold text-slate-800 tracking-tight">TaskManager</h2>
          </div>
          
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`p-2 rounded-md transition-all ${isCreating ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
            title="Create Project"
          >
            {isCreating ? <X size={18} /> : <Plus size={20} />}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all md:block hidden"
            title="Close Sidebar"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>
        
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Projects</div>
      </div>

      {isCreating && (
        <div className="p-4 bg-slate-50 border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none h-20"
            />
            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {projects.length > 0 ? (
          <ul className="space-y-1">
            {projects.map((project) => (
              <li key={project._id} className="group relative">
                <button
                  onClick={() => onSelectProject(project)}
                  className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 ${
                    selectedProjectId === project._id 
                      ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm hover:translate-x-1'
                  }`}
                >
                  <Folder 
                    size={18} 
                    className={`mr-3 transition-colors ${selectedProjectId === project._id ? 'text-indigo-600 fill-indigo-200' : 'text-slate-400 group-hover:text-slate-500'}`} 
                  />
                  
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate">{project.name}</span>
                    {project.description && (
                      <span className="block text-[10px] text-slate-400 truncate mt-0.5">{project.description}</span>
                    )}
                  </div>
                  
                  {selectedProjectId === project._id && (
                     <ChevronRight size={14} className="text-indigo-400 ml-2 shrink-0" />
                  )}
                </button>

                <button 
                  onClick={(e) => handleDeleteProject(e, project._id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-20"
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !isCreating && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Folder size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">No projects yet</p>
              <p className="text-xs text-slate-400 max-w-37.5">Create your first project to start managing tasks</p>
            </div>
          )
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-indigo-700 transition-colors">Nishant Dubey</p>
            <p className="text-[10px] text-slate-500 truncate">Workspace Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
