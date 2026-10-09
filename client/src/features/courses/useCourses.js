import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';


const KEY = ['courses'];

export function useCourses() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get('/courses')).data.courses,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (course) => (await api.post('/courses', course)).data.course,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...changes }) =>
      (await api.patch(`/courses/${id}`, changes)).data.course,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.delete(`/courses/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}