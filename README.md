# Event Management System (EventSys)

An end-to-end web application for creating, browsing, and purchasing tickets for events across Turkish cities, with real-time weather integration, personalized recommendations, and an admin panel for managing events and announcements.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Screenshots](#screenshots)
4. [Tech Stack](#tech-stack)
5. [Architecture & Data Models](#architecture--data-models)
6. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Environment Variables](#environment-variables)
   * [Backend Setup](#backend-setup)
   * [Frontend Setup](#frontend-setup)
   * [Seeding Data](#seeding-data)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

---

## Project Overview

EventSys is a full-stack application that allows users to:

* **Browse** upcoming events in various cities of Turkey.
* **View** real-time weather at the event location via the OpenWeather API.
* **Register**, **login**, and **change password** on first login.
* **Receive** personalized event recommendations based on their interests.
* **Purchase** tickets (Regular/VIP) with **online** or **cash** payment method.
* **Admins** can **create**, **edit**, and **delete** both events and announcements.

The system uses MongoDB for persistence, Express.js for the backend API, and React for the frontend UI.

## Features

* **User Authentication**: JWT-based signup, login, first-time password change.
* **Event Listing**: Sorted by date, includes weather (temperature & conditions).
* **Recommendations**: Matches user interests or falls back to random if none.
* **Ticket Purchase**: Select ticket type, quantity, and payment method.
* **Admin Panel**:

  * Manage Events (CRUD).
  * Manage Announcements (CRUD).
* **Announcements**: Display news & maintenance notices to users.
* **Responsive UI**: Clean, card-based design.

## Screenshots


Login Page 

![Screenshot 2025-05-24 203020](https://github.com/user-attachments/assets/2557bd07-3d3b-452f-897f-d04e7d521d9e)


Register Page 

![Screenshot 2025-05-24 202949](https://github.com/user-attachments/assets/e9537b1c-4270-48de-af91-251a4d3ceaee)

![Screenshot 2025-05-24 203150](https://github.com/user-attachments/assets/4ee8680e-050c-4382-840a-4e1c7bcd8236)


Dashboard (Recommendations) 

![Screenshot 2025-05-24 203452](https://github.com/user-attachments/assets/211feee9-cf88-40ef-b8f2-cee9db856c0e)


Announcements


![Screenshot 2025-05-24 203511](https://github.com/user-attachments/assets/5cce3609-ad50-49de-8331-67a6a6adb3ac)



Event Detail & Purchase (screenshots/cart.png)

![Screenshot 2025-05-24 203549](https://github.com/user-attachments/assets/afe76715-6587-46d2-a49b-95ca0763bc2d)

![Screenshot 2025-05-24 203603](https://github.com/user-attachments/assets/7db080f6-8d1b-458f-a65c-4635f4502d6a)


Change Password 

![Screenshot 2025-05-24 203339](https://github.com/user-attachments/assets/60f5600d-054a-41e7-b40e-4e357942fbbc)

![Screenshot 2025-05-24 203417](https://github.com/user-attachments/assets/956ce921-3320-4fcb-b9d1-93799e3c366a)


Admin Home 

![Screenshot 2025-05-24 203648](https://github.com/user-attachments/assets/a69e453e-bfaf-4962-a2cc-b5404500d0aa)


Manage Events 

![Screenshot 2025-05-24 203704](https://github.com/user-attachments/assets/a0980d0d-451a-49d8-945e-2534ce9998fc)
 

Manage Announcements

![Screenshot 2025-05-24 203722](https://github.com/user-attachments/assets/b795bc0e-7c2d-4098-95c4-27b6c86cce1b)


MongoDB Atlas Cluster 

![Screenshot 2025-05-24 203232](https://github.com/user-attachments/assets/fae4d517-413e-47ee-a997-156e7412bd35)

--------------------------------------------------------

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | React, React Router, Axios          |
| Backend        | Node.js, Express.js                 |
| Database       | MongoDB, Mongoose                   |
| Authentication | JWT (jsonwebtoken)                  |
| Weather API    | OpenWeatherMap API                  |
| Deployment     | Render.com (backend + frontend)     |
| Others         | dotenv, cors, morgan, cookie-parser |

## Architecture & Data Models

### MongoDB Collections

* **users**

  * `email`, `passwordHash`, `interests` (array), `firstLogin` (boolean), `isAdmin` (boolean)

* **events**

  * `title`, `description`, `date` (ISO), `location` (city), `interests` (tags),
    `ticketTypes` (array of `{ type, price, quantity }`), `weather` (fetched on GET)

* **tickets**

  * `userId`, `eventId`, `ticketType`, `quantity`, `paymentMethod`, `purchaseDate`

* **announcements**

  * `title`, `content`, `createdAt`

## Getting Started

### Prerequisites

* Node.js v16+
* MongoDB (local or Atlas cluster)
* OpenWeatherMap API key (free plan)

### Environment Variables

Create a `.env` in the **backend/** folder:

```bash
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
PORT=5000
MONGO_URI=mongodb://localhost:27017/event-management-system
MOCKAPI_URL=https://your-mockapi-url/events
OPENWEATHER_API_KEY=your_openweather_key
```

### Backend Setup

```bash
cd backend
npm install
npm run seedEvents          # populate events collection
npm run seedAnnouncements   # populate announcements
npm start                   # runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start                   # runs on http://localhost:3000
```

### Seeding Data

* **Events**: `backend/scripts/seedEvents.js` fetches from your MockAPI or local JSON and inserts into MongoDB.
* **Announcements**: `backend/scripts/seedAnnouncements.js` inserts static announcements.

## API Reference

### Authentication

* `POST /api/auth/register` — register new user (await admin approval)
* `POST /api/auth/login`    — login, returns JWT & firstLogin flag
* `PUT  /api/auth/change-password` — change on first login or later

### Events

* `GET    /api/events`             — list all events with weather
* `GET    /api/events/:id`         — get single event
* `GET    /api/events/recommendations` — personalized (requires auth)
* `POST   /api/events`             — create event (admin)
* `PUT    /api/events/:id`         — update event (admin)
* `DELETE /api/events/:id`         — delete event (admin)

### Tickets

* `POST /api/tickets/purchase` — purchase ticket (auth)

### Announcements

* `GET    /api/announcements`       — list all announcements
* `POST   /api/announcements`       — create announcement (admin)
* `PUT    /api/announcements/:id`   — update announcement (admin)
* `DELETE /api/announcements/:id`   — delete announcement (admin)

## Deployment

We use Render.com for a free hobby tier:

1. **Backend**: Create a **Web Service**, connect GitHub repo, set build command `npm install && npm run seedEvents && npm run seedAnnouncements`, start command `npm start`, env vars from `.env`.
2. **Frontend**: Create a **Static Site**, connect the same repo, set the build command `npm install && npm run build`, publish the directory `frontend/build`.
3. **MongoDB**: Use Atlas free tier, whitelist Render IPs, set `MONGO_URI` accordingly.

Once deployed, users can visit your public URL to try the live demo.

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/...`)
3. Commit your changes (`git commit -am 'Add feature')
4. Push to the branch (`git push origin feature/...`)
5. Open a Pull Request

## License

MIT © \[Abdo essam ]
