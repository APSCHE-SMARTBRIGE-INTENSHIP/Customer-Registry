# Customer Care Registry: Features & Workflow Overview

This document outlines the complete workflow and all available features in the current state of the application, categorized by user role.

## 1. Authentication System
- **Role-Based Access Control (RBAC):** Users can register and log in as either a `Customer`, `Agent`, or `Admin`.
- **Secure Sessions:** JWT (JSON Web Tokens) are used for secure authentication and session management.
- **Dynamic Routing:** Upon logging in, users are automatically redirected to their role-specific dashboards. The top navigation bar strictly enforces visibility, ensuring users only see links relevant to their role.

---

## 2. Customer Workflow & Features
**Workflow:**
1. Customer logs in and lands on the **Home Page**.
2. They can click **Raise Complaint** to submit a new issue, or **View My Complaints** to track existing ones.
3. Once an agent replies, they can open the complaint and chat directly with the agent until the issue is resolved.

**Features:**
- **Home Page:** A welcoming landing page with clear calls to action.
- **Raise Complaint Form:** Customers can submit new tickets, providing a title, detailed description, and phone number. Each ticket is assigned a unique `complaintId`.
- **Interactive Complaints List:** A dynamic list of all their submitted complaints showing current statuses (`Pending`, `In Progress`, `Resolved`, `Closed`).
- **Live Chat Interface:** Clicking on an unresolved complaint expands it to reveal a chat interface, allowing seamless messaging back and forth with the assigned support agent.

---

## 3. Support Agent Workflow & Features
**Workflow:**
1. Agent logs in and lands on the **Agent Dashboard**.
2. They view their assigned tickets in the left sidebar and select one to start working on it.
3. They use the main chat window to communicate with the customer and use the status dropdown to update the ticket's progress.

**Features:**
- **Split-Screen Dashboard:** A modern, professional interface featuring a selectable list of assigned tickets on the left and a detailed chat view on the right.
- **KPI Summary:** The sidebar displays quick stats for the agent (e.g., Total Assigned, Pending, In Progress, Resolved).
- **Ticket Management:** Agents can update the status of the complaint (e.g., moving it from `Pending` to `In Progress` or `Resolved`).
- **Direct Messaging:** Agents can send messages to the customer; their actual names (First and Last) are displayed in the chat bubbles for a personalized touch.

---

## 4. Admin Workflow & Features
**Workflow:**
1. Admin logs in and lands on the **Admin Dashboard**.
2. They review the top-level system analytics.
3. They review unassigned/pending complaints and use the dropdowns to assign them to specific agents.
4. They can navigate to the user lists to audit registered agents and customers.

**Features:**
- **Global Dashboard Overview:** Displays system-wide analytics, including total tickets, pending, in progress, and resolved metrics.
- **Ticket Assignment:** Admins can view *all* complaints in the system. Unassigned complaints feature a dropdown menu allowing the Admin to manually assign the ticket to an available agent.
- **Agents Directory (`/admin/agents`):** A dedicated page displaying a grid of all registered support agents, including their full names, usernames, emails, and join dates.
- **Customers Directory (`/admin/customers`):** A dedicated page displaying a grid of all registered customers with their contact details and join dates.

---

## 5. UI/UX & Design Architecture
- **Light Theme & Premium Aesthetics:** The app features a crisp white/light-grey background with modern `#0d6efd` blue accents, glassmorphism elements, and smooth fade-in micro-animations.
- **Responsive Layouts:** Uses CSS Grid and Flexbox for responsive card layouts and scalable interfaces.
- **RESTful API Backend:** Built on Node.js/Express with MongoDB, featuring robust relational data (e.g., populating User details into Complaint queries).
