

# M Plus — MVP Service Marketplace

**Tagline:** Hire skilled workers near you. Negotiate. Get it done.

---

## 1. Brand & Design
- **Name:** M Plus | **Logo:** M+ in bold modern typography
- Clean, mobile-first layout with a trust-focused blue/dark theme
- Simple navigation with bottom tab bar (mobile) and top nav (desktop)

---

## 2. Pages & User Flows

### Public Pages
- **Landing/Home** — Hero with search bar, featured service categories (Electrician, Plumber, Mechanic, AC Tech, Painter, Cleaner, etc.), how-it-works section, and trust indicators
- **Service Categories** — Browse workers by category with filters (rating, availability)
- **Worker Profile (public)** — Skills, experience, hourly rate range, completed jobs, reviews

### Authentication
- **Sign Up / Login** — Choose role: Customer or Worker
- Simple email + password auth (Supabase)

### Customer Flow
1. **Post a Job** — Select category, describe work, set location, preferred time, and offered price (hourly/fixed/project)
2. **View Offers** — See nearby workers who responded, with their counter-offers
3. **Chat** — Simple real-time messaging with a worker before accepting
4. **Active Job** — Job status tracker (Requested → Accepted → In Progress → Completed)
5. **Rate & Review** — After job completion, rate worker (1-5 stars) + written review
6. **My Jobs** — History of all past and active jobs

### Worker Flow
1. **Browse Jobs** — See available job requests in their service category
2. **Respond to Job** — Accept customer's price or send a counter-offer
3. **Chat** — Message the customer
4. **Active Job** — Update job status as work progresses
5. **Earnings** — View completed jobs and earnings (10% commission noted)
6. **My Profile** — Edit skills, experience, rate range, profile photo

### Admin Panel
- **Dashboard** — Overview stats (total jobs, users, earnings from commission)
- **Manage Users** — View/approve/suspend customers and workers
- **Manage Jobs** — Monitor active and completed jobs
- **Commission Log** — Track 10% commission on each completed job

---

## 3. Key MVP Features

| Feature | Details |
|---|---|
| **Service Categories** | Icons + list view for ~8 worker types |
| **Job Posting** | Description, category, price offer, time |
| **Negotiation** | Workers can accept or counter-offer |
| **Real-time Chat** | Simple messaging between customer & worker |
| **Job Status Tracking** | Status flow from request to completion |
| **Ratings & Reviews** | Post-job rating system |
| **Worker Profiles** | Skills, experience, reviews, completed jobs |
| **Cash Payment** | Manual/cash — platform tracks 10% commission in records |
| **Admin Dashboard** | User management, job monitoring, commission tracking |

---

## 4. Backend (Supabase / Lovable Cloud)
- **Auth:** Email/password with role-based access (customer, worker, admin)
- **Database:** Users, worker profiles, jobs, offers, messages, reviews, commission logs
- **Real-time:** Chat via Supabase real-time subscriptions
- **Security:** Row-level security policies per user role

---

## 5. What's NOT in MVP (Future additions)
- GPS/map-based matching and live worker tracking
- Online payment (Stripe integration)
- Push notifications
- Worker verification/document upload
- Dispute handling system

