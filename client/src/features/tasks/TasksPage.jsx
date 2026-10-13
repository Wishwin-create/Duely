import { useState } from 'react';
import { Link } from 'react-router-dom';
import QuickAdd from './QuickAdd';
import TaskRow from './TaskRow';
import TaskDetail from './TaskDetail';
import { useTasks, useUpdateTask } from './useTasks';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'all', label: 'All' },
];

const EMPTY = {
  today: 'Nothing due today. Enjoy the free time or add a task above.',
  upcoming: 'No upcoming tasks.',
  overdue: 'No overdue tasks. Nice work.',
  all: 'No tasks yet. Add your first one above.',
};

export default function TasksPage() {
  const [view, setView] = useState('today');
  const [selectedId, setSelectedId] = useState(null);
  const { data: tasks = [], isLoading } = useTasks(view);
  const update = useUpdateTask();

  const selected = tasks.find((t) => t._id === selectedId);

  const toggle = (task) =>
    update.mutate({ id: task._id, status: task.status === 'done' ? 'todo' : 'done' });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Link to="/" className="text-sm text-indigo-600 font-medium">Back to dashboard</Link>
        </div>

        <QuickAdd />

        <div className="flex gap-1 bg-slate-200 rounded-lg p-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setView(t.id)}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium ${
                view === t.id ? 'bg-white shadow text-indigo-600' : 'text-slate-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-slate-500">Loading…</p>}

        {!isLoading && tasks.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            {EMPTY[view]}
          </div>
        )}

        {tasks.map((t) => (
          <TaskRow key={t._id} task={t} onToggle={toggle} onOpen={setSelectedId} />
        ))}
      </div>

      {selected && (
        <TaskDetail key={selected._id} task={selected} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}