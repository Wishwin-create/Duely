import { useState } from 'react';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

const empty = { semester: '', code: '', title: '', credits: '', color: COLORS[0] };


export default function CourseForm({ initial, onSubmit, onCancel, busy, error }) {
  const [form, setForm] = useState(
    initial ? { ...initial, credits: initial.credits ?? '' } : empty
  );

const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

function submit(e){
    e.preventDefault();
    const payload ={
        semester: form.semester,
        code : form.code,
        title:form.title,
        color:form.color,
    }
    if(form.credits !== '') payload.credits = Number(form.credits);
    onSubmit(payload);
}

const input =
    'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400';

 return(
       <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-3">
      {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}
       <div className="grid grid-cols-2 gap-3">
        <input name="semester" placeholder="Semester (Y2 S1)" value={form.semester}
          onChange={onChange} required className={input} />
        <input name="code" placeholder="Code (ICT2013)" value={form.code}
          onChange={onChange} required className={input} />
      </div>
      <input name="title" placeholder="Course title" value={form.title}
        onChange={onChange} required className={input} />
      <input name="credits" type="number" min="0" max="30" step="0.5" placeholder="Credits (optional)"
        value={form.credits} onChange={onChange} className={input} />

      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
            style={{ backgroundColor: c }}
            className={`w-7 h-7 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-700' : ''}`}
            aria-label={`Colour ${c}`} />
        ))}
      </div>

     <div className = "flex gap-2 pt-1">
        <button disabled={busy}
        className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            {busy ? 'Saving...' : initial ? 'Save Changes' : 'Add Course'}
        </button>
        {onCancel && (
            <button type = "button" onClick = {onCancel}
            className="border rounded-lg px-4 py-2 text-sm hover:bg-slate-100">
                Cancel
            </button>
        )}
     </div>
     </form>
 );
}