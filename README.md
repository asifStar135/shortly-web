# ShortLy — URL Shortener Web Application

> A clean, responsive URL-shortening web application built with **Next.js and TypeScript**, focused on modular frontend architecture, reusable UI components, and a maintainable user experience.

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

**[Live Application](#)** · **[Architecture & Design](#)** · **[Repository](#)**

---

## ✨ Overview

**ShortLy** is a modern URL-shortening application designed around a simple idea:

> **Create, organize, and manage short URLs without unnecessary complexity.**

The application provides an authenticated workspace where users can create short URLs, define custom expiration rules, and manage their previously created URLs from a responsive dashboard.

The project is also being built as an opportunity to explore how a frontend application can be structured for **maintainability, reusability, and future scalability** rather than treating every page as an isolated implementation.

---

## 🚀 Current Features

### 🔐 User Authentication

- User registration
- User login
- Forgot-password flow using email verification code
- JWT-cookie based authentication
- Protected application routes
- Authentication state management
- Dedicated authentication layouts and components

### 🔗 URL Creation

- Create short URLs from long URLs
- Option to set a custom expiry date
- Form validation and user-friendly feedback

### 📊 URL Dashboard

Authenticated users get a responsive dashboard to:

- View created URLs altogether in tabular view
- Search and filter URLs by status
- View visit statistics including total visits, unique users
- Track visitors categorised by device and location
- View creation and expiration information
- Copy & share short URLs
- Disable or Delete URLs

### 📱 Responsive UI

The application is designed to work across:

- Desktop
- Tablet
- Mobile

---

# 🏗️ Frontend Architecture

ShortLy follows a **feature-oriented and responsibility-driven frontend structure**.

The goal is to keep UI, application logic, API communication, state, and shared utilities separated so that individual parts can evolve without creating tightly coupled components.

```text
src/
│
├── actions/
│   └── index.ts
│
├── app/
│   ├── (auth)/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (protected)/
│   │   └── ...
│   │
│   ├── not-found/
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── Forms/
│   │   ├── CreateUrlForm.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── Providers/
│   │   ├── AuthProvider.tsx
│   │   └── ProtectedPage.tsx
│   │
│   ├── ui/
│   ├── Loading.tsx
│   └── Navbar.tsx
│
├── lib/
│   ├── api/
│   ├── helpers/
│   ├── types/
│   ├── api-errors.ts
│   └── utils.ts
│
└── store/
    └── authStore.ts
```

---

## 🧩 Modular Design

The application intentionally separates responsibilities across different layers.

### `app/`

Responsible for **routing and page composition**.

Next.js route groups are used to separate different application areas:

```text
(auth)
(protected)
```

This allows authentication pages and authenticated application pages to have different layouts and behaviors without unnecessarily coupling them.

---

### `components/`

Contains reusable UI and application-level components.

```text
components/
├── Forms/
├── Providers/
├── ui/
├── Navbar.tsx
└── Loading.tsx
```

The application-specific components are kept separate from reusable UI primitives.

---

### `lib/`

Contains shared application logic and definitions.

```text
lib/
├── api/
├── helpers/
├── types/
├── api-errors.ts
└── utils.ts
```

Responsibilities include:

- API client configuration
- Shared TypeScript types
- Error handling
- Utility functions
- Reusable helper logic

This prevents common functionality from being duplicated across pages and components.

---

### `store/`

Application-level client state is managed separately from UI components.

Currently:

```text
store/
└── authStore.ts
```

The authentication store manages the client-side authentication state and allows authenticated UI components to consume the state without creating unnecessary prop chains.

---

### `Providers/`

Application-wide behavior is isolated into provider components.

Current examples include:

- `AuthProvider`
- `ProtectedPage`

This keeps authentication and route-protection concerns separate from individual page implementations.

---

# 🔗 URL Management Flow

The main user journey is intentionally simple:

```text
Login / Register
       │
       ▼
   Dashboard
       │
       ├───────────────┐
       ▼               ▼
 Create URL       Manage URLs
       │               │
       ▼               ├── Search
 Custom Name           ├── Filter
 Expiration            ├── Copy
       │               ├── Enable / Disable
       ▼               └── Delete
 Short URL
```

The dashboard acts as the central workspace for managing the user's URLs.

---

# 🎨 UI & UX

ShortLy follows a minimal visual language designed around readability and simplicity.

### Design principles

- Clear visual hierarchy
- Minimal distractions
- Consistent spacing
- Reusable components
- Responsive layouts
- Accessible interaction patterns
- Clear success/error feedback
- Mobile-first consideration for interactive elements

The application uses **Tailwind CSS** for styling and **Shadcn/ui** for reusable UI primitives.

The UI primitives remain generic while application-specific behavior lives in dedicated components.

This makes the design system easier to maintain as the application grows.

---

# 🛠️ Tech Stack

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| **Next.js**      | React framework and application routing |
| **TypeScript**   | Type-safe application development       |
| **Tailwind CSS** | Styling and responsive layouts          |
| **shadcn/ui**    | Reusable UI primitives                  |
| **Zustand**      | Client-side authentication state        |
| **Sonner**       | Toast notifications                     |
| **JWT**          | Authentication                          |
| **REST APIs**    | Application communication               |

---

# ⚡ Maintainability & Scalability Considerations

Although ShortLy is currently a relatively small application, the frontend architecture is designed with future growth in mind.

### Separation of concerns

Pages are primarily responsible for composing the UI while reusable logic is moved into dedicated layers.

### Reusable components

Common UI behavior is extracted instead of repeatedly implementing the same interaction across pages.

### Centralized API communication

API-related operations are separated from UI components, making backend communication easier to maintain or replace.

### Strong typing

TypeScript types are maintained separately from components and API logic to reduce duplication and runtime mistakes.

### Centralized error handling

API errors are normalized through a shared error-handling layer rather than requiring every component to understand raw API responses.

### Route isolation

Authentication and protected application routes are separated using Next.js route groups, keeping different application concerns isolated.

---

# 🤝 Contributing & Feedback

ShortLy is an evolving project, and feedback is welcome.

If you find a bug, have an idea, or see an opportunity to improve the application, feel free to open an issue in the repository.

### 🐛 Found a bug?

Please create an issue with:

- A clear description of the problem
- Steps to reproduce it
- Expected behavior
- Actual behavior
- Screenshots or other relevant context, if applicable

### 💡 Have an idea?

Open an issue describing the proposed improvement and the problem it solves.

Constructive feedback around **UX, accessibility, performance, architecture, and maintainability** is especially welcome.

## 👉 **[Create an Issue](https://github.com/asifStar135/shortly-web/issues)**

---

# 🗺️ Architecture & Design

The application's architecture and user flows were designed and documented using **Excalidraw**.

The diagram covers the major frontend flows and the interaction between the different application modules.

👉 **[View the ShortLy Architecture & Design](https://excalidraw.com/#json=dvPzJVYFbfaSBxLZVoaQ7,oc4Ay_krYOW5BSDzQd-gOQ)**

---

# 🌐 Live Application

Try the application:

👉 **[Open ShortLy](https://shortly.asif-dev.site/)**

---

# 🗺️ Roadmap

The next improvements are focused on expanding the product while improving the performance of its most critical functionality.

### 1. Guest URL Creation

Allow users to create short URLs without creating an account.

Guest-created URLs will intentionally have **no tracking or analytics**, keeping the experience simple while giving users a quick way to shorten a URL.

### 2. QR Code Generation

Add QR code generation alongside every short URL.

Users will be able to generate a QR code for their shortened URL and use it for sharing, printing, or offline access.

### 3. Optimize URL Redirection

Improve the performance of ShortLy's most critical operation:

```text
Short URL
    ↓
Resolve short code
    ↓
Redirect → Long URL
```

---

## 👨‍💻 Author

**Md Asif Mondal**

Software Engineer focused on building scalable full-stack applications with **TypeScript, React, Next.js, Node.js, Java, Spring Boot and AWS**.

- GitHub: **[asifstar135](https://github.com/asifstar135)**
- LinkedIn: **[Md Asif Mondal](https://linkedin.com/in/mdasif135)**

---

<p align="center">
  Built with ❤️ using Next.js and TypeScript
</p>
