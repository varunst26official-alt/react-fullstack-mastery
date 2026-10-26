# Enterprise Authentication & Security Hardening

---

## 1. Where to Store JWTs: The Holy War

| Storage Location | XSS Vulnerability | CSRF Vulnerability | Production Verdict |
| :--- | :--- | :--- | :--- |
| `localStorage` | 🔴 **Extremely Vulnerable** (Any malicious script can steal token) | 🟢 Immune | ❌ **Never use in enterprise apps** |
| `sessionStorage` | 🔴 **Extremely Vulnerable** | 🟢 Immune | ❌ **Never use in enterprise apps** |
| `HttpOnly, Secure, SameSite Cookie` | 🟢 **Immune to JavaScript theft** | 🟡 Vulnerable without CSRF protection | ✅ **Industry Standard for Web Apps** |

### Recommended Pattern:
- **Refresh Token:** Stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie (cannot be read by `document.cookie`).
- **Access Token (Short-lived, e.g. 15 mins):** Kept in memory (JavaScript variable / Zustand store).

---

## 2. Role-Based Access Control (RBAC) Guard Pattern

```tsx
// components/RoleGuard.tsx
import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';

export type UserRole = 'SUPER_ADMIN' | 'FINANCE_DIRECTOR' | 'AUDITOR' | 'OPERATOR';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Usage in UI:
<RoleGuard allowedRoles={['SUPER_ADMIN', 'FINANCE_DIRECTOR']} fallback={<p>Unauthorized</p>}>
  <ApproveWorkflowButton workflowId={id} />
</RoleGuard>
```

---

## 3. Defense Against XSS (Cross-Site Scripting)

1. React auto-escapes string values rendered inside JSX `{userContent}` by default.
2. If you MUST render rich HTML (e.g. from an email body or CMS), **always sanitize with DOMPurify**:
```tsx
import DOMPurify from 'dompurify';

export function SafeHTML({ rawHtml }: { rawHtml: string }) {
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
```
