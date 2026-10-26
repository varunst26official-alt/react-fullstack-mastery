# Component & Unit Testing with Vitest and React Testing Library

---

## 1. Guiding Philosophy: Test Behavior, Not Implementation

> *"The more your tests resemble the way your software is used, the more confidence they can give you."* — Kent C. Dodds

- ❌ Don't test internal state variables (`expect(component.state.count).toBe(1)`).
- ❌ Don't test component method names.
- ✅ Test user actions: Did clicking this button cause a message to appear on the screen?

---

## 2. Example: Testing a Task Approval Button

```tsx
// components/ApproveButton.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ApproveButton } from './ApproveButton';

describe('<ApproveButton />', () => {
  it('calls onApprove callback when clicked and shows loading spinner', async () => {
    const handleApprove = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(<ApproveButton taskId="TASK-101" onApprove={handleApprove} />);

    const button = screen.getByRole('button', { name: /approve task/i });
    expect(button).toBeEnabled();

    // User clicks the button
    await user.click(button);

    // Verify handler was called with taskId
    expect(handleApprove).toHaveBeenCalledTimes(1);
    expect(handleApprove).toHaveBeenCalledWith('TASK-101');
  });

  it('remains disabled when user does not have permission', () => {
    render(<ApproveButton taskId="TASK-101" isAuthorized={false} />);

    const button = screen.getByRole('button', { name: /approve task/i });
    expect(button).toBeDisabled();
  });
});
```
