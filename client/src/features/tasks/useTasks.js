import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';


export function useTasks(view){
    return useQuery({
        queryKey: ['tasks', view],
        queryFn: async () => {
            const params = view && view !== 'all' ? { view } : {};
            return (await api.get('/tasks',{params})).data.tasks;
        }
    });

}

export function useCreateTask(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn : async(task) => (await api.post('/tasks', task)).data.task,
        onSuccess:() =>qc.invalidateQueries({queryKey:['tasks']}),
    });
}

export function useUpdateTask(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...changes }) =>
      (await api.patch(`/tasks/${id}`, changes)).data.task,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => (await api.delete(`/tasks/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
}