Thought for 2sAnalyzed project structureThought for 2s### BuildStock Manager - Code Structure & Project Directory

## Project Overview

BuildStock Manager is a comprehensive construction materials management system built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui** components. The system supports three user roles: Admin, Inventory Manager (Responsable Inventaire), and Commercial Manager (Responsable Commercial).

## ️ Core Architecture

### **App Directory Structure**(`app/`)

app/
├── layout.tsx          # Root layout with AuthProvider
├── page.tsx           # Main dashboard (role-based)
├── globals.css        # Tailwind v4 + custom design tokens
├── inventory/         # Inventory management pages
├── orders/           # Order management pages  
├── reservations/     # Stock reservation pages
├── invoicing/        # Sales & invoicing pages
├── reports/          # Analytics & reporting pages
├── users/            # User management (admin only)
├── audit/            # Audit trail (admin only)
├── notifications/    # System notifications
└── settings/         # System settings (admin only)

### **Components Architecture**(`components/`)

components/
├── layout/
│   ├── main-layout.tsx    # Main app wrapper with sidebar
│   └── sidebar.tsx        # Role-based navigation sidebar
├── auth/
│   └── login-form.tsx     # Authentication form
├── inventory/
│   ├── inventory-list.tsx      # Main inventory table with role permissions
│   ├── add-item-dialog.tsx     # Create new inventory items
│   └── edit-item-dialog.tsx    # Edit existing items
├── orders/
│   ├── orders-list.tsx         # Order management table
│   ├── create-order-dialog.tsx # New order creation
│   ├── order-details-dialog.tsx # Order details view
│   └── reservations-list.tsx   # Stock reservations
├── invoicing/
│   ├── invoices-list.tsx       # Invoice management
│   ├── create-invoice-dialog.tsx # Invoice creation
│   ├── invoice-details-dialog.tsx # Invoice details
│   └── add-payment-dialog.tsx  # Payment tracking
├── reports/
│   └── reports-dashboard.tsx   # Analytics with charts
├── admin/
│   ├── admin-dashboard.tsx     # Admin overview
│   ├── users-management.tsx    # User CRUD operations
│   ├── create-user-dialog.tsx  # User creation
│   ├── edit-user-dialog.tsx    # User editing
│   └── settings-panel.tsx      # System configuration
├── audit/
│   └── audit-log.tsx          # Activity logging
├── notifications/
│   └── notifications-panel.tsx # System alerts
├── common/
│   ├── add-new-client-dialog.tsx    # Dynamic client creation
│   ├── add-new-category-dialog.tsx  # Dynamic category creation
│   └── add-new-supplier-dialog.tsx  # Dynamic supplier creation
└── ui/                        # shadcn/ui components (auto-included)


### **Type Definitions**(`types/`)

types/
├── auth.ts          # User roles & authentication
├── inventory.ts     # Inventory items & categories
├── orders.ts        # Orders, customers & reservations
├── invoicing.ts     # Invoices, quotes & payments
├── reports.ts       # Analytics & reporting data
├── admin.ts         # User management & settings
└── audit.ts         # Activity logging & notifications

### **Data Layer**(`lib/`)


lib/
├── utils.ts           # Utility functions (cn, etc.)
├── mock-data.ts       # Inventory sample data
├── mock-orders.ts     # Orders & reservations data
├── mock-invoicing.ts  # Invoicing sample data
├── mock-reports.ts    # Analytics sample data
├── mock-admin.ts      # User management data
└── mock-audit.ts      # Audit trail sample data


### **Context & State**(`contexts/`)


contexts/
└── auth-context.tsx   # Authentication state management


## Design System

### **Color Palette**(5 colors total)

- **Primary**: `#164e63` (Deep teal) - Trust & reliability
- **Secondary**: `#a16207` (Construction amber) - Industry warmth
- **Accent**: `#0891b2` (Bright teal) - Action highlights
- **Neutral**: `#475569` (Slate gray) - Professional text
- **Alert**: `#ff4d4d` (Red) - Warnings & critical states


### **Typography**

- **Headings**: GeistSans (400, 600, 700 weights)
- **Body**: GeistSans (400, 500 weights)
- **Monospace**: GeistMono for codes/IDs


## Role-Based Access Control

### **Admin**- Full system access

- User management, system settings, audit logs
- All inventory, orders, invoicing, and reporting features


### **Inventory Manager**- Stock-focused

- Full inventory CRUD operations
- Order management and reservations
- Stock reports and analytics


### **Commercial Manager**- Sales-focused

- **Read-only** inventory access (stock checking)
- Full invoicing and payment management
- Customer relationship management
- Sales reports and analytics


## Key Features

### **Dynamic Entity Creation**

- Add new clients during invoice creation
- Create categories while adding inventory items
- Add suppliers on-the-fly during inventory management


### **Real-time Notifications**

- Low stock alerts with critical/warning levels
- Overdue invoice notifications
- System activity tracking


### **Comprehensive Reporting**

- Revenue trends and sales analytics
- Inventory turnover analysis
- Interactive charts with export capabilities


### **Audit Trail**

- Complete activity logging for all user actions
- Filterable audit logs with search capabilities
- Security and compliance tracking


The system follows Next.js 14 App Router conventions with TypeScript for type safety, uses Tailwind CSS v4 for styling, and implements a clean component architecture with proper separation of concerns between UI, business logic, and data management.