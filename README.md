# Lagerstyring Project

## Table of Contents
- [Project Overview](#project-overview)
- [Technical Stack](#technical-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Setup and Installation](#setup-and-installation)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Project Overview
Lagerstyring is a warehouse management system designed to track inventory items. The application allows users to view, sort, and manage inventory items stored in a Supabase database. The system consists of a .NET Core backend API and a React frontend.

### Key Features
- Display inventory items in a sortable table
- Select items for bulk operations
- Sort inventory by various properties (name, quantity, category, etc.)
- Error handling and user feedback
- Responsive design for various screen sizes

## Technical Stack

### Backend
- **Framework**: .NET Core 8.0
- **Language**: C#
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase .NET Client
- **API Documentation**: Swagger
- **Environment Variables**: DotNetEnv

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Native fetch API
- **Styling**: CSS
- **Environment Variables**: Vite env variables

## Architecture

The application follows a client-server architecture:

1. **Database Layer**: Supabase PostgreSQL database stores the inventory data
2. **Backend Layer**: .NET Core API retrieves data from Supabase and exposes it via RESTful endpoints
3. **Frontend Layer**: React application consumes the API and presents the data to users

### Data Flow
1. User interacts with the React frontend
2. Frontend makes HTTP requests to the backend API
3. Backend processes requests and communicates with Supabase
4. Supabase executes database operations
5. Results flow back through the same path to the user

## Database Schema

The application uses a single table in Supabase:

### Table: `beholdning`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| oprettet | timestamp with time zone | Creation date and time |
| navn | text | Name of the item |
| beskrivelse | text | Description of the item |
| mængde | integer | Quantity of the item |
| kategori | text | Category of the item |
| lokation | character varying | Storage location |
| enhed | text | Unit of measurement |

## API Documentation

The backend exposes the following API endpoints:

### GET /api/beholdning
Returns a list of all inventory items.

**Response Format**:
```json
[
  {
    "Id": 61,
    "Oprettet": "2025-04-11T12:22:05",
    "Navn": "Æbler",
    "Beskrivelse": "Friske røde æbler",
    "Mængde": 100,
    "Kategori": "Frugt",
    "Lokation": "Lager1",
    "Enhed": "kg"
  },
  // More items...
]
```

**Status Codes**:
- 200 OK: Successfully retrieved inventory items
- 500 Internal Server Error: Server-side error occurred

## Frontend Components

### Database Component
The main component that displays the inventory table. It includes:

- **State Management**:
  - `beholdning`: Array of inventory items
  - `loading`: Boolean indicating if data is being fetched
  - `error`: Error message if fetch fails
  - `selectedAll`: Boolean indicating if all items are selected
  - `selectedItems`: Object mapping item IDs to selection state
  - `sortColumn`: Current column being sorted
  - `sortDirection`: Current sort direction ('asc' or 'desc')

- **Functions**:
  - `getBeholdning()`: Fetches inventory data from the backend
  - `handleSelectAll()`: Selects or deselects all items
  - `handleSelectItem()`: Selects or deselects a single item
  - `handleSort()`: Sorts the table by a specific column

- **UI Elements**:
  - Table with sortable columns
  - Checkboxes for selecting items
  - Action buttons (Create, Delete)
  - Loading and error states

## Setup and Installation

### Prerequisites
- .NET Core SDK 8.0 or later
- Node.js 14.0 or later
- npm 6.0 or later
- Git

### Backend (C# .NET Core)

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Lagerstyring
   ```

2. Create a `.env` file in the `backend` directory with the following content:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Navigate to the backend directory:
   ```
   cd backend
   ```

4. Restore dependencies:
   ```
   dotnet restore
   ```

5. Start the backend server using the "http" profile:
   ```
   dotnet run --launch-profile http
   ```
   This will start the backend server on http://localhost:5212

6. Verify the backend is running by opening http://localhost:5212/swagger in your browser

### Frontend (React + TypeScript + Vite)

1. Create a `.env` file in the `frontend` directory with the following content:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BACKEND_URL=http://localhost:5212
   ```

2. Navigate to the frontend directory:
   ```
   cd frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```
   This will start the frontend on http://localhost:5173

5. Open http://localhost:5173 in your browser to view the application

## Development Workflow

### Backend Development

1. Make changes to the C# code
2. Run the backend with `dotnet run --launch-profile http`
3. Test your changes using Swagger UI at http://localhost:5212/swagger
4. Use the debugger in your IDE for troubleshooting

### Frontend Development

1. Make changes to the React/TypeScript code
2. The Vite dev server will automatically reload the page
3. Check the browser console for errors and logs
4. Use React Developer Tools for debugging components

### Full-Stack Development

1. Run both the backend and frontend servers
2. Make changes to either part of the application
3. Test the integration between frontend and backend

## Deployment

### Backend Deployment

1. Publish the .NET application:
   ```
   dotnet publish -c Release
   ```

2. Deploy the published files to your hosting environment
3. Set up environment variables in your hosting environment
4. Configure CORS settings to allow requests from your frontend domain

### Frontend Deployment

1. Build the production version:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your web server
3. Configure your web server to serve the application
4. Ensure the `VITE_BACKEND_URL` points to your deployed backend

## Troubleshooting

### Common Issues

#### "Kunne ikke forbinde til backend-serveren. Sørg for at backend-serveren kører på http://localhost:5212"
This error means the frontend cannot connect to the backend. Make sure:

1. The backend server is running on http://localhost:5212
2. You started the backend with the correct profile: `dotnet run --launch-profile http`
3. There are no firewall or network issues blocking the connection
4. CORS is properly configured in the backend

#### Serialization Errors in Backend
If you encounter serialization errors related to Supabase models, make sure:

1. You're using DTOs (Data Transfer Objects) to return data from controllers
2. JSON serialization options are properly configured in Program.cs

#### Frontend Not Displaying Data
If the frontend loads but doesn't display any data:

1. Check the browser console for errors
2. Verify the backend API is returning data (using Swagger UI)
3. Ensure the frontend is correctly parsing the response data

## Contributing

### Code Style Guidelines

#### Backend (C#)
- Follow Microsoft's C# coding conventions
- Use PascalCase for class names, method names, and properties
- Use camelCase for local variables and parameters
- Add XML comments for public methods and classes

#### Frontend (TypeScript/React)
- Follow the TypeScript coding guidelines
- Use functional components with hooks
- Use camelCase for variables and functions
- Use PascalCase for component names and interfaces

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request with a clear description of the changes

### Development Environment Setup

1. Install the recommended extensions for your IDE
2. Configure code formatting settings
3. Set up pre-commit hooks for linting and formatting

## Environment Variables

### Backend (.env)
- `SUPABASE_URL`: The URL for the Supabase instance
- `SUPABASE_ANON_KEY`: The anonymous key for Supabase authentication

### Frontend (.env)
- `VITE_SUPABASE_URL`: The URL for the Supabase instance
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for Supabase authentication
- `VITE_BACKEND_URL`: The URL for the backend server (default: http://localhost:5212)