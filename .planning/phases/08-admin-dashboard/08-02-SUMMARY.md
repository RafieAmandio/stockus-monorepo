---
phase: 08-admin-dashboard
plan: 02
subsystem: frontend-admin
tags: [tanstack-table, react-hook-form, zod, shadcn-ui, data-tables]

dependency-graph:
  requires:
    - 06-01: shadcn/ui setup with Button, Card, Input components
    - 07-01: Next.js frontend with App Router
  provides:
    - Reusable DataTable component with sorting, filtering, pagination
    - Form components (Form, FormField, FormItem) for React Hook Form
    - Table UI components (Table, TableHeader, TableBody, etc.)
    - Additional shadcn/ui components (Select, Checkbox, Dropdown, Textarea)
  affects:
    - 08-03: Course management will use DataTable
    - 08-04: Research/template management will use DataTable
    - 08-05: User/order management will use DataTable

tech-stack:
  added:
    - "@tanstack/react-table": "Headless table state management"
    - "react-hook-form": "Form state management with validation"
    - "@hookform/resolvers": "Zod integration for react-hook-form"
    - "date-fns": "Date formatting for table columns"
    - "@radix-ui/react-select": "Select dropdown primitive"
    - "@radix-ui/react-checkbox": "Checkbox primitive"
    - "@radix-ui/react-dropdown-menu": "Dropdown menu primitive"
  patterns:
    - "TanStack Table pattern": "useReactTable hook with sorting/filtering/pagination"
    - "Generic component pattern": "DataTable<TData, TValue> with ColumnDef"
    - "shadcn/ui component pattern": "Radix UI primitives with Tailwind styling"
    - "React Hook Form integration": "FormField with Controller for form state"

key-files:
  created:
    - frontend/src/components/admin/DataTable.tsx: "Reusable data table with TanStack Table"
    - frontend/src/components/ui/table.tsx: "Table UI primitives"
    - frontend/src/components/ui/form.tsx: "Form components for react-hook-form"
    - frontend/src/components/ui/select.tsx: "Select dropdown component"
    - frontend/src/components/ui/textarea.tsx: "Textarea input component"
    - frontend/src/components/ui/checkbox.tsx: "Checkbox component"
    - frontend/src/components/ui/dropdown-menu.tsx: "Dropdown menu component"
  modified:
    - frontend/package.json: "Added table and form dependencies"

decisions:
  - decision: "TanStack Table for data tables"
    rationale: "Headless library, full control over UI, widely used, TypeScript-native"
    scope: "all-admin-tables"
  - decision: "React Hook Form + Zod for forms"
    rationale: "Matches backend validation, excellent TypeScript support, performant"
    scope: "all-admin-forms"
  - decision: "shadcn/ui component approach"
    rationale: "Copy-paste components into codebase, full customization, no runtime overhead"
    scope: "all-ui-components"
  - decision: "Client-side table operations"
    rationale: "V1 simplicity, admin content volume is manageable, instant UX"
    scope: "v1-data-tables"

metrics:
  tasks: 3
  duration: "3.6 min"
  commits: 3
  files_created: 8
  files_modified: 2
  completed: 2026-01-30
---

# Phase 08 Plan 02: Data Table Infrastructure Summary

**One-liner:** Installed TanStack Table, React Hook Form, and created reusable DataTable component with shadcn/ui table primitives for admin content management.

## What Was Built

### Task 1: Install Dependencies
Installed data table and form libraries:
- `@tanstack/react-table` - Headless table state management
- `react-hook-form` + `@hookform/resolvers` - Form state with Zod integration
- `zod` - Schema validation (matches backend)
- `date-fns` - Date formatting for tables
- Radix UI primitives: `@radix-ui/react-select`, `@radix-ui/react-checkbox`, `@radix-ui/react-dropdown-menu`

**Commit:** d48dc9f

### Task 2: Add shadcn/ui Components
Created 6 new shadcn/ui components following existing patterns:

1. **table.tsx** - Table UI primitives
   - Table, TableHeader, TableBody, TableFooter
   - TableRow, TableHead, TableCell, TableCaption
   - Styled with border, muted backgrounds, hover states

2. **select.tsx** - Radix UI Select component
   - SelectTrigger, SelectContent, SelectItem
   - Chevron icons from lucide-react
   - Scroll up/down buttons for long lists

3. **form.tsx** - React Hook Form integration
   - FormProvider wrapper for form context
   - FormField with Controller from react-hook-form
   - FormItem, FormLabel, FormControl, FormDescription, FormMessage
   - Error state handling with useFormField hook

4. **textarea.tsx** - Styled textarea input
   - Consistent with existing input.tsx styling
   - Focus ring, disabled states

5. **checkbox.tsx** - Radix UI Checkbox
   - Check indicator with lucide-react Check icon
   - Primary color styling

6. **dropdown-menu.tsx** - Radix UI DropdownMenu
   - DropdownMenu, DropdownMenuTrigger, DropdownMenuContent
   - DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel
   - For table row action menus (Edit, Delete, etc.)

All components use `cn()` utility from `@/lib/utils` for Tailwind class merging.

**Commit:** a89c480

### Task 3: Create DataTable Component
Created reusable `DataTable.tsx` component in `components/admin/`:

**Features:**
- Generic type support: `DataTable<TData, TValue>`
- Client-side sorting (click column headers to sort)
- Client-side filtering (optional search input by column key)
- Pagination (Previous/Next buttons)
- Empty state handling ("No results.")
- Row selection state management

