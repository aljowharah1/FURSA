# CareerMate - AI-Powered Co-op Manager

> **Team Info**
> | Name | Student ID |
> |------|------------|
> | Aljowharah Abdulrahman Aljubair | 222410187 |
> | Reem Saad Aljuhani | 221410309 |

CareerMate is a React-based web application designed to help university students discover, track, and manage their co-op and internship applications. Built as a group project for **SE411 - Software Engineering** at **Prince Sultan University** (Spring 2026).

## Project Requirements

The application satisfies the following requirements:

- **React Project**: Built with React 19, TypeScript, and Vite.
- **Navigation Menu**: A bottom navigation bar and header allow users to navigate between all features (Discover, Track, AI Chat, Profile, About).
- **Data Management**: Users can add, remove, update, and display job applications, documents, skills, and profile information through the Track and Profile pages.
- **About Page**: Accessible via the navigation menu, presenting team members with names and student IDs.

## Features

- AI-powered career assistant chatbot
- Smart internship matching with swipe interface
- Application tracking and management (add, edit, delete, view)
- Document management (CV, cover letters, transcripts)
- AI-generated cover letters
- Interview preparation tips
- Application analytics and insights
- Profile management with skills tracking
- Dark mode support
- Fully responsive mobile-first design

## Tech Stack

- React 19 + TypeScript
- React Router v7
- Vite
- React Spring (animations)
- CSS Modules
- LocalStorage (data persistence)

## Team Members

| Name                             | Student ID |
|----------------------------------|------------|
| Aljowharah Abdulrahman Aljubair  | 222410187  |
| Reem Saad Aljuhani               | 221410309  |

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
cd careermate-web
npm install
```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

## Project Structure

```
careermate-web/
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components (Discover, Track, Profile, AI Chat, About)
│   ├── services/      # API and data services
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Root component with routing
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── server/            # Backend server
├── package.json
└── vite.config.ts
```
