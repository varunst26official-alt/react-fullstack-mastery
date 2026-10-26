# TanStack Query v5 (React Query) Mastery

In modern React architecture, **90% of global state is actually server cache state**.  
TanStack Query replaces manual `fetch`, loading spinners, and error state booleans with an enterprise caching layer.

---

## 1. The Core Concepts

- **`staleTime`:** How long data is considered "fresh". While fresh, no network request is made.
- **`gcTime` (Garbage Collection Time):** How long unused cached data remains in memory before being purged.
- **Query Keys:** Arrays that uniquely identify queries (e.g. `['tasks', { status: 'PENDING' }]`).

---

## 2. Standard Query Pattern

```typescript
import { useQuery } from '@tanstack/react-query';

async function fetchTasks(filter: string) {
  const res = await fetch(`/api/tasks?filter=${filter}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export function useTasks(filter: string) {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => fetchTasks(filter),
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    refetchOnWindowFocus: true, // Auto refetch when tab is refocused
  });
}
```

---

## 3. Optimistic Updates (The Senior Enterprise Pattern)

Optimistic updates update the UI **immediately** when the user clicks a button, and if the Mendix/Node backend fails, rolls the UI state back automatically:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useApproveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => fetch(`/api/tasks/${taskId}/approve`, { method: 'POST' }),

    // When approve button is clicked:
    onMutate: async (taskId) => {
      // 1. Cancel ongoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // 2. Snapshot the previous task list for rollback if error occurs
      const previousTasks = queryClient.getQueryData(['tasks']);

      // 3. Optimistically update the cache right now!
      queryClient.setQueryData(['tasks'], (old: any) =>
        old.map((t: any) => (t.id === taskId ? { ...t, status: 'APPROVED' } : t))
      );

      // 4. Return context with previous state
      return { previousTasks };
    },

    // If API throws an error:
    onError: (err, taskId, context) => {
      // Rollback to previous snapshot!
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },

    // Always refetch after error or success to guarantee synchronization with backend:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```
