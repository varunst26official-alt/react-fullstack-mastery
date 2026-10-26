# React Hooks Deep-Dive & Senior Gotchas

---

## 1. `useEffect` Anti-Patterns & When NOT to Use It

Junior developers use `useEffect` for everything. Senior engineers use it sparingly because `useEffect` introduces an extra render cycle.

### Anti-Pattern 1: Transforming Data for Rendering
```javascript
// ❌ BAD: Causes an unnecessary secondary render!
function UserList({ users }) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    setActiveUsers(users.filter(u => u.isActive));
  }, [users]);
  ...
}

// ✅ GOOD: Calculate directly during render!
function UserList({ users }) {
  // If users list is huge (>1000 items), wrap in useMemo. Otherwise plain calculation is faster.
  const activeUsers = useMemo(() => users.filter(u => u.isActive), [users]);
  ...
}
```

### Anti-Pattern 2: Resetting State on Prop Change
```javascript
// ❌ BAD: Janky flash of old state before effect runs
function UserProfile({ userId }) {
  const [comment, setComment] = useState('');
  useEffect(() => {
    setComment('');
  }, [userId]);
}

// ✅ GOOD: Use the `key` prop! When key changes, React completely unmounts & resets the component:
<UserProfile key={userId} userId={userId} />
```

---

## 2. `useMemo` vs `useCallback`

Both hooks are cache mechanisms that compare dependencies with `Object.is()`.

```javascript
// useMemo caches the RESULT of a function
const expensiveFilteredTasks = useMemo(() => {
  return tasks.filter(t => t.status === activeFilter && t.priority === 'CRITICAL');
}, [tasks, activeFilter]);

// useCallback caches the FUNCTION INSTANCE itself
// Essential when passing callback props to child components wrapped in React.memo!
const handleTaskDelete = useCallback((taskId) => {
  deleteTaskApi(taskId);
}, []); // Stable reference between renders
```

---

## 3. `useRef` for Non-Visual State

`useRef` returns a mutable object `{ current: initialValue }` that persists across all renders without triggering re-renders when mutated.

### Ideal Use Cases:
1. **Holding DOM references:** `<canvas ref={canvasRef} />` or focusing an `<input ref={inputRef} />`.
2. **Storing timers / intervals:** Clearing an interval in cleanup without adding it to dependency arrays.
3. **Tracking previous prop values:** Comparing `prevProps.current` with incoming props.
