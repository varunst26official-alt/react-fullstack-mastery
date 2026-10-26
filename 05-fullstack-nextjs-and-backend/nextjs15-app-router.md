# Next.js 15 App Router & Server Components Mental Model

---

## 1. Server Components (RSC) vs Client Components

Next.js 15 uses React Server Components by default.

```
                    Component Tree in Next.js 15
                                 |
                 +---------------+---------------+
                 |                               |
      [ Server Component ]              [ Client Component ]
      - Runs ONLY on the server         - Runs on server (SSR) & client (hydration)
      - Accesses DB / Filesystem        - Uses useState, useEffect, onClick
      - Zero bundle size sent to user   - Needs 'use client' directive at top
```

### The Golden Rule:
Keep Client Components at the **leaves** of your component tree. Push data fetching and heavy logic up into Server Components.

---

## 2. Server Actions: Direct Mutations Without API Boilerplate

Instead of writing a custom API route handler, Next.js allows you to execute asynchronous server functions directly from forms:

```tsx
// app/tasks/new/page.tsx (Server Component)
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

async function createTask(formData: FormData) {
  'use server'; // Marks this function as a secure Server Action!

  const title = formData.get('title') as string;
  const priority = formData.get('priority') as string;

  // Direct database query on the server!
  await db.task.create({
    data: { title, priority, status: 'OPEN' },
  });

  // Revalidates cache so UI updates immediately
  revalidatePath('/tasks');
}

export default function NewTaskPage() {
  return (
    <form action={createTask}>
      <input name="title" required placeholder="Task title" />
      <select name="priority">
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
      </select>
      <button type="submit">Submit Task</button>
    </form>
  );
}
```
