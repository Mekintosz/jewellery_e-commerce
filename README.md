# Jewellery E-Commerce

Responsive jewellery e-commerce experience built with React 19 (RC) and Vite. The application showcases a premium storefront with end-to-end shopping flows, authentication scaffolding, modular CSS styling, and reusable UI primitives.

## Features

- **Modern stack**: React 19 RC, Vite 5, TypeScript, React Router (data APIs), modular CSS with BEM naming.
- **Global state**: Context-powered cart, wishlist, authentication, UI, and product catalogue state with localStorage persistence.
- **Shopping flow**: Product discovery, advanced filtering/sorting, detailed product pages, cart management, promo codes, and a gated checkout experience.
- **Reusable UI kit**: Buttons, inputs, selects, modals, alerts, badges, cards, pagination, rating, tabs, and loaders built with accessibility-first semantics.
- **Responsive layouts**: Adaptive header, mobile navigation drawer, grid-based product layouts, and optimized typography from 320px upward.
- **Mock services**: In-memory product catalogue and authentication service to simulate API calls with loading states and error handling hooks.
- **Accessibility**: Semantic markup, focus styles, aria labels, keyboard-friendly interactions, and descriptive loading states.

## Getting Started

```bash
npm install
npm run dev
```

### Scripts

- `npm run dev` – Start the Vite development server
- `npm run build` – Create an optimized production build
- `npm run preview` – Preview the production build locally
- `npm run lint` – Run ESLint across the codebase

## Project Structure

```
src/
  components/
    cart/            # Cart-specific UI widgets
    common/          # Shared elements (Logo, etc.)
    feedback/        # Error boundaries, alerts
    forms/           # Input primitives
    layout/          # Header, footer, navigation
    product/         # Product discovery components
    ui/              # Reusable UI primitives
  context/           # Global state providers
  data/              # Mock data sources
  hooks/             # Reusable hooks
  layouts/           # Route-level layout wrappers
  pages/             # Route components
  providers/         # Combined provider tree
  routes/            # Router configuration & guards
  services/          # API abstractions over mock data
  utils/             # Formatting helpers
```

## Design & Styling

- CSS Modules with BEM naming and CSS custom properties for colour, typography, and spacing tokens.
- Mobile-first media queries with layout breakpoints at 640px, 768px, and 1024px.
- Consistent spacing scale (4/8/16/24/32px) and elevated surfaces via soft drop shadows.

## Testing & Validation

- TypeScript strict mode prevents unsafe patterns.
- Context reducers and hooks encapsulate shared state changes.
- Run `npm run lint` prior to commits to catch style or type issues (requires installing peer dependencies).

## Future Enhancements

- Integrate real authentication and product APIs.
- Add order history with pagination and filters.
- Implement skeleton loaders for the product listing page.
- Expand unit test coverage using React Testing Library.

---
