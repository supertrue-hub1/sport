---
Task ID: 15-a
Agent: Full-Stack Developer
Task: Connect Categories and Users admin pages to real API data

Work Summary:
- Rewrote /src/app/admin/categories/page.tsx with full API integration
- Rewrote /src/app/admin/users/page.tsx with full API integration
- Both pages now fetch real data from API, show loading skeletons, use toast notifications, AlertDialog for delete confirmation
- ESLint: 0 errors, 0 warnings

Key Changes:
1. Categories page: added slug field (auto-generated), order field, Skeleton loading, desktop table + mobile cards, AlertDialog delete, toast notifications
2. Users page: email non-editable in edit mode, password field in create only, Skeleton loading, role badges with icons, AlertDialog delete, toast notifications
