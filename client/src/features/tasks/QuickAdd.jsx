import { useState } from 'react';
import { useCourses } from '../courses/useCourses';
import { useCreateTask } from './useTasks';

const input =
  'border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';

export default function QuickAdd() {
  const { data: courses = [] } = useCourses();
  const create = useCreateTask();
  const [form, setForm] = useState({
    title: '',
    course: '',
    type: 'task',
    priority: '2',
    dueAt: '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function submit(e) {
    e.preventDefault();
    const payload = {
      title: form.title,
      type: form.type,
      priority: Number(form.priority),
    };
    if (form.course) payload.course = form.course;
    if (form.dueAt) payload.dueAt = new Date(form.dueAt).toISOString();

    create.mutate(payload, {
      onSuccess: () => setForm({ ...form, title: '', dueAt: '' }),
    });
  }

  const err = create.error?.response?.data;

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow p-4 space-y-3">
      {err && (
        <p className="text-sm text-red-600 bg-red-50 rounded p-2">
          {err.issues?.[0]?.message || err.error}
        </p>
      )}

      <input name="title" value={form.title} onChange={onChange} required
        placeholder="What do you need to do?" className={`${input} w-full`} />

      <div className="flex flex-wrap gap-2">
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
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
        </select>

        <input name="dueAt" type="datetime-local" value={form.dueAt}
          onChange={onChange} className={input} />

        <button disabled={create.isPending}
          className="ml-auto bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {create.isPending ? 'Adding…' : 'Add task'}
        </button>
      </div>
    </form>
  );
}