import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Calendar, ClipboardList, CheckCircle2, Circle, Clock, AlertCircle, Search, Filter, X, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const statusConfig = {
  'todo': { label: 'To Do', color: 'bg-slate-100 text-slate-600 ring-slate-200', icon: Circle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-50 text-blue-700 ring-blue-200', icon: Clock },
  'done': { label: 'Complete', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: CheckCircle2 },
};

const priorityConfig = {
  'low': { label: 'Low', color: 'text-slate-500 bg-slate-100/50' },
  'medium': { label: 'Medium', color: 'text-orange-600 bg-orange-50' },
  'high': { label: 'High', color: 'text-red-600 bg-red-50 font-semibold' },
};

const TaskView = ({ project, isSidebarOpen }) => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 when search changes
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load tasks when dependencies change
  useEffect(() => {
    if (project) {
      loadTasks();
    }
  }, [project, page, filterStatus, sortBy, debouncedSearch]);

  const loadTasks = async () => {
    try {
      const params = {
        page,
        limit: 10,
        sort: sortBy,
        search: debouncedSearch
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await axios.get(`${API_BASE_URL}/projects/${project._id}/tasks`, { params });
      setTasks(response.data.data || []);
      setTotalPages(response.data.meta?.pages || 1);
      setTotalTasks(response.data.meta?.total || 0);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
      setTotalTasks(0);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setDueDate('');
    setIsAddingTask(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      status,
      priority,
      due_date: dueDate,
    };

    try {
      if (editingTask) {
        await axios.put(`${API_BASE_URL}/tasks/${editingTask._id}`, taskData);
      } else {
        await axios.post(`${API_BASE_URL}/projects/${project._id}/tasks`, taskData);
      }
      await loadTasks();
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setIsAddingTask(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const stats = {
    total: totalTasks,
    completed: tasks.filter(t => t.status === 'done').length,
    pending: tasks.filter(t => t.status !== 'done').length
  };

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Project Selected</h2>
          <p className="text-slate-500 mb-6">Select a project from the sidebar to view and manage your tasks efficiently.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
      {/* Header Section */}
      <div className={`bg-white border-b border-slate-200 py-6 shadow-sm z-10 transition-all duration-300 ${!isSidebarOpen ? 'pl-24 pr-8' : 'px-8'}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {stats.total} Tasks
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              {project.description || "Manage your tasks for this project below."}
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAddingTask(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 font-medium active:scale-95"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        {/* Filters & Controls */}
        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-fit">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 placeholder:text-slate-400 font-medium" 
            />
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 ml-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors py-2 pr-8"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors py-2 pr-4 pl-2"
          >
            <option value="created_at">Newest First</option>
            <option value="due_date">Due Date</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-8 pt-6 flex gap-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
               <AlertCircle size={20} />
            </div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Completed</p>
              <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
            </div>
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500">
               <CheckCircle2 size={20} />
            </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {tasks.length > 0 ? (
          <>
            {tasks.map((task) => {
              const StatusIcon = statusConfig[task.status]?.icon || Circle;
              return (
                <div
                  key={task._id}
                  className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200 relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    task.priority === 'high' ? 'bg-red-500' : 
                    task.priority === 'medium' ? 'bg-orange-400' : 'bg-slate-300'
                  }`}></div>

                  <div className="flex justify-between items-start pl-3">
                    <div className="flex-1 pr-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-semibold text-slate-800 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusConfig[task.status]?.color}`}>
                          <StatusIcon size={12} />
                          {statusConfig[task.status]?.label}
                        </span>
                      </div>
                      
                      <p className={`text-sm text-slate-500 leading-relaxed mb-4 ${task.status === 'done' ? 'line-through opacity-70' : ''}`}>
                        {task.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                        {task.due_date && (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                            new Date(task.due_date) < new Date() && task.status !== 'done' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'
                          }`}>
                            <Calendar size={14} />
                            <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        )}
                        
                        <div className={`px-2 py-1 rounded-md uppercase tracking-wider ${priorityConfig[task.priority]?.color}`}>
                          {priorityConfig[task.priority]?.label} Priority
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-white pl-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pb-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600 font-medium bg-white px-3 py-1 rounded-lg border border-slate-100">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-white/50">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No tasks found</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              {searchQuery ? `No tasks match "${searchQuery}"` : "This project doesn't have any tasks yet."}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => setIsAddingTask(true)}
                className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Create your first task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTask} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                <textarea
                  placeholder="Add details about this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Completed</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Priority</label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskView;
