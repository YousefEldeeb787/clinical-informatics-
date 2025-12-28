# ?? Design System Quick Reference

## Color Variables

### Primary Colors
```css
--color-primary: #DC2626        /* Red - Primary actions */
--color-secondary: #2563EB      /* Blue - Links, info */
--color-success: #10B981        /* Green - Success states */
--color-warning: #F59E0B        /* Yellow - Warnings */
--color-danger: #EF4444         /* Red - Errors, delete */
--color-info: #3B82F6           /* Blue - Info badges */
```

### Background Colors
```css
/* Light Mode */
--bg-primary: #F3F4F6           /* Page background */
--bg-secondary: #FFFFFF         /* Cards, tables */
--bg-hover: rgba(0,0,0,0.04)    /* Hover states */

/* Dark Mode */
--bg-primary: #0F172A           /* Page background */
--bg-secondary: #1E293B         /* Cards, tables */
--bg-hover: rgba(255,255,255,0.06)
```

### Text Colors
```css
--text-primary: #1F2937         /* Main text */
--text-secondary: #6B7280       /* Descriptions */
--text-tertiary: #9CA3AF        /* Muted text */
--text-inverse: #FFFFFF         /* Text on dark bg */
```

---

## Spacing Scale
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

---

## Border Radius
```css
--radius-sm: 6px      /* Small elements */
--radius-md: 10px     /* Buttons, inputs */
--radius-lg: 14px     /* Cards, tables */
--radius-xl: 18px     /* Modals */
--radius-full: 9999px /* Circular */
```

---

## Shadows
```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.06)
--shadow-md: 0 4px 12px rgba(0,0,0,0.08)
--shadow-lg: 0 8px 20px rgba(0,0,0,0.10)
--shadow-xl: 0 16px 32px rgba(0,0,0,0.12)
```

---

## Typography

### Font Sizes
```css
--font-size-xs: 12px      /* Labels, captions */
--font-size-sm: 14px      /* Body text */
--font-size-md: 16px      /* Default */
--font-size-lg: 18px      /* Subheadings */
--font-size-xl: 20px      /* H5 */
--font-size-2xl: 24px     /* H4 */
--font-size-3xl: 30px     /* H3 */
--font-size-4xl: 36px     /* H2, H1 */
```

### Font Weights
```css
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 800
```

---

## Common Component Classes

### Buttons
```html
<button class="btn-primary-modern">Primary</button>
<button class="btn-secondary-modern">Secondary</button>
<button class="action-btn-icon action-btn-view">???</button>
<button class="action-btn-icon action-btn-edit">??</button>
<button class="action-btn-icon action-btn-delete">???</button>
```

### Badges
```html
<span class="badge-modern badge-scheduled">Scheduled</span>
<span class="badge-modern badge-completed">Completed</span>
<span class="badge-modern badge-cancelled">Cancelled</span>
```

### Cards
```html
<div class="stat-card-modern">
  <div class="stat-card-content">
    <p class="stat-card-title">Total Patients</p>
    <h2 class="stat-card-value">42</h2>
  </div>
  <div class="stat-card-icon">??</div>
</div>
```

### Tables
```html
<div class="modern-table-wrapper">
  <table class="modern-table">
    <thead>
      <tr>
        <th>COLUMN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Empty States
```html
<div class="empty-state-container">
  <div class="empty-state-icon">??</div>
  <h3 class="empty-state-title">No Results</h3>
  <p class="empty-state-description">Try adjusting your filters</p>
</div>
```

---

## Animation Timing
```css
--transition-fast: 150ms ease
--transition-normal: 250ms ease
--transition-slow: 350ms ease
```

### Usage
```css
transition: all var(--transition-fast);
```

---

## Hover Effects Guide

### Cards
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-medium);
}
```

### Buttons
```css
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(220,38,38,0.35);
}
```

### Icon Buttons
```css
.icon-btn:hover {
  transform: scale(1.08);
  box-shadow: var(--shadow-sm);
}
```

### Table Rows
```css
tbody tr:hover {
  background: var(--bg-hover);
  transform: translateX(2px);
}
```

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Desktop */
@media (max-width: 1200px) { }
```

---

## Z-Index Scale
```css
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
```

---

## Usage Examples

### Creating a New Stat Card
```jsx
<div className="stat-card-modern stat-card-blue">
  <div className="stat-card-content">
    <p className="stat-card-title">Today's Appointments</p>
    <h2 className="stat-card-value">12</h2>
  </div>
  <div className="stat-card-icon">??</div>
</div>
```

### Creating Action Buttons
```jsx
<div className="action-buttons-group">
  <button className="action-btn-icon action-btn-view" title="View">
    ???
  </button>
  <button className="action-btn-icon action-btn-edit" title="Edit">
    ??
  </button>
  <button className="action-btn-icon action-btn-delete" title="Delete">
    ???
  </button>
</div>
```

### Creating a Modern Table
```jsx
<div className="modern-table-wrapper">
  <table className="modern-table">
    <thead>
      <tr>
        <th>PATIENT ID</th>
        <th>NAME</th>
        <th>STATUS</th>
        <th>ACTIONS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>P001</td>
        <td>John Doe</td>
        <td>
          <span className="badge-modern badge-scheduled">Scheduled</span>
        </td>
        <td>
          <div className="action-buttons-group">
            {/* buttons here */}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Theme Toggle

The app supports light/dark mode. Theme is stored in localStorage:

```javascript
// Get current theme
const theme = localStorage.getItem("theme") || "light";

// Set theme
document.documentElement.setAttribute("data-theme", theme);
localStorage.setItem("theme", theme);
```

---

## Best Practices

### ? DO:
- Use CSS variables for colors
- Use spacing scale for margins/padding
- Use transition variables for animations
- Use shared component classes
- Test in both light and dark mode

### ? DON'T:
- Hardcode colors (use variables)
- Use random spacing values
- Use inline styles for colors
- Create custom animations without checking existing ones
- Forget to test responsive design

---

## File Structure

```
frontend/src/styles/
??? theme.css                  # Color system, variables
??? components.css             # Reusable components
??? shared-components.css      # Modern shared styles

frontend/src/components/
??? [component]/
?   ??? Component.jsx
?   ??? component.css          # Import shared styles
```

---

## Quick Copy-Paste Snippets

### Primary Button
```html
<button className="btn-primary-modern">
  ? Add New
</button>
```

### Stat Grid
```html
<div className="stats-grid-container">
  <div className="stat-card-modern">...</div>
  <div className="stat-card-modern">...</div>
  <div className="stat-card-modern">...</div>
</div>
```

### Filter Bar
```html
<div className="filter-bar-container">
  <input className="filter-input" placeholder="Search..." />
  <select className="filter-select">
    <option>All</option>
  </select>
</div>
```

### Pagination
```html
<div className="pagination-container">
  <div className="pagination-info">Page 1 of 5</div>
  <div className="pagination-controls">
    <button className="pagination-btn">Prev</button>
    <button className="pagination-btn active">1</button>
    <button className="pagination-btn">Next</button>
  </div>
</div>
```

---

## Support

For questions or customization help, refer to:
- `theme.css` - Color system
- `shared-components.css` - Modern components
- `components.css` - Legacy components
- `UI_TRANSFORMATION_SUMMARY.md` - Full documentation