**State Management:**
- `sorting` - SortingState for column sorting
- `columnFilters` - ColumnFiltersState for search filtering
- `columnVisibility` - VisibilityState for show/hide columns
- `rowSelection` - For checkbox selection (future use)

**Configuration:**
- Uses TanStack Table's `useReactTable` hook
- Configured with getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel
- Renders with shadcn/ui Table components
- Pagination controls use shadcn/ui Button components

**Props:**
- `columns: ColumnDef<TData, TValue>[]` - Column definitions
- `data: TData[]` - Array of data to display
- `searchKey?: string` - Column key for search filtering
- `searchPlaceholder?: string` - Placeholder text for search input

**Usage Pattern:**
```typescript
// Define columns
const columns: ColumnDef<Course>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status' },
]

// Use DataTable
<DataTable
  columns={columns}
  data={courses}
  searchKey="title"
  searchPlaceholder="Search courses..."
/>
```

**Commit:** 310348a

## Technical Architecture

### Component Hierarchy
```
DataTable (admin-specific)
├── Input (search, optional)
└── Table (shadcn/ui)
    ├── TableHeader
    │   └── TableRow
    │       └── TableHead (per column)
    ├── TableBody
    │   └── TableRow (per data row)
    │       └── TableCell (per column)
    └── Pagination Buttons
```

### shadcn/ui Pattern
All components follow the established shadcn/ui pattern:
1. Radix UI primitive as foundation (where applicable)
2. forwardRef for ref forwarding
3. Tailwind classes for styling
4. `cn()` utility for class merging
5. TypeScript for full type safety

### TanStack Table Integration
- **Headless approach:** TanStack Table manages state, DataTable renders UI
- **Declarative columns:** Column definitions separate from rendering
- **Composable features:** Core, pagination, sorting, filtering plugins
- **Type safety:** Full TypeScript support with generic types

## Decisions Made

### 1. TanStack Table over alternatives
**Options considered:**
- TanStack Table (chosen)
- ag-Grid (too heavyweight for v1)
- react-table v7 (deprecated)
- Custom implementation (reinventing wheel)

**Decision:** TanStack Table
**Rationale:** Headless library gives full UI control, widely used in production, excellent TypeScript support, active maintenance. Perfect for admin tables that need sorting/filtering/pagination but custom styling.

### 2. React Hook Form + Zod
**Options considered:**
- React Hook Form + Zod (chosen)
- Formik + Yup
- Custom form state

**Decision:** React Hook Form + Zod
**Rationale:** Backend already uses Zod for validation. Sharing schemas between frontend and backend ensures consistency. React Hook Form is performant (uncontrolled components) and has excellent TypeScript support.

### 3. Client-side table operations
**Options considered:**
- Client-side (chosen for v1)
- Server-side (pagination, sorting, filtering on backend)

**Decision:** Client-side for v1
**Rationale:** Admin content volume is manageable (dozens to hundreds of courses/reports, not thousands). Client-side operations provide instant UX without API calls. Can migrate to server-side in v2 if needed.

### 4. shadcn/ui approach
**Rationale:** Consistent with existing frontend architecture (06-01). Copy-paste components means full customization, no runtime overhead from component library, easier to modify for specific needs.

## Testing & Verification

### Verification Performed
1. All dependencies installed in package.json
2. TypeScript compilation succeeds (no errors)
3. Next.js build succeeds
4. All shadcn/ui components export correctly
5. DataTable component compiles with generic types

### Manual Testing Required (08-03)
- DataTable renders with actual course data
- Sorting works (click column headers)
- Filtering works (search input)
- Pagination works (Previous/Next buttons)
- Empty state displays when no data

## Next Phase Readiness

### Ready to Proceed
Yes. All infrastructure is in place for content management:
- DataTable component ready for course/research/template lists
- Form components ready for create/edit forms
- Table UI components styled and functional

### Unblocked Work
- 08-03: Course management can now create course list page with DataTable
- 08-04: Research/template management can use same pattern
- 08-05: User/order management can use same pattern

### Blockers
None.

### Concerns
None. Standard pattern, well-documented, widely used.

## Deviations from Plan

None - plan executed exactly as written.

## Performance Notes

- **Build time:** No noticeable impact, Next.js build still completes in ~30 seconds
- **Bundle size:** TanStack Table is lightweight (~14KB gzipped), React Hook Form is ~9KB gzipped
- **Runtime:** Client-side operations are instant for expected data volumes (< 1000 rows)

## Documentation & Resources

### Key References
- TanStack Table docs: https://tanstack.com/table/latest
- shadcn/ui data-table guide: https://ui.shadcn.com/docs/components/data-table
- React Hook Form docs: https://react-hook-form.com/
- Radix UI primitives: https://www.radix-ui.com/primitives

### Code Examples
See RESEARCH.md Pattern 3 (Data Tables) and Pattern 4 (Forms) for usage examples.

### Future Usage Pattern
Every admin content list page will follow this pattern:
1. Define column definitions with ColumnDef
2. Fetch data (server component or API call)
3. Render DataTable with columns and data
4. Add search by primary column (title, name, etc.)
5. Add action column with DropdownMenu for Edit/Delete

---

**Phase 08 Plan 02 complete.** Ready to proceed to 08-03 (Course Management).
