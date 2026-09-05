## Rentify frontend-to-backend architecture

Rentify is a property and tenancy management application. The frontend is a Next.js App Router application using React client components, TypeScript, Tailwind CSS, and Lucide icons. It currently presents a working UI with demo data; the backend will replace that demo data with authenticated, persistent API resources.

### 1. Frontend structure

The application starts at `/signin`. The root page redirects there. Successful sign-in or sign-up currently stores the selected role in `localStorage` and navigates to `/dashboard`.

The main application screens are:

- `/dashboard`: landlord or tenant summary, rent collection, occupancy, overdue bills, recent activity, and quick actions.
- `/flats`: list of flats, occupancy and maintenance status, rent, and tenant assignment.
- `/tenants`: tenant search, status filtering, tenant details, create, edit, and delete.
- `/bills`: monthly bills, paid or partial status, overdue amounts, and tenant-specific bill view.
- `/chat`: conversations between landlord and tenant, unread counts, and message sending.
- `/profile`: profile editing, language preference, account details, and logout.

Several legacy sales-report routes under `/dashboard/products`, `/dashboard/sales`, and `/dashboard/reports` currently redirect to the dashboard. They should remain separate from the Rentify property domain unless product and sales reporting are intentionally added later.

### 2. Shared frontend shell

`src/components/tenant-app.tsx` is the current application shell. It owns:

- Sidebar and mobile navigation.
- Current route and active navigation item.
- Landlord and tenant role selection.
- English and Bangla language selection.
- Light and dark theme selection.
- Profile display and local profile persistence.
- Logout navigation.
- Toast and modal visibility.
- Rendering the screen-specific components.

The theme and UI preferences are client-side concerns. They do not need backend endpoints initially, although language and profile preferences should eventually be persisted against the authenticated user. The role selector is currently a demo switch; it must not be trusted for authorization. The backend must derive permissions from the authenticated identity and server-side role assignments.

### 3. Current data boundary

`src/lib/tenant-data.ts` contains the current demo records:

- `flats`: flat number, floor, monthly rent, occupancy status, and current tenant.
- `tenants`: identity, phone, flat, rent, tenant status, family members, emergency phone, and voter ID.
- `bills`: tenant, flat, total, paid amount, payment status, and due date.
- `conversations`: participant display data, preview, time, unread count, and avatar information.

The frontend currently keeps several mutations only in React state. Creating or editing a tenant, assigning a tenant to a flat, sending a message, and editing a profile do not yet call the backend. The integration work should replace these local mutations with API requests and then refresh or update the affected resource from the server response.

### 4. Recommended backend layers

Use a layered Express and PostgreSQL design:

1. Routes define HTTP paths, methods, authentication middleware, and validation middleware.
2. Controllers translate HTTP requests into application operations and response DTOs.
3. Services contain business rules such as assignment, bill status calculation, authorization checks, and report aggregation.
4. Repositories or models contain parameterized SQL and database access.
5. Middleware handles authentication, authorization, validation, errors, rate limits, and request logging.
6. PostgreSQL stores users, roles, properties, flats, tenancies, bills, payments, conversations, messages, notifications, and audit events.

Keep database models separate from API response objects. Do not return password hashes, internal permission details, or unrestricted tenant identity data to the frontend.

### 5. API resources to build

#### Authentication

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Sign-up must create the user and the correct initial membership or invitation flow. Sign-in should return a short-lived access token and use a secure refresh-token strategy. Passwords must be hashed. JWT secrets must be required from environment configuration, not assumed with a production fallback.

#### Users and profile

- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/preferences`

Profile data includes name, phone, email, language preference, and notification preferences. Email uniqueness, ownership, and validation belong to the backend.

#### Properties and flats

- `GET /properties`
- `POST /properties`
- `GET /properties/:propertyId`
- `PATCH /properties/:propertyId`
- `GET /properties/:propertyId/flats`
- `POST /properties/:propertyId/flats`
- `GET /flats/:flatId`
- `PATCH /flats/:flatId`
- `POST /flats/:flatId/assign-tenant`
- `POST /flats/:flatId/unassign-tenant`

A flat belongs to a property. Its status should be derived or validated from its tenancy and maintenance state rather than accepted blindly from the client. Assignment must be transactional so a tenant cannot be assigned to two incompatible active flats.

#### Tenants and tenancies

- `GET /properties/:propertyId/tenants`
- `POST /properties/:propertyId/tenants`
- `GET /tenants/:tenantId`
- `PATCH /tenants/:tenantId`
- `DELETE /tenants/:tenantId`
- `POST /tenants/:tenantId/invitations`
- `PATCH /tenancies/:tenancyId`
- `POST /tenancies/:tenancyId/end`

Store tenant identity, household information, emergency contact, lease dates, rent amount, status, and property membership. Prefer a separate `tenancies` table because a person may leave one flat and later rent another while historical bills and assignments remain intact.

#### Bills and payments

- `GET /properties/:propertyId/bills`
- `POST /properties/:propertyId/bills`
- `GET /bills/:billId`
- `PATCH /bills/:billId`
- `POST /bills/:billId/payments`
- `GET /bills/:billId/payments`
- `POST /bills/:billId/mark-paid`

Bills need line items or at least rent and utility components, billing period, due date, total, paid amount, and balance. Payment creation must be idempotent and should recalculate `paid`, `partial`, `overdue`, or `unpaid` status on the server.

#### Dashboard and reports

- `GET /properties/:propertyId/dashboard-summary`
- `GET /properties/:propertyId/activity`
- `GET /properties/:propertyId/reports/daily`
- `GET /properties/:propertyId/reports/monthly`

These endpoints provide the dashboard metrics shown by the frontend: expected rent, collected rent, total due, occupied flats, pending bills, recent payments, maintenance activity, and occupancy totals. Report filters should accept a validated date range and property identifier.

#### Conversations and messages

- `GET /conversations`
- `POST /conversations`
- `GET /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/messages`
- `PATCH /conversations/:conversationId/read`

Only conversation participants and authorized property managers should access a conversation. Start with REST polling, then learn WebSockets or Server-Sent Events for real-time messages and unread-count updates.

#### Notifications

- `GET /notifications`
- `PATCH /notifications/:notificationId/read`
- `PATCH /notifications/read-all`

Notifications can be generated for overdue bills, payments, tenant invitations, maintenance updates, and new messages.

### 6. Suggested database relationship

The core relationship is:

`users -> memberships -> properties -> flats -> tenancies -> bills -> payments`

Messaging connects users through `conversations` and `conversation_members`, with `messages` belonging to conversations. `notifications` belong to users. `audit_events` should record security-sensitive changes such as role changes, tenant deletion, flat assignment, bill edits, and payments.

### 7. RBAC learning goal

RBAC means Role-Based Access Control. Instead of giving permissions directly to every user, the backend assigns a role and the role grants permissions.

Recommended initial roles:

- `platform_admin`: manages the whole application and support operations.
- `property_manager`: manages assigned properties, flats, tenants, bills, reports, and conversations.
- `landlord`: manages owned properties and their rental operations.
- `tenant`: views their own tenancy and bills, pays bills, and communicates with authorized property contacts.
- `maintenance_staff`: views assigned maintenance work without accessing private billing or identity data.

Example permissions include `property:read`, `property:update`, `flat:assign`, `tenant:read`, `tenant:update`, `bill:create`, `payment:create`, `report:read`, and `message:send`. The backend should check permissions on every protected request. Hiding a button in the frontend is only a usability feature, not security.

### 8. HRBAC learning goal

HRBAC means Hierarchical Role-Based Access Control. Roles form a hierarchy where a senior role inherits permissions from a lower role, while additional restrictions still apply.

For example:

- `platform_admin` inherits property-manager permissions across all properties.
- `property_manager` inherits landlord operational permissions across assigned properties.
- `landlord` can manage their own properties but cannot access another landlord's property.
- `tenant` has narrow self-service permissions and does not inherit landlord permissions.

HRBAC has two separate ideas to learn together: role inheritance and resource scope. A landlord role may have `bill:read`, but only for bills belonging to that landlord's property. Authorization therefore combines the permission check with an ownership or membership query:

`authenticated user + inherited permission + property scope + resource relationship`

Implement this in middleware and service-level policy functions. Never rely only on a role value sent by the frontend or stored in local storage.

### 9. Frontend-to-backend learning sequence

1. Replace sign-in and sign-up demo timers with calls to `/auth/signup` and `/auth/signin`.
2. Add a shared API client that handles the API base URL, JSON responses, authorization headers, and consistent errors.
3. Add protected route handling and load `/auth/me` on application startup.
4. Replace static flats and tenants with GET requests, then connect create, edit, delete, and assignment mutations.
5. Add database-backed bills and payments with server-side balance and status calculations.
6. Connect dashboard summary and report endpoints using query parameters for date ranges.
7. Connect conversations and messages, then add unread state and real-time transport.
8. Add RBAC permission checks to every endpoint.
9. Add HRBAC inheritance plus property-level ownership and membership checks.
10. Add validation, integration tests, audit logs, rate limiting, and secure error handling.

This sequence teaches the full connection: React form -> HTTP request -> route -> middleware -> controller -> service -> repository -> PostgreSQL -> response DTO -> frontend state refresh.

### 10. Current backend gaps

The existing backend currently exposes authentication and product routes, while the Rentify frontend needs property-management routes. Authentication also stores users in memory, and the current JWT setup should be hardened before production. The next backend milestone should establish PostgreSQL migrations for users, roles, memberships, properties, flats, and tenancies, then implement authenticated profile and flat/tenant reads before adding mutations.