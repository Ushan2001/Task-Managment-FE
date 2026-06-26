'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { Banner } from '@/components/banner';
import { Breadcrumb } from '@/components/breadcrumb';
import { api, Task, User } from '@/lib/api';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  AlertCircle,
  FilterX,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Tasks states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // Dialog configurations
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newStatus, setNewStatus] = useState<'Open' | 'In Progress' | 'Testing' | 'Done'>('Open');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState<string>('none');
  const [submittingAdd, setSubmittingAdd] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [editStatus, setEditStatus] = useState<'Open' | 'In Progress' | 'Testing' | 'Done'>('Open');
  const [editDueDate, setEditDueDate] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState<string>('none');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Screen resize tracker
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // Fetch collaborators list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<{ success: boolean; data: { users: User[] } }>('/users');
        if (response.success) {
          setUsersList(response.data.users);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
      }
    };
    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      let queryParams = [];
      if (search.trim()) queryParams.push(`search=${encodeURIComponent(search.trim())}`);
      if (priorityFilter !== 'all') queryParams.push(`priority=${priorityFilter}`);
      if (statusFilter !== 'all') queryParams.push(`status=${statusFilter}`);
      if (assigneeFilter !== 'all') queryParams.push(`assignedTo=${assigneeFilter}`);

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      const response = await api.get<{ success: boolean; data: { tasks: Task[] } }>(`/tasks${queryString}`);
      if (response.success) {
        setTasks(response.data.tasks);
      }
    } catch (err: any) {
      toast.error('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, priorityFilter, statusFilter, assigneeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleResetFilters = () => {
    setSearch('');
    setPriorityFilter('all');
    setStatusFilter('all');
    setAssigneeFilter('all');
    toast.success('Filters cleared');
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmittingAdd(true);
    try {
      const payload: any = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        status: newStatus,
        dueDate: newDueDate ? new Date(newDueDate).toISOString() : undefined,
        assignedTo: newAssignedTo !== 'none' ? newAssignedTo : undefined,
      };

      const response = await api.post<{ success: boolean }>('/tasks', payload);
      if (response.success) {
        toast.success('Task created successfully');
        setIsAddOpen(false);
        setNewTitle('');
        setNewDescription('');
        setNewPriority('Medium');
        setNewStatus('Open');
        setNewDueDate('');
        setNewAssignedTo('none');
        fetchTasks();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
    } finally {
      setSubmittingAdd(false);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditStatus(task.status);

    if (task.dueDate) {
      const dateVal = new Date(task.dueDate).toISOString().split('T')[0];
      setEditDueDate(dateVal);
    } else {
      setEditDueDate('');
    }

    setEditAssignedTo(task.assignedTo?._id || 'none');
    setIsEditOpen(true);
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!editTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmittingEdit(true);
    try {
      const payload: any = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        status: editStatus,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
        assignedTo: editAssignedTo !== 'none' ? editAssignedTo : null,
      };

      const response = await api.put<{ success: boolean }>(`/tasks/${editingTask._id}`, payload);
      if (response.success) {
        toast.success('Task updated successfully');
        setIsEditOpen(false);
        fetchTasks();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await api.delete<{ success: boolean }>(`/tasks/${taskId}`);
      if (response.success) {
        toast.success('Task deleted successfully');
        fetchTasks();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task. Access denied.');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F9]">
        <Loader2 className="animate-spin text-brand" size={36} />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Task Management' }
  ];

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#F5F7F9] font-sans text-slate-700 select-none">

      {/* Sidebar Navigation */}
      <Sidebar onExpandChange={setSidebarExpanded} />

      {/* Main Workspace Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isMobile ? 'ml-0' : sidebarExpanded ? 'ml-[290px]' : 'ml-[80px]'
        }`}>

        {/* Navbar Header */}
        <Navbar title="Task Management" />

        {/* Content container */}
        <main className="flex-1 px-6 py-4 md:px-8 md:py-4.5 space-y-5 overflow-y-auto max-w-full">

          <Breadcrumb items={breadcrumbs} />

          <Banner
            backgroundImage="/assets/images/task-managment.jpg"
            title="Task Management"
            description="Manage, edit, and organize all details for team tasks and workflow checklist items seamlessly."
          />

          {/* Filters Card */}
          <div className="border border-[#e2e8f0] bg-white rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="p-4 border-b border-[#f1f5f9] flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-[16px] text-[#1e293b] font-sans">Filter & Search Tasks</h3>
                <p className="text-xs text-[#94a3b8] font-sans">Locate, update, or assign workspace roles</p>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="bg-brand hover:bg-[#e04324] text-white font-bold py-2.5 px-5 rounded-xl cursor-pointer shadow-md shadow-brand/10 active:scale-[0.98] transition-all flex items-center gap-1.5 text-sm font-sans"
              >
                <Plus size={16} className="stroke-[2.5]" />
                New Task
              </button>
            </div>

            <div className="p-5 font-sans">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search bar */}
                  <div className="space-y-1.5">
                    <label htmlFor="search" className="text-xs font-bold text-[#64748b]">Search Tasks</label>
                    <div className="relative flex items-center border-[1.5px] border-[#cbd5e1] rounded-xl bg-white px-3 focus-within:border-brand focus-within:shadow-[0_0_0_2px_rgba(255,80,45,0.05)] transition-all">
                      <Search size={16} className="text-[#94a3b8] shrink-0 mr-2" />
                      <input
                        id="search"
                        placeholder="Search title/desc..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="py-2.5 bg-transparent text-sm outline-none w-full text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-[#64748b]">Priority Level</label>
                    <div className="relative flex items-center border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-all">
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                      >
                        <option value="all">All Priorities</option>
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-[#64748b]">Task Status</label>
                    <div className="relative flex items-center border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-all">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Testing">Testing</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>

                  {/* Assignee Filter */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-[#64748b]">Workspace Member</label>
                    <div className="relative flex items-center border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-all">
                      <select
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                        className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                      >
                        <option value="all">All Members</option>
                        {usersList.map(member => (
                          <option key={member._id} value={member._id}>
                            {member.name} ({member.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reset Actions */}
                <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#f1f5f9]">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 border border-[#cbd5e1] rounded-xl flex items-center gap-1 h-9 px-4 cursor-pointer transition-colors"
                  >
                    <FilterX size={14} />
                    Reset Filters
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold h-9 px-5 rounded-xl text-xs cursor-pointer shadow-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tasks Table Card */}
          <div className="p-6 border-[1.5px] border-[#e2e8f0] bg-white rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col font-sans">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[16px] text-[#1e293b]">Workspace Checklist</span>
              <span className="bg-[#FFEBEA] text-brand font-bold text-[11px] px-2.5 py-0.5 rounded-[6px] h-6 flex items-center">
                {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>
            <p className="text-[#94a3b8] text-[11px] mb-4">Click edit settings or check task flows below</p>

            {loadingTasks ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="animate-spin text-brand" size={32} />
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#e2e8f0] rounded-[16px] space-y-2">
                <AlertCircle size={32} className="text-[#94a3b8]" />
                <span className="font-bold text-[14px] text-[#1e293b]">No Tasks Found</span>
                <p className="text-[11px] text-[#94a3b8]">Create a new task or adjust filters to list workspace data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3.5 pl-2">Task Title & ID</th>
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3.5 px-4">Priority Level</th>
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3.5 px-4">Flow Status</th>
                      <th className="text-[#94a3b8] font-bold text-[11.5px] py-3.5 px-4">Assignee & Owner</th>
                      <th className="py-3.5 pr-2 w-28 align-middle text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeef3]">
                    {tasks.map(task => {
                      const isCreator = task.createdBy._id === user._id;
                      const canDelete = user.role === 'Admin' || isCreator;
                      const formattedDate = task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'No due date';

                      return (
                        <tr
                          key={task._id}
                          className="hover:bg-slate-50/70 transition-colors duration-150 group"
                        >
                          <td className="py-3.5 pl-2">
                            <span className="font-bold text-[12.5px] text-[#1e293b] block leading-tight truncate max-w-[200px]">
                              {task.title}
                            </span>
                            <span className="text-[#94a3b8] text-[10px] mt-0.5 block leading-none font-medium">
                              ID: {task._id.substring(18).toUpperCase()} | Due: {formattedDate}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] ${task.priority === 'High'
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : task.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-sky-50 text-sky-600 border border-sky-100'
                              }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${task.status === 'Done'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : task.status === 'Testing'
                                ? 'bg-yellow-50 text-yellow-750 border border-yellow-100'
                                : task.status === 'In Progress'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-100'
                                  : 'bg-slate-100 text-slate-650'
                              }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[12.5px] text-[#1e293b] block leading-tight truncate">
                              {task.assignedTo?.name || 'Unassigned'}
                            </span>
                            <span className="text-[#94a3b8] text-[10px] mt-0.5 block leading-none">
                              Owner: {task.createdBy.name}
                            </span>
                          </td>
                          <td className="py-3.5 pr-2 align-middle text-right">
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => openEditDialog(task)}
                                className="w-8 h-8 rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#e2e8f0] flex items-center justify-center cursor-pointer transition-colors"
                                title="Edit Task"
                              >
                                <Edit3 size={14} className="text-[#64748b]" />
                              </button>
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteTask(task._id)}
                                  className="w-8 h-8 rounded-lg border-[1.5px] border-red-100 bg-red-50/30 hover:bg-red-50 text-red-500 flex items-center justify-center cursor-pointer transition-colors"
                                  title="Delete Task"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Create Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-6 select-none font-sans">
          <DialogHeader className="pb-3 border-b border-[#f1f5f9]">
            <DialogTitle className="text-[18px] font-bold text-[#1e293b]">Create New Task</DialogTitle>
            <DialogDescription className="text-xs text-[#94a3b8] mt-0.5">Define your task parameters to assign and register it.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTask} className="space-y-4 pt-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-xs font-bold text-[#64748b]">Title</label>
              <input
                id="title"
                placeholder="Database seed, Auth fixes..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border-[1.5px] border-[#cbd5e1] rounded-xl bg-white py-2.5 px-4 text-sm outline-none focus:border-brand transition-colors text-slate-700"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-xs font-bold text-[#64748b]">Description</label>
              <input
                id="description"
                placeholder="Enter details..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border-[1.5px] border-[#cbd5e1] rounded-xl bg-white py-2.5 px-4 text-sm outline-none focus:border-brand transition-colors text-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#64748b]">Priority</label>
                <div className="relative border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors">
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#64748b]">Status</label>
                <div className="relative border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dueDate" className="text-xs font-bold text-[#64748b]">Due Date</label>
              <div className="relative flex items-center border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors pr-2.5">
                <input
                  id="dueDate"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full py-2.5 px-4 bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">Assign To</label>
              <div className="relative border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors">
                <select
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                >
                  <option value="none">Unassigned</option>
                  {usersList.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-[#f1f5f9] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingAdd}
                className="px-5 py-2 bg-[#ff502d] hover:bg-[#e04324] text-white font-bold rounded-xl text-xs cursor-pointer shadow-[0_4px_12px_rgba(255,80,45,0.25)] transition-all hover:-translate-y-px"
              >
                {submittingAdd ? 'Creating...' : 'Create Task'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-[24px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-6 select-none font-sans">
          <DialogHeader className="pb-3 border-b border-[#f1f5f9]">
            <DialogTitle className="text-[18px] font-bold text-[#1e293b]">Edit Task Settings</DialogTitle>
            <DialogDescription className="text-xs text-[#94a3b8] mt-0.5">Modify status flow, priority, due date, and user bindings.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="space-y-4 pt-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="editTitle" className="text-xs font-bold text-[#64748b]">Title</label>
              <input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border-[1.5px] border-[#cbd5e1] rounded-xl bg-white py-2.5 px-4 text-sm outline-none focus:border-brand transition-colors text-slate-700"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="editDescription" className="text-xs font-bold text-[#64748b]">Description</label>
              <input
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border-[1.5px] border-[#cbd5e1] rounded-xl bg-white py-2.5 px-4 text-sm outline-none focus:border-brand transition-colors text-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#64748b]">Priority</label>
                <div className="relative border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors">
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#64748b]">Status</label>
                <div className="relative border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="editDueDate" className="text-xs font-bold text-[#64748b]">Due Date</label>
              <div className="relative flex items-center border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors pr-2.5">
                <input
                  id="editDueDate"
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full py-2.5 px-4 bg-transparent text-sm outline-none text-slate-700 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#64748b]">Assign To</label>
              <div className="relative border-[1.5px] border-[#cbd5e1] rounded-xl bg-white focus-within:border-brand transition-colors">
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="w-full py-2.5 px-3 bg-transparent text-sm outline-none cursor-pointer text-slate-700"
                >
                  <option value="none">Unassigned</option>
                  {usersList.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-[#f1f5f9] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingEdit}
                className="px-5 py-2 bg-[#ff502d] hover:bg-[#e04324] text-white font-bold rounded-xl text-xs cursor-pointer shadow-[0_4px_12px_rgba(255,80,45,0.25)] hover:shadow-brand/20 transition-all hover:-translate-y-px"
              >
                {submittingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
