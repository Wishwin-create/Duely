const PRIORITY = {
    1:{label: 'Low',cls : 'text-slate-500'},
    2:{label: 'Medium',cls : 'text-slate-600'},
    3:{label: 'High',cls : 'text-slate-600'},
}

function dueBadge(task){
    if(!task.dueAt) return null;
    const due = new Date(task.dueAt);
    const diff = due.getTime() -Date.now();
    const text = due.toLocaleString([],{
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

export default function TaskRow({ task, onToggle, onDelete }) {
  const done = task.status === 'done';
  const p = PRIORITY[task.priority] || PRIORITY[2];

return(
    <div className = "bg-white rounded-2xl shadow p-4 flex items-center gap-3">
     <input type="checkbox" checked={done} onChange={() => onToggle(task)}
        className="w-5 h-5 accent-indigo-600" aria-label="Mark done" />
        
     <div className="flex-1 min-w-0">
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
          {dueBadge(task)}
        </div>
      </div>

      <button onClick={() => window.confirm(`Delete "${task.title}"?`) && onDelete(task._id)}
        className="text-sm text-red-600">
        Delete
      </button>
    </div>

    
);
}