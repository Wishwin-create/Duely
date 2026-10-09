import { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseForm from './CourseForm';
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from './useCourses';

const errorText = (err) => {
  const d = err?.response?.data;
  return d?.issues?.[0]?.message || d?.error || (err ? 'Something went wrong' : '');
};

export default function CoursesPage() {
  const { data: courses = [], isLoading } = useCourses();
  const create = useCreateCourse();
  const update = useUpdateCourse();
  const remove = useDeleteCourse();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

return(
 <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Courses</h1>
          <Link to="/" className="text-sm text-indigo-600 font-medium">Back to dashboard</Link>
        </div>

     {isLoading && <p className="text-slate-500">Loading…</p>}
       {!isLoading && courses.length === 0 && !adding && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-500">
            No courses yet. Add your first one to get started.
          </div>
        )}
    
    {courses.map((c) =>
          editingId === c._id ? (
            <CourseForm key={c._id} initial={c}
              busy={update.isPending} error={errorText(update.error)}
              onCancel={() => setEditingId(null)}
              onSubmit={(data) =>
                update.mutate({ id: c._id, ...data }, { onSuccess: () => setEditingId(null) })
              } />
          ) : (
            <div key={c._id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
              <span className="w-3 h-12 rounded-full" style={{ backgroundColor: c.color }} />
              <div className="flex-1">
                <p className="font-semibold">{c.code} <span className="font-normal text-slate-500">· {c.semester}</span></p>
                <p className="text-slate-600 text-sm">
                  {c.title}{c.credits != null && ` · ${c.credits} credits`}
                </p>
              </div>
              <button onClick={() => setEditingId(c._id)} className="text-sm text-indigo-600">Edit</button>
              <button
                onClick={() => window.confirm(`Delete ${c.code}?`) && remove.mutate(c._id)}
                className="text-sm text-red-600">
                Delete
              </button>
            </div>
          )
        )}

        {adding ? (
          <CourseForm busy={create.isPending} error={errorText(create.error)}
            onCancel={() => setAdding(false)}
            onSubmit={(data) =>
              create.mutate(data, { onSuccess: () => setAdding(false) })
            } />
        ) : (
          <button onClick={() => setAdding(true)}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700">
            + Add course
          </button>
        )}
      </div>
    </div>
  );
}