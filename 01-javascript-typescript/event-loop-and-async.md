# The JavaScript Runtime, Event Loop & Asynchronous Architecture

Understanding how the single-threaded V8 JavaScript engine processes execution context is the dividing line between junior developers who struggle with race conditions and senior engineers who write predictable, high-throughput code.

---

## 1. The Call Stack, Heap & Queues

JavaScript is **single-threaded**, with a non-blocking, asynchronous concurrent event loop model.

```
       +---------------------------------------------+
       |             Call Stack (LIFO)               |
       |  [ current execution context / frames ]     |
       +---------------------------------------------+
                              |
                     When Call Stack is Empty
                              |
                              v
       +---------------------------------------------+
       |         Microtask Queue (HIGH PRIORITY)     |
       |  - Promise callbacks (.then, .catch, .finally)
       |  - queueMicrotask(...)                      |
       |  - MutationObserver                         |
       +---------------------------------------------+
                              |
                    When Microtasks Drained
                              |
                              v
       +---------------------------------------------+
       |         Macrotask Queue (Task Queue)        |
       |  - setTimeout / setInterval                 |
       |  - setImmediate (Node)                      |
       |  - I/O events, Network responses            |
       |  - User UI events (clicks, scrolls)         |
       +---------------------------------------------+
```

### The Golden Rule of the Event Loop:
1. One macrotask is executed from the task queue.
2. The engine immediately checks the **microtask queue**.
3. **The engine drains the ENTIRE microtask queue** until it is completely empty before rendering the screen or running the next macrotask.
4. *Gotcha:* An infinite microtask loop (e.g. recursive `Promise.resolve().then(...)`) will **starve the event loop completely**, freezing the browser UI and preventing any user click or `setTimeout` from firing.

---

## 2. Common Interview Trick Question

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
}).then(() => {
  console.log('4');
});

queueMicrotask(() => {
  console.log('5');
});

console.log('6');
```

### Execution Breakdown:
- **Synchronous code runs first:**
  - `console.log('1')` -> **1**
  - `setTimeout` registers callback in **Macrotask Queue**.
  - `Promise.resolve().then()` registers callback `3` in **Microtask Queue**.
  - `queueMicrotask` registers callback `5` in **Microtask Queue**.
  - `console.log('6')` -> **6**
- **Call stack is empty! Drain Microtask Queue:**
  - Callback `3` runs -> **3**, registers next `.then()` callback `4` in Microtask Queue.
  - Callback `5` runs -> **5**.
  - Callback `4` runs -> **4**.
- **Microtasks are now completely empty! Pick next Macrotask:**
  - `setTimeout` callback runs -> **2**.

### Output:
```
1
6
3
5
4
2
```

---

## 3. Closures & The "Stale Closure" Trap in React

A closure gives an inner function access to the outer function’s scope even after the outer function has finished executing.

### The Problem in React Hooks:
```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // ⚠️ BUG: This closure captured `count = 0` during the first render!
      // Every second it sets `0 + 1 = 1`. It will never exceed 1!
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect never re-runs
}
```

### The Solution: Functional State Updates
```javascript
// Functional updates always receive the fresh, true state from React's internal fiber queue
setCount(prevCount => prevCount + 1);
```
