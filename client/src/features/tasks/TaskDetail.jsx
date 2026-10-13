import { useState } from 'react';
import { useCourses } from '../courses/useCourses';
import { useUpdateTask, useDeleteTask } from './useTasks';

const pad = (n) => String(n).padStart(2, '0');

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const clean = (subs) => subs.map(({ _id, title, done }) => ({ _id, title, done }));
const input =
  'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';

  export default function TaskDetail({ task, onClose }) {
  const { data: courses = [] } = useCourses();
  const update = useUpdateTask();
  const remove = useDeleteTask();

  const [form, setForm] = useState({
    title: task.title,
    notes: task.notes || '',
    course: task.course?._id || '',
    type: task.type,
    priority: String(task.priority),
    dueAt: toLocalInput(task.dueAt),
    weight: task.weight ?? '',
  });

const [newSub, setNewSub] = useState('');
const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const subtasks = task.subtasks || [];

function save(e) {
    e.preventDefault();
    update.mutate(
      {
        id: task._id,
        title: form.title,
        notes: form.notes,
        course: form.course || null,
        type: form.type,
        priority: Number(form.priority),
        dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : null,
        weight: form.weight === '' ? null : Number(form.weight),
      },
      { onSuccess: onClose }
    );
  }

const saveSubtasks = (next) => update.mutate({ id: task._id, subtasks: clean(next) });

const toggleSub = (id) =>
    saveSubtasks(subtasks.map((s) => (s._id === id ? { ...s, done: !s.done } : s)));
const removeSub = (id) => saveSubtasks(subtasks.filter((s) => s._id !== id));
function addSub(e) {
    e.preventDefault();
    if (!newSub.trim()) return;
    saveSubtasks([...subtasks, { title: newSub.trim(), done: false }]);
    setNewSub('');
  }

const err = update.error?.response?.data;
const doneCount = subtasks.filter((s) => s.done).length;

return (
    <div className="fixed inset-0 z-20 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="relative w-full max-w-md bg-white shadow-xl overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Task details</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close">
            ✕
          </button>
        </div>

        {err && (
          <p className="text-sm text-red-600 bg-red-50 rounded p-2">
            {err.issues?.[0]?.message || err.error}
          </p>
        )}

        <form onSubmit={save} className="space-y-3">
          <input name="title" value={form.title} onChange={onChange} required
            className={`${input} font-medium`} />

          <textarea name="notes" value={form.notes} onChange={onChange} rows={4}
            placeholder="Notes" className={input} />

          <div className="grid grid-cols-2 gap-3">
            <select name="course" value={form.course} onChange={onChange} className={input}>
              <option value="">No course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.code}</option>
              ))}
            </select>
            <select name="type" value={form.type} onChange={onChange} className={input}>
              <option value="task">Task</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
            </select>
            <select name="priority" value={form.priority} onChange={onChange} className={input}>
              <option value="1">Low priority</option>
              <option value="2">Medium priority</option>
              <option value="3">High priority</option>
            </select>
            <input name="weight" type="number" min="0" max="100" step="0.5"
              placeholder="Weight %" value={form.weight} onChange={onChange} className={input} />
          </div>

          <input name="dueAt" type="datetime-local" value={form.dueAt}
            onChange={onChange} className={input} />

          <div className="flex gap-2 pt-1">
            <button disabled={update.isPending}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              {update.isPending ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={onClose}
              className="border rounded-lg px-4 py-2 text-sm hover:bg-slate-100">
              Cancel
            </button>
          </div>
        </form>

        <section className="border-t pt-4 space-y-2">
          <h3 className="font-semibold text-sm">
            Subtasks {subtasks.length > 0 && (
              <span className="text-slate-500 font-normal">({doneCount}/{subtasks.length})</span>
            )}
          </h3>

          {subtasks.map((s) => (
            <div key={s._id} className="flex items-center gap-2">
              <input type="checkbox" checked={s.done} onChange={() => toggleSub(s._id)}
                className="w-4 h-4 accent-indigo-600" />
              <span className={`flex-1 text-sm ${s.done ? 'line-through text-slate-400' : ''}`}>
                {s.title}
              </span>
              <button onClick={() => removeSub(s._id)} className="text-xs text-red-600">
                Remove
              </button>
            </div>
          ))}

          <form onSubmit={addSub} className="flex gap-2 pt-1">
            <input value={newSub} onChange={(e) => setNewSub(e.target.value)}
              placeholder="Add a subtask and press Enter" className={input} />
          </form>
        </section>

        <button
          onClick={() =>
            window.confirm(`Delete "${task.title}"?`) &&
            remove.mutate(task._id, { onSuccess: onClose })
          }
          className="text-sm text-red-600">
          Delete task
        </button>
      </aside>
    </div>
  );
}

