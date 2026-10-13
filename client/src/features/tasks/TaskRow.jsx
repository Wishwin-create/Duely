const PRIORITY = {
  1: { label: 'Low', cls: 'text-slate-500' },
  2: { label: 'Medium', cls: 'text-amber-600' },
  3: { label: 'High', cls: 'text-red-600' },
};

function dueBadge(task) {
  if (!task.dueAt) return null;
  const due = new Date(task.dueAt);
  const diff = due.getTime() - Date.now();
  const text = due.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let cls = 'bg-slate-100 text-slate-600';
  if (task.status !== 'done') {
    if (diff < 0) cls = 'bg-red-100 text-red-700';
    else if (diff < 24 * 60 * 60 * 1000) cls = 'bg-amber-100 text-amber-700';
  }
  return <span className={`text-xs rounded-full px-2 py-0.5 ${cls}`}>{text}</span>;
}

export default function TaskRow({ task, onToggle, onOpen }) {
  const done = task.status === 'done';
  const p = PRIORITY[task.priority] || PRIORITY[2];
  const subs = task.subtasks || [];
  const subsDone = subs.filter((s) => s.done).length;

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
      <input type="checkbox" checked={done} onChange={() => onToggle(task)}
        className="w-5 h-5 accent-indigo-600" aria-label="Mark done" />

      <button onClick={() => onOpen(task._id)} className="flex-1 min-w-0 text-left">
        <p className={`font-medium truncate ${done ? 'line-through text-slate-400' : ''}`}>
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {task.course && (
            <span className="text-xs rounded-full px-2 py-0.5 text-white"
              style={{ backgroundColor: task.course.color }}>
              {task.course.code}
            </span>
          )}
          {task.type !== 'task' && (
            <span className="text-xs text-slate-500 capitalize">{task.type}</span>
          )}
          <span className={`text-xs ${p.cls}`}>{p.label}</span>
          {subs.length > 0 && (
            <span className="text-xs text-slate-500">☑ {subsDone}/{subs.length}</span>
          )}
          {dueBadge(task)}
        </div>
      </button>
    </div>
  );
}