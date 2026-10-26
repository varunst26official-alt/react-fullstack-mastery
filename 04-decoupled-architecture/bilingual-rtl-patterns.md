# Bilingual English & Arabic (RTL) Architecture

---

## 1. Dynamic RTL Configuration

Building software for the UAE / GCC market requires full support for Arabic Right-to-Left (RTL) reading order, not just translated text strings.

### Setting Document Direction Dynamically:
```typescript
import { useEffect } from 'react';

export function useDirection(language: 'en' | 'ar') {
  useEffect(() => {
    const isRtl = language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);
}
```

---

## 2. Tailwind CSS Logical Properties for Seamless RTL

Never use hard-coded `pl-` (padding-left) or `mr-` (margin-right). Use CSS Logical Properties:

| Physical Property (Don't Use) | Logical Property (RTL-Friendly) | Tailwind Utility |
| :--- | :--- | :--- |
| `margin-left` | `margin-inline-start` | `ms-4` |
| `margin-right` | `margin-inline-end` | `me-4` |
| `padding-left` | `padding-inline-start` | `ps-4` |
| `padding-right` | `padding-inline-end` | `pe-4` |
| `text-align: left` | `text-align: start` | `text-start` |
| `text-align: right` | `text-align: end` | `text-end` |
| `left: 0` | `inset-inline-start: 0` | `start-0` |
| `right: 0` | `inset-inline-end: 0` | `end-0` |

### Flipping Directional Icons:
Arrows and back-buttons must flip in Arabic; checkmarks and logos do not:
```tsx
<ArrowLeft className="w-5 h-5 rtl:rotate-180 transition-transform" />
```
