# Playwright End-to-End (E2E) & Automated Testing

---

## 1. Why Playwright Outclasses Cypress & Selenium

- **Native Multi-tab & Multi-origin Support:** Test OAuth handshakes with Google/Microsoft SSO seamlessly.
- **Auto-waiting:** Automatically waits for elements to be actionable before clicking or filling.
- **Headless Chrome, Firefox & WebKit (Safari)** in a single test runner.
- **Trace Viewer:** Time-travel debugging with DOM snapshots, console logs, and network waterfall diagrams.

---

## 2. Real Production Playwright Test Journey (Bilingual & Accessible)

```typescript
// tests/e2e/workflow-approval.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('KHDA Control Tower - Task Approval Workflow', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to local or staging environment
    await page.goto('/tasks');
  });

  test('should load tasks in English and pass WCAG 2.1 AA accessibility checks', async ({ page }) => {
    // 1. Verify page title
    await expect(page.locator('h1')).toContainText('Task Management');

    // 2. Run automated accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should switch to Arabic RTL and flip layout properly', async ({ page }) => {
    // Click language switcher
    await page.getByRole('button', { name: /Language|العربية/i }).click();
    await page.getByRole('menuitem', { name: 'العربية' }).click();

    // Verify HTML dir attribute flipped to RTL
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // Verify header translated
    await expect(page.locator('h1')).toContainText('إدارة المهام');
  });

  test('should approve high-priority task and update status optimistically', async ({ page }) => {
    // Find task row and click approve
    const taskCard = page.locator('[data-task-id="TASK-401"]');
    await taskCard.getByRole('button', { name: 'Approve' }).click();

    // Verify toast notification appears
    await expect(page.getByText('Task approved successfully')).toBeVisible();

    // Verify badge updated to APPROVED
    await expect(taskCard.locator('.badge-status')).toContainText('Approved');
  });

});
```
