# 🎨 @leadai/ui — Shared UI Component Library

Shared React component library used across all LeadAI Platform frontend apps.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [React 18](https://react.dev/) | UI framework |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible headless UI primitives |
| [Recharts](https://recharts.org/) | Chart components |
| [class-variance-authority](https://cva.style/) | Component variant management |
| [clsx](https://github.com/lukeed/clsx) | Conditional class names |

## Component Library

### Primitives
| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost, destructive variants with loading state |
| `Input` | Text input with label, error, helper text |
| `Select` | Dropdown select with search support |
| `Checkbox` | Styled checkbox with indeterminate state |
| `Switch` | Toggle switch |
| `Textarea` | Multi-line text input |
| `Badge` | Status/label badges in multiple colors |
| `Avatar` | User avatar with fallback initials |

### Layout
| Component | Description |
|-----------|-------------|
| `Modal` | Accessible dialog/modal with backdrop |
| `Card` | Content card with header, body, footer |
| `Sidebar` | Collapsible navigation sidebar |
| `Navbar` | Top navigation bar |
| `Tabs` | Tab navigation component |
| `Accordion` | Expandable sections |
| `Tooltip` | Hover tooltip |

### Data Display
| Component | Description |
|-----------|-------------|
| `Table` | Basic HTML table with sorting |
| `DataTable` | Feature-rich table with pagination, filters, column visibility |
| `Chart` | Wrapper around Recharts with consistent theme |
| `StatsCard` | KPI/metric display card with trend indicator |
| `ActivityFeed` | Timeline-style activity log |
| `EmptyState` | Empty state with icon, title, and action button |

### Domain Components (LeadAI-specific)
| Component | Description |
|-----------|-------------|
| `LeadCard` | Lead summary card with score, source, status badge |
| `PipelineBoard` | Kanban-style drag-and-drop pipeline view |
| `ScoreBadge` | AI score badge (color-coded: hot/warm/cold) |
| `ChannelIcon` | Icon for communication channels (WhatsApp, email, phone) |
| `CampaignStatusBadge` | Campaign status indicator |
| `PlanBadge` | Subscription plan badge |

## Installation

```bash
npm install @leadai/ui
```

## Usage

```tsx
import { Button, LeadCard, PipelineBoard, StatsCard } from '@leadai/ui';

export default function Dashboard() {
  return (
    <div>
      <StatsCard title="Hot Leads" value={42} trend="+12%" trendUp />
      <Button variant="primary" size="lg">Add Lead</Button>
    </div>
  );
}
```

## Development

```bash
# Start Storybook for component development
npm run storybook

# Build the library
npm run build

# Run tests
npm run test
```

## Design Tokens

The component library uses a consistent design token system:

```css
/* Colors */
--color-brand-primary: #6366F1;   /* Indigo */
--color-brand-secondary: #8B5CF6; /* Purple */
--color-success: #10B981;
--color-warning: #F59E0B;
--color-danger: #EF4444;
--color-score-hot: #EF4444;
--color-score-warm: #F59E0B;
--color-score-cold: #6B7280;
```
