# Medisage Project - Task Management App

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). This project allows users to create projects, add tasks to them, and manage task statuses with a clean, modern UI.

## Features

- **Project Management**: Create, view, and delete projects.
- **Task Management**:
    - Add tasks to projects with title, description, status, priority, and due date.
    - Edit and delete tasks.
    - Filter tasks by status (e.g., Todo, In Progress, Done).
    - Sort tasks by creation date or due date.
    - Search tasks by title or description.
    - **Pagination**: View tasks page by page for better performance.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide React icons.
- **Responsive Design**: Includes a collapsible sidebar for better screen real estate management.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Axios (HTTP Client)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- CORS

## Prerequisites

Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MedisageProject
```

### 2. Backend Setup
Navigate to the `Backend` directory and install dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory with your MongoDB connection string and port:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/medisage_db
# Or your MongoDB Atlas connection string
```

Start the backend server:

```bash
npm start
# Server runs on http://localhost:8000
```

### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional if using defaults):

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend development server:

```bash
npm run dev
# App runs on http://localhost:5173
```

## API Documentation

### Projects

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/projects` | Get all projects |
| `POST` | `/projects` | Create a new project |
| `GET` | `/projects/:id` | Get a specific project by ID |
| `DELETE` | `/projects/:id` | Delete a project |

#### Create Project Request Body
```json
{
  "name": "Project Alpha",
  "description": "Main development project"
}
```

### Tasks

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/projects/:project_id/tasks` | Get tasks for a specific project |
| `POST` | `/projects/:project_id/tasks` | Create a new task in a project |
| `PUT` | `/tasks/:id` | Update an existing task |
| `DELETE` | `/tasks/:id` | Delete a task |

#### Get Tasks Query Parameters
- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)
- `status`: Filter by status (`todo`, `in-progress`, `done`)
- `sort`: Sort by (`created_at`, `due_date`)
- `search`: Search by title or description

#### Create/Update Task Request Body
```json
{
  "title": "Fix login bug",
  "description": "Users cannot log in with email",
  "status": "todo",
  "priority": "high",
  "due_date": "2023-12-31"
}
```

## Folder Structure

```
MedisageProject/
├── Backend/              # Express Server
│   ├── Controllers/      # Route logic
│   ├── Models/           # Mongoose schemas
│   ├── Routes/           # API endpoints
│   ├── Utils/            # Database connection
│   └── Server.js         # Entry point
│
├── frontend/             # React App
│   ├── src/
│   │   ├── components/   # React components (TaskView, ProjectSidebar)
│   │   └── App.jsx       # Main application component
│   └── index.css         # Global styles (Tailwind)
│
└── README.md             # Project documentation
```

## License

This project is open-source and available under the ISC License.
