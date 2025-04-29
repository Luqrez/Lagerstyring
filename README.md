# Lagerstyring Project


## Table of Contents
- [Project Overview](#project-overview)
  - [Key Features](#key-features)
  - [Business Value](#business-value)
  - [Target Users](#target-users)
- [Technical Stack](#technical-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Database](#database)
  - [Development Tools](#development-tools)
- [Architecture](#architecture)
  - [System Architecture](#system-architecture)
  - [Data Flow](#data-flow)
  - [Design Patterns](#design-patterns)
  - [Component Diagram](#component-diagram)
- [Database Schema](#database-schema)
  - [Table: beholdning](#table-beholdning)
  - [Data Types](#data-types)
  - [Relationships](#relationships)
- [API Documentation](#api-documentation)
  - [Endpoints](#endpoints)
  - [Request/Response Formats](#requestresponse-formats)
  - [Status Codes](#status-codes)
  - [Error Handling](#error-handling)
- [Frontend Components](#frontend-components)
  - [Component Structure](#component-structure)
  - [State Management](#state-management)
  - [UI/UX Design](#uiux-design)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Development Workflow](#development-workflow)
  - [Backend Development](#backend-development)
  - [Frontend Development](#frontend-development)
  - [Full-Stack Development](#full-stack-development)
  - [Version Control](#version-control)
- [Deployment](#deployment)
  - [Backend Deployment](#backend-deployment)
  - [Frontend Deployment](#frontend-deployment)
  - [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Debugging Tips](#debugging-tips)
  - [Logging](#logging)
- [Security Considerations](#security-considerations)
  - [Authentication](#authentication)
  - [Data Protection](#data-protection)
  - [API Security](#api-security)
- [Performance Optimization](#performance-optimization)
  - [Backend Optimization](#backend-optimization)
  - [Frontend Optimization](#frontend-optimization)
  - [Database Optimization](#database-optimization)
- [Testing](#testing)
  - [Unit Testing](#unit-testing)
  - [Integration Testing](#integration-testing)
  - [End-to-End Testing](#end-to-end-testing)
- [Future Development](#future-development)
  - [Planned Features](#planned-features)
  - [Architectural Improvements](#architectural-improvements)
- [Contributing](#contributing)
  - [Code Style Guidelines](#code-style-guidelines)
  - [Pull Request Process](#pull-request-process)
  - [Development Environment Setup](#development-environment-setup)
- [Environment Variables](#environment-variables)
  - [Backend Environment Variables](#backend-environment-variables)
  - [Frontend Environment Variables](#frontend-environment-variables)

## Project Overview
Lagerstyring is a comprehensive warehouse management system designed to track inventory items with precision and efficiency. The application allows users to view, sort, filter, and manage inventory items stored in a Supabase database. The system consists of a .NET Core backend API that handles data retrieval and business logic, and a React frontend that provides an intuitive user interface.

### Key Features
- Display inventory items in a sortable, filterable table
- Select items individually or in bulk for operations
- Sort inventory by various properties (name, quantity, category, etc.)
- Detailed view of individual inventory items
- Real-time error handling and user feedback
- Responsive design that works on desktops, tablets, and mobile devices
- Data validation to ensure data integrity
- Optimized performance for handling large inventory datasets

### Business Value
Lagerstyring delivers significant business value through:

- **Inventory Optimization**: Reduce excess inventory and stockouts by maintaining accurate inventory levels
- **Operational Efficiency**: Streamline warehouse operations with quick access to inventory information
- **Cost Reduction**: Minimize inventory holding costs and reduce waste from expired or obsolete items
- **Decision Support**: Provide data-driven insights for purchasing and inventory management decisions
- **Compliance**: Maintain accurate records for audit and regulatory compliance
- **Scalability**: Support business growth with a system that can handle increasing inventory volumes

### Target Users
The system is designed for various stakeholders in the inventory management process:

- **Warehouse Managers**: Oversee inventory levels and warehouse operations
- **Inventory Specialists**: Manage day-to-day inventory transactions and reconciliation
- **Purchasing Managers**: Make informed decisions about when and what to order
- **Operations Managers**: Ensure efficient warehouse operations and resource allocation
- **Financial Analysts**: Track inventory value and analyze inventory costs
- **Auditors**: Verify inventory records for compliance and financial reporting

## Technical Stack

### Backend
- **Framework**: .NET Core 8.0 - A cross-platform, high-performance framework for building modern, cloud-based, internet-connected applications
- **Language**: C# 12 - A modern, object-oriented programming language with strong typing and extensive language features
- **API Architecture**: RESTful API - Following REST principles for scalable and maintainable web services
- **ORM**: Supabase .NET Client (v1.1.1) - Official .NET client for interacting with Supabase services
- **Postgrest**: Supabase.Postgrest (v4.1.0) - Library for working with PostgreSQL databases through RESTful interfaces
- **API Documentation**: Swagger/OpenAPI - Interactive documentation for API endpoints
- **Environment Management**: DotNetEnv (v3.1.1) - Library for loading environment variables from .env files
- **JSON Serialization**: System.Text.Json - Modern, high-performance JSON serialization library
- **Dependency Injection**: Built-in .NET Core DI container - For managing service dependencies and promoting loose coupling

### Frontend
- **Framework**: React 18 - A JavaScript library for building user interfaces with a component-based architecture
- **Language**: TypeScript 5 - A strongly typed programming language that builds on JavaScript
- **Build Tool**: Vite - Next generation frontend tooling with fast HMR (Hot Module Replacement)
- **HTTP Client**: Native fetch API - Modern browser API for making HTTP requests
- **State Management**: React Hooks (useState, useEffect) - For managing component state and side effects
- **Styling**: CSS Modules - For component-scoped styling to prevent style conflicts
- **Environment Variables**: Vite env variables - For configuration management across different environments
- **Date Handling**: Native JavaScript Date API - For formatting and displaying dates
- **Internationalization**: Locale support for Danish (da-DK) - For proper sorting and formatting of Danish text

### Database
- **Database System**: PostgreSQL 15 - Advanced open-source relational database
- **Database as a Service**: Supabase - Open source Firebase alternative with PostgreSQL backend
- **Data Storage**: Structured relational data model with defined schema
- **Data Access**: RESTful API via Supabase Postgrest
- **Data Types**: Support for various data types including text, numeric, date/time, and more
- **Data Integrity**: Primary key constraints and data validation

### Development Tools
- **IDE**: Visual Studio 2022 (Backend), VS Code or WebStorm (Frontend) - Modern development environments with rich features
- **Version Control**: Git - Distributed version control system
- **Package Management**: NuGet (Backend), npm (Frontend) - For managing project dependencies
- **Debugging Tools**: .NET Debugger, Chrome DevTools - For troubleshooting and performance analysis
- **API Testing**: Swagger UI, Postman - For testing and documenting API endpoints
- **Code Quality**: Code reviews, static analysis - To maintain high code quality standards

## Architecture

### System Architecture
The Lagerstyring application follows a modern three-tier client-server architecture, designed for scalability, maintainability, and separation of concerns:

1. **Presentation Layer (Frontend)**
   - React single-page application (SPA)
   - Responsible for user interface and user experience
   - Communicates with the backend via HTTP requests
   - Handles client-side validation, state management, and rendering

2. **Application Layer (Backend)**
   - .NET Core Web API
   - Implements business logic and data validation
   - Processes requests from the frontend
   - Manages communication with the database layer
   - Handles error management and logging
   - Implements the DTO (Data Transfer Object) pattern to decouple the domain model from API responses

3. **Data Layer**
   - Supabase PostgreSQL database
   - Stores all inventory data in structured tables
   - Handles data persistence and retrieval
   - Enforces data integrity through constraints

This architecture provides several benefits:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Maintainability**: Changes in one layer have minimal impact on other layers
- **Scalability**: Each layer can be scaled independently based on demand
- **Testability**: Components can be tested in isolation
- **Security**: Sensitive operations are handled on the server-side

### Data Flow

The data flow in the application follows a request-response pattern:

1. **User Interaction**
   - User interacts with the React frontend (e.g., loading the inventory page)
   - Frontend component (Database.tsx) initializes and triggers data fetching

2. **Frontend to Backend Communication**
   - Frontend makes an HTTP GET request to `http://localhost:5212/api/beholdning`
   - Request includes appropriate headers (Accept: application/json)
   - Error handling is implemented for network issues or server errors

3. **Backend Processing**
   - BeholdningController receives the request
   - Controller uses the injected Supabase client to query the database
   - Data is retrieved from Supabase using the Beholdning model

4. **Data Transformation**
   - Backend maps the Beholdning models to BeholdningDTO objects
   - This transformation prevents serialization issues with Supabase models
   - DTOs contain only the necessary data for the frontend

5. **Response Handling**
   - Backend returns a JSON response with the inventory data
   - Frontend processes the response and updates its state
   - React components re-render to display the updated data
   - Error states are handled and displayed to the user if necessary

6. **User Interface Updates**
   - Data is displayed in a sortable table
   - User can interact with the data (sort, select items)
   - Changes to the UI state (sorting, selection) are managed locally in the frontend

### Design Patterns

The application implements several design patterns to ensure code quality and maintainability:

1. **Repository Pattern**
   - Supabase client acts as a repository for data access
   - Abstracts the data access logic from the controllers
   - Enables easier testing and potential replacement of the data source

2. **Dependency Injection**
   - Supabase client is registered as a singleton service in Program.cs
   - Controllers receive dependencies through constructor injection
   - Promotes loose coupling and testability

3. **DTO (Data Transfer Object) Pattern**
   - BeholdningDTO separates the domain model from the API response
   - Prevents serialization issues with Supabase models
   - Allows for evolution of the domain model without affecting the API contract

4. **Controller-Service Pattern**
   - Controllers handle HTTP requests and responses
   - Business logic can be extracted into service classes as the application grows

5. **Component Pattern (Frontend)**
   - UI is composed of reusable React components
   - Each component has a single responsibility
   - State management is handled using React hooks

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Frontend (SPA)                       │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐  │
│  │     Database    │    │      Button      │    │   Other    │  │
│  │    Component    │    │    Component     │    │ Components │  │
│  └────────┬────────┘    └──────────────────┘    └────────────┘  │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
            │ HTTP Requests (GET, POST, etc.)
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    .NET Core Backend API                        │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐  │
│  │   Beholdning    │    │    Program.cs    │    │   Other    │  │
│  │   Controller    │    │  (Configuration) │    │ Controllers│  │
│  └────────┬────────┘    └──────────────────┘    └────────────┘  │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
            │ Supabase Client API Calls
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Supabase Database                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    beholdning table                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

This architecture ensures a clean separation of concerns, with each component having a specific responsibility in the application.

## Database Schema

The Lagerstyring application uses a PostgreSQL database hosted on Supabase. The database schema is designed to efficiently store and retrieve inventory data.

### Table: `beholdning`

The `beholdning` table is the central data store for all inventory items in the system.

#### Table Structure

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, NOT NULL | Unique identifier for each inventory item |
| oprettet | timestamp with time zone | NOT NULL, DEFAULT now() | Date and time when the item was created |
| navn | text | NOT NULL | Name of the inventory item |
| beskrivelse | text | | Description of the inventory item |
| mængde | integer | NOT NULL, CHECK (mængde >= 0) | Quantity of the item in stock |
| kategori | text | | Category or classification of the item |
| lokation | character varying(255) | | Physical location where the item is stored |
| enhed | text | | Unit of measurement (e.g., kg, liter, piece) |

#### C# Model Representation

The table is represented in C# using the `Beholdning` class with Supabase attributes:

```csharp
[Table("beholdning")]
public class Beholdning : BaseModel
{
    [PrimaryKey("id")]
    public long Id { get; set; }                   // bigint
    [Column("oprettet")]
    public DateTime Oprettet { get; set; }         // timestamp with time zone
    [Column("navn")]
    public string Navn { get; set; }               // text
    [Column("beskrivelse")]
    public string Beskrivelse { get; set; }        // text
    [Column("mængde")]
    public int Mængde { get; set; }                // integer
    [Column("kategori")]
    public string Kategori { get; set; }           // text
    [Column("lokation")]
    public string Lokation { get; set; }           // character varying
    [Column("enhed")]
    public string Enhed { get; set; }              // text
}
```

#### TypeScript Interface Representation

The table is represented in TypeScript using the `Beholdning` interface:

```typescript
interface Beholdning {
    Id: number;
    Oprettet: string;
    Navn: string;
    Beskrivelse: string;
    Mængde: number;
    Kategori: string;
    Lokation: string;
    Enhed: string;
}
```

### Data Types

The table uses various PostgreSQL data types to efficiently store different kinds of information:

- **bigint**: 8-byte signed integer, used for the primary key to support a large number of inventory items
- **timestamp with time zone**: Date and time with timezone information, ensuring consistent datetime handling across different timezones
- **text**: Variable-length character string with unlimited length, ideal for storing names, descriptions, and other text data
- **integer**: 4-byte signed integer, suitable for storing quantities
- **character varying(255)**: Variable-length character string with a maximum length, used for location data

### Relationships

In the current implementation, the `beholdning` table stands alone without foreign key relationships to other tables. This simple structure is sufficient for the current requirements of the application.

Future enhancements could include:

- **Categories Table**: To normalize category data and enable hierarchical categorization
- **Locations Table**: To standardize location information and support location hierarchy
- **Units Table**: To standardize units of measurement
- **Transactions Table**: To track inventory movements (additions, removals, transfers)
- **Users Table**: To track who created or modified inventory items

These potential relationships would transform the database schema into a more normalized structure, reducing data redundancy and improving data integrity.

## API Documentation

The Lagerstyring backend exposes a RESTful API that follows standard HTTP conventions. The API is designed to be simple, predictable, and easy to use.

### Endpoints

The API currently provides the following endpoints:

#### GET /api/beholdning

Retrieves a list of all inventory items from the database.

**Purpose**: This endpoint is used by the frontend to display the inventory table.

**Authentication**: No authentication is currently required.

**Parameters**: None

**Implementation Details**:
```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<BeholdningDTO>>> GetBeholdning()
{
    try
    {
        var result = await _supabase.From<Beholdning>().Get();
        var beholdning = result.Models;

        // Map Beholdning models to BeholdningDTO objects
        var beholdningDTOs = beholdning.Select(b => new BeholdningDTO
        {
            Id = b.Id,
            Oprettet = b.Oprettet,
            Navn = b.Navn,
            Beskrivelse = b.Beskrivelse,
            Mængde = b.Mængde,
            Kategori = b.Kategori,
            Lokation = b.Lokation,
            Enhed = b.Enhed
        }).ToList();

        return Ok(beholdningDTOs);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}
```

### Request/Response Formats

All API endpoints use JSON as the primary data format for both requests and responses.

#### GET /api/beholdning Response

**Content-Type**: `application/json`

**Response Body**:
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
  {
    "Id": 62,
    "Oprettet": "2025-04-11T12:22:05",
    "Navn": "Bananer",
    "Beskrivelse": "Gule bananer",
    "Mængde": 150,
    "Kategori": "Frugt",
    "Lokation": "Lager1",
    "Enhed": "kg"
  }
  // Additional items...
]
```

**Response Properties**:

| Property | Type | Description |
|----------|------|-------------|
| Id | number | Unique identifier for the inventory item |
| Oprettet | string (ISO 8601 date) | Date and time when the item was created |
| Navn | string | Name of the inventory item |
| Beskrivelse | string | Description of the inventory item |
| Mængde | number | Quantity of the item in stock |
| Kategori | string | Category or classification of the item |
| Lokation | string | Physical location where the item is stored |
| Enhed | string | Unit of measurement (e.g., kg, liter, piece) |

### Status Codes

The API uses standard HTTP status codes to indicate the success or failure of requests:

| Status Code | Description | When It's Used |
|-------------|-------------|----------------|
| 200 OK | The request was successful | When inventory items are successfully retrieved |
| 400 Bad Request | The request was invalid | When the client sends an invalid request (future endpoints) |
| 401 Unauthorized | Authentication is required | When authentication is implemented and credentials are missing or invalid |
| 403 Forbidden | The client doesn't have permission | When authorization is implemented and the user lacks necessary permissions |
| 404 Not Found | The requested resource was not found | When trying to access a non-existent endpoint or resource |
| 500 Internal Server Error | An error occurred on the server | When an exception is thrown during request processing |

### Error Handling

The API implements consistent error handling to provide clear feedback when issues occur:

#### Error Response Format

```json
{
  "message": "Internal server error: Error message details"
}
```

#### Error Handling in Code

The controller uses try-catch blocks to handle exceptions and return appropriate status codes:

```csharp
try
{
    // API logic here
}
catch (Exception ex)
{
    return StatusCode(500, $"Internal server error: {ex.Message}");
}
```

#### Client-Side Error Handling

The frontend handles API errors by displaying user-friendly error messages:

```typescript
try {
    // API request logic
} catch (err) {
    console.error("Fejl ved hentning af beholdning:", err);
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError("Kunne ikke forbinde til backend-serveren. Sørg for at backend-serveren kører på http://localhost:5212");
    } else {
        setError(`Der opstod en fejl ved hentning af data: ${err instanceof Error ? err.message : String(err)}`);
    }
}
```

### API Evolution

The API is designed to evolve over time while maintaining backward compatibility:

- **Future Endpoints**: Additional endpoints will be added for creating, updating, and deleting inventory items
- **Versioning**: API versioning will be implemented if significant changes are needed
- **Documentation**: This documentation will be updated as the API evolves

### Testing the API

The API can be tested using:

1. **Swagger UI**: Available at `http://localhost:5212/swagger` when running in development mode
2. **Postman**: Import the API endpoints and test them with different parameters
3. **curl**: Use command-line requests to test the API endpoints

Example curl request:
```bash
curl -X GET "http://localhost:5212/api/beholdning" -H "accept: application/json"
```

## Frontend Components

The frontend of the Lagerstyring application is built with React and TypeScript, following a component-based architecture for maintainability and reusability.

### Component Structure

The application is organized into the following component hierarchy:

```
App
└── Stock (Route)
    └── Database
        ├── Button (Create/Delete)
        └── Table
            ├── TableHeader
            │   └── SortableColumn
            └── TableRow
                └── Checkbox
```

#### Key Components

1. **App**: The root component that sets up routing and global application state
2. **Stock**: A route component that serves as a container for inventory management
3. **Database**: The main component for displaying and interacting with inventory data
4. **Button**: A reusable component for action buttons with different variants
5. **Table**: A structured display of inventory data with sorting and selection capabilities

### Database Component

The Database component is the central component of the application, responsible for:

1. Fetching and displaying inventory data
2. Managing selection state for bulk operations
3. Implementing sorting functionality
4. Handling loading and error states
5. Providing user interface for inventory management

#### Component Implementation

```tsx
function Database() {
    const [beholdning, setBeholdning] = useState<Beholdning[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAll, setSelectedAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const [sortColumn, setSortColumn] = useState<keyof Beholdning | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Component lifecycle and data fetching
    useEffect(() => {
        getBeholdning();
    }, []);

    // Data fetching function
    async function getBeholdning() {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5212/api/beholdning', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setBeholdning(data || []);
        } catch (err) {
            console.error("Fejl ved hentning af beholdning:", err);
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError("Kunne ikke forbinde til backend-serveren. Sørg for at backend-serveren kører på http://localhost:5212");
            } else {
                setError(`Der opstod en fejl ved hentning af data: ${err instanceof Error ? err.message : String(err)}`);
            }
        } finally {
            setLoading(false);
        }
    }

    // Render component based on state
    return (
        <div className="container">
            {/* Component UI */}
        </div>
    );
}
```

### State Management

The application uses React's built-in state management through the `useState` and `useEffect` hooks:

#### State Variables

| State Variable | Type | Purpose |
|----------------|------|---------|
| `beholdning` | `Beholdning[]` | Stores the inventory items retrieved from the API |
| `loading` | `boolean` | Tracks whether data is currently being fetched |
| `error` | `string \| null` | Stores error messages when API calls fail |
| `selectedAll` | `boolean` | Indicates whether all items are selected |
| `selectedItems` | `{ [key: number]: boolean }` | Maps item IDs to their selection state |
| `sortColumn` | `keyof Beholdning \| null` | The current column being used for sorting |
| `sortDirection` | `'asc' \| 'desc'` | The direction of the current sort operation |

#### State Management Functions

| Function | Purpose |
|----------|---------|
| `getBeholdning()` | Fetches inventory data from the backend API and updates state |
| `handleSelectAll()` | Toggles selection of all items when the header checkbox is clicked |
| `handleSelectItem()` | Toggles selection of a single item when its checkbox is clicked |
| `handleSort()` | Updates sort state when a column header is clicked |
| `sortedBeholdning` | Computed value that returns sorted inventory items based on current sort state |

### UI/UX Design

The user interface is designed with the following principles:

#### Layout and Structure

- **Responsive Design**: The table layout adjusts to different screen sizes
- **Table Layout**: Data is presented in a structured table with clear column headers
- **Action Area**: Buttons for bulk operations are positioned above the table
- **Scrollable Content**: The table body is scrollable while headers remain fixed

#### Interactive Elements

- **Sortable Columns**: Column headers can be clicked to sort the table
- **Sort Indicators**: Visual indicators show the current sort column and direction
- **Selection Checkboxes**: Checkboxes allow selection of individual or all items
- **Action Buttons**: Buttons for creating new items and deleting selected items

#### Visual Feedback

- **Loading State**: A loading indicator is shown while data is being fetched
- **Error Messages**: Clear error messages are displayed when operations fail
- **Empty State**: A message is shown when no inventory items are available
- **Hover Effects**: Interactive elements have hover states for better usability

#### CSS Implementation

The component uses CSS modules for styling, with class names scoped to the component:

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.beholdning-tabel {
    width: 100%;
    border-collapse: collapse;
    /* Additional styling */
}

/* Additional CSS classes for table elements, sorting, etc. */
```

### Component Interactions

The components interact through the following patterns:

1. **Parent-Child Props**: The Database component passes props to child components
2. **Event Handlers**: Child components emit events that are handled by parent components
3. **State Updates**: Event handlers update state, triggering re-renders
4. **Computed Values**: Derived state (like `sortedBeholdning`) is computed from primary state

This component architecture provides a maintainable and scalable foundation for the application's frontend.

## Setup and Installation

This section provides detailed instructions for setting up the Lagerstyring application for development or testing purposes. Follow these steps carefully to ensure a smooth setup process.

### Prerequisites

Before you begin, ensure your development environment meets the following requirements:

#### Required Software

- **.NET Core SDK 8.0 or later**: Required for building and running the backend
  - [Download .NET Core SDK](https://dotnet.microsoft.com/download)
  - Verify installation: `dotnet --version`

- **Node.js 16.0 or later**: Required for the frontend development
  - [Download Node.js](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm 8.0 or later**: Package manager for JavaScript (comes with Node.js)
  - Verify installation: `npm --version`

- **Git**: Version control system for cloning the repository
  - [Download Git](https://git-scm.com/downloads)
  - Verify installation: `git --version`

#### Development Tools (Recommended)

- **Visual Studio 2022**: For backend development (Community edition is free)
  - [Download Visual Studio](https://visualstudio.microsoft.com/downloads/)
  - Required workloads: ASP.NET and web development

- **Visual Studio Code**: For frontend development
  - [Download VS Code](https://code.visualstudio.com/)
  - Recommended extensions:
    - ESLint
    - Prettier
    - TypeScript and JavaScript Language Features
    - React Developer Tools

#### System Requirements

- **Operating System**: Windows 10/11, macOS, or Linux
- **RAM**: 8 GB or more recommended
- **Disk Space**: At least 2 GB of free space
- **Internet Connection**: Required for downloading dependencies and connecting to Supabase

### Backend Setup (C# .NET Core)

Follow these steps to set up the backend server:

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Lagerstyring
```

#### 2. Configure Environment Variables

The application uses a single `.env` file in the root directory that is shared by all components. Create a `.env` file in the root directory with the following content:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
BACKEND_ENDPOINT=http://localhost:5212/api/realtime/beholdning
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase credentials.

> **Note**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

#### 3. Restore Dependencies

Navigate to the backend directory and restore the required packages:

```bash
cd backend
dotnet restore
```

This command downloads all the NuGet packages specified in the project file.

#### 4. Build the Project

Build the backend project to ensure all dependencies are correctly resolved:

```bash
dotnet build
```

If the build succeeds, you'll see a message indicating that the build completed successfully.

#### 5. Start the Backend Server

Start the backend server using the "http" profile:

```bash
dotnet run --launch-profile http
```

This command:
- Compiles the application
- Starts the server on http://localhost:5212
- Configures the application for development mode

> **Important**: Always use the "http" profile during development to avoid HTTPS-related issues with the frontend.

#### 6. Verify the Backend

Open your browser and navigate to:

```
http://localhost:5212/swagger
```

You should see the Swagger UI with the available API endpoints. This confirms that your backend is running correctly.

### Frontend Setup (React + TypeScript + Vite)

Follow these steps to set up the frontend application:

#### 1. Frontend Environment Variables

The frontend uses the same `.env` file in the root directory as the backend. If you need frontend-specific environment variables, add them to the root `.env` file with the `VITE_` prefix:

```
# Add these to the root .env file for frontend use
VITE_BACKEND_URL=http://localhost:5212
VITE_API_TIMEOUT=30000
VITE_LOG_LEVEL=info
```

> **Note**: Variables in the `.env` file must be prefixed with `VITE_` to be accessible in the frontend code.

#### 2. Install Dependencies

Navigate to the frontend directory and install the required packages:

```bash
cd frontend
npm install
```

This command reads the `package.json` file and installs all the dependencies required for the frontend.

#### 3. Start the Development Server

Start the Vite development server:

```bash
npm run dev
```

This command:
- Starts the development server on http://localhost:5173
- Enables hot module replacement for fast development
- Watches for file changes and automatically reloads the browser

#### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the Lagerstyring application running in your browser.

### Realtime Bridge Setup

The realtime bridge is a Node.js application that facilitates real-time communication between the backend and frontend.

#### 1. Install Dependencies

Navigate to the realtime-bridge directory and install the required packages:

```bash
cd realtime-bridge
npm install
```

This command installs all the dependencies required for the realtime bridge.

#### 2. Start the Realtime Bridge

Start the realtime bridge server:

```bash
npm run dev
```

This starts the realtime bridge service that enables real-time updates in the application.

### Installing All Dependencies at Once

For convenience, you can install dependencies for all components (root, frontend, and realtime-bridge) with a single command from the project root:

```bash
npm run install-all
```

This command will:
1. Install dependencies in the root directory
2. Install dependencies in the frontend directory
3. Install dependencies in the realtime-bridge directory

Use this approach to quickly set up all components without having to navigate to each directory separately.

### Database Setup

The application uses Supabase as its database provider. Follow these steps to set up the database:

#### 1. Create a Supabase Account

If you don't already have a Supabase account:
1. Go to [Supabase](https://supabase.com/)
2. Sign up for a free account
3. Create a new project

#### 2. Create the Database Table

1. In your Supabase project, navigate to the SQL Editor
2. Create the `beholdning` table using the following SQL:

```sql
CREATE TABLE beholdning (
    id BIGSERIAL PRIMARY KEY,
    oprettet TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    navn TEXT NOT NULL,
    beskrivelse TEXT,
    mængde INTEGER NOT NULL CHECK (mængde >= 0),
    kategori TEXT,
    lokation VARCHAR(255),
    enhed TEXT
);
```

#### 3. Insert Sample Data (Optional)

To populate the table with sample data:

```sql
INSERT INTO beholdning (navn, beskrivelse, mængde, kategori, lokation, enhed)
VALUES
    ('Æbler', 'Friske røde æbler', 100, 'Frugt', 'Lager1', 'kg'),
    ('Bananer', 'Gule bananer', 150, 'Frugt', 'Lager1', 'kg'),
    ('Appelsiner', 'Saftige appelsiner', 200, 'Frugt', 'Lager2', 'kg'),
    ('Gulerødder', 'Friske gulerødder', 120, 'Grøntsager', 'Lager2', 'kg'),
    ('Kartofler', 'Økologiske kartofler', 300, 'Grøntsager', 'Lager3', 'kg');
```

#### 4. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to Settings > API
2. Copy the URL and anon/public key
3. Use these values in your root `.env` file

### Troubleshooting Installation Issues

#### Backend Issues

- **Port Conflict**: If port 5212 is already in use, modify the `applicationUrl` in `launchSettings.json`
- **Database Connection**: Ensure your Supabase credentials are correct in the root `.env` file
- **Missing Dependencies**: Run `dotnet restore` again if you encounter missing package errors

#### Frontend Issues

- **Node Version**: Ensure you're using Node.js 16.0 or later
- **Port Conflict**: If port 5173 is already in use, Vite will automatically suggest an alternative port
- **Environment Variables**: Make sure all environment variables are prefixed with `VITE_`

#### Connection Issues

- **CORS Errors**: Ensure the backend CORS configuration includes the frontend origin
- **Network Errors**: Check that both servers are running and accessible
- **API Errors**: Verify the backend URL in the root `.env` file is correct

## Development Workflow

This section outlines the recommended development workflows for working with the Lagerstyring application, covering backend, frontend, and full-stack development processes.

### Backend Development

The backend development workflow focuses on the C# .NET Core API and its interaction with the Supabase database.

#### Development Environment Setup

1. **IDE Configuration**:
   - Open the solution file (`Lagerstyring.sln`) in Visual Studio 2022
   - Alternatively, use Visual Studio Code with C# extensions
   - Configure the startup project to be the `backend` project

2. **Debug Configuration**:
   - Set the launch profile to "http" in the debug dropdown
   - Configure any breakpoints needed for debugging

#### Development Cycle

1. **Make Code Changes**:
   - Modify controllers, models, or services as needed
   - Follow C# coding conventions and patterns
   - Add XML comments for public methods and classes

2. **Build the Project**:
   - Build the solution using `Ctrl+Shift+B` in Visual Studio
   - Or use the command line: `dotnet build`
   - Address any compilation errors or warnings

3. **Run the Application**:
   - Start the application in debug mode using `F5` in Visual Studio
   - Or use the command line: `dotnet run --launch-profile http`
   - The API will be available at http://localhost:5212

4. **Test API Endpoints**:
   - Use Swagger UI at http://localhost:5212/swagger to test endpoints
   - Verify request/response formats and status codes
   - Check that data is correctly retrieved from or sent to Supabase

5. **Debug Issues**:
   - Use breakpoints to pause execution at specific points
   - Inspect variables and call stacks
   - Check the console output for errors and logs
   - Use try-catch blocks to handle and log exceptions

#### Best Practices

- **Separation of Concerns**: Keep controllers thin, move business logic to services
- **Error Handling**: Use try-catch blocks and return appropriate status codes
- **Logging**: Add logging for important operations and errors
- **DTOs**: Use DTOs to decouple the domain model from API responses
- **Async/Await**: Use async/await for all I/O operations to maintain scalability

### Frontend Development

The frontend development workflow focuses on the React/TypeScript application and its interaction with the backend API.

#### Development Environment Setup

1. **IDE Configuration**:
   - Open the `frontend` directory in Visual Studio Code
   - Install recommended extensions (ESLint, Prettier, etc.)
   - Configure auto-formatting on save for consistent code style

2. **Browser Setup**:
   - Install React Developer Tools extension for Chrome or Firefox
   - Enable browser developer tools for debugging

#### Development Cycle

1. **Make Code Changes**:
   - Modify components, styles, or utilities as needed
   - Follow TypeScript and React best practices
   - Add comments for complex logic or component props

2. **Run the Development Server**:
   - Start the Vite dev server: `npm run dev`
   - The application will be available at http://localhost:5173
   - Vite provides hot module replacement for instant feedback

3. **Test in Browser**:
   - Verify that UI changes appear as expected
   - Test functionality across different screen sizes
   - Check for console errors or warnings

4. **Debug Issues**:
   - Use `console.log()` statements for debugging
   - Set breakpoints in browser developer tools
   - Use React Developer Tools to inspect component props and state
   - Check network requests in the Network tab

5. **Optimize and Refine**:
   - Review code for performance issues
   - Extract reusable components
   - Ensure proper error handling
   - Validate user inputs

#### Best Practices

- **Component Structure**: Keep components small and focused on a single responsibility
- **State Management**: Use React hooks appropriately (useState, useEffect, etc.)
- **TypeScript**: Leverage TypeScript for type safety and better IDE support
- **Error Boundaries**: Implement error boundaries to prevent entire app crashes
- **Accessibility**: Ensure UI elements are accessible (proper ARIA attributes, keyboard navigation)

### Full-Stack Development

Full-stack development involves working on both the backend and frontend simultaneously to implement complete features.

#### Development Environment Setup

1. **Terminal Setup**:
   - Use multiple terminal windows or tabs
   - One for the backend server
   - One for the frontend server
   - One for running commands (git, etc.)

2. **IDE Setup**:
   - Use Visual Studio for backend development
   - Use VS Code for frontend development
   - Or use VS Code for both with appropriate extensions

3. **Running the Full Stack**:
   - Use the root-level npm script to start all components:
     ```bash
     npm run dev
     ```
   - This command:
     - Starts the backend server on http://localhost:5212
     - Starts the realtime-bridge on its default port
     - Starts the frontend server on http://localhost:5173
   - **Important**: Make sure you have a `.env` file in the root directory with the required environment variables:
     - SUPABASE_URL
     - SUPABASE_ANON_KEY
     - BACKEND_ENDPOINT

#### Development Cycle

1. **Plan the Feature**:
   - Define the API contract (endpoints, request/response formats)
   - Design the UI components and interactions
   - Identify data models and state management needs

2. **Implement Backend First**:
   - Create or modify API endpoints
   - Implement data access and business logic
   - Test endpoints with Swagger UI

3. **Implement Frontend**:
   - Create or modify React components
   - Connect to the API endpoints
   - Implement UI interactions and state management

4. **Integration Testing**:
   - Test the complete feature end-to-end
   - Verify data flow from UI to database and back
   - Check error handling and edge cases

5. **Refine and Polish**:
   - Optimize performance
   - Improve error messages and user feedback
   - Ensure consistent styling and UX

#### Best Practices

- **API Contract**: Clearly define and document the API contract before implementation
- **Parallel Development**: Use mock data to develop frontend while backend is in progress
- **Consistent Naming**: Use consistent naming conventions across backend and frontend
- **Error Handling**: Implement comprehensive error handling on both sides
- **Code Reviews**: Review both backend and frontend code for consistency and quality

### Version Control

Effective use of version control is essential for collaborative development and maintaining code quality.

#### Branching Strategy

1. **Main Branch**: `main` or `master`
   - Always contains stable, production-ready code
   - Protected from direct pushes

2. **Development Branch**: `develop`
   - Integration branch for features
   - Should always be in a working state

3. **Feature Branches**: `feature/feature-name`
   - Created from `develop`
   - One branch per feature or task
   - Merged back to `develop` when complete

4. **Bugfix Branches**: `bugfix/bug-description`
   - Created from `develop` for non-critical bugs
   - Created from `main` for critical production bugs

5. **Release Branches**: `release/version-number`
   - Created from `develop` when preparing a release
   - Only bugfixes are committed to release branches

#### Commit Guidelines

1. **Commit Messages**:
   - Use present tense ("Add feature" not "Added feature")
   - First line is a summary (max 50 characters)
   - Followed by a blank line and detailed description if needed
   - Reference issue numbers if applicable

2. **Commit Frequency**:
   - Commit small, logical changes
   - Each commit should represent a single logical change
   - Avoid mixing unrelated changes in a single commit

#### Pull Request Process

1. **Creating Pull Requests**:
   - Create a pull request from your feature branch to `develop`
   - Provide a clear description of the changes
   - Reference any related issues

2. **Code Review**:
   - At least one team member should review the code
   - Check for code quality, bugs, and adherence to standards
   - Automated tests should pass before merging

3. **Merging**:
   - Squash commits if there are many small commits
   - Use merge commits to maintain history
   - Delete the feature branch after merging

## Deployment

This section provides detailed instructions for deploying the Lagerstyring application to production environments, ensuring a smooth transition from development to production.

### Backend Deployment

The .NET Core backend can be deployed to various hosting environments, including cloud platforms, virtual machines, or containers.

#### Preparation

1. **Update Configuration**:
   - Review and update `appsettings.json` for production settings
   - Ensure all sensitive information is stored in environment variables, not in configuration files
   - Update CORS settings to allow only specific origins

2. **Create Production Build**:
   - Publish the .NET application with the Release configuration:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
   - This creates an optimized build in the `./publish` directory

#### Deployment Options

##### Option 1: Azure App Service

1. **Create Azure App Service**:
   - Log in to the Azure Portal
   - Create a new App Service with .NET Core 8.0 runtime
   - Choose an appropriate pricing tier based on expected traffic

2. **Configure Environment Variables**:
   - In the App Service Configuration section, add the following Application Settings:
     - `SUPABASE_URL`: Your Supabase URL
     - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `ASPNETCORE_ENVIRONMENT`: Set to "Production"

3. **Deploy the Application**:
   - Use Azure CLI:
   ```bash
   az webapp deployment source config-zip --resource-group <resource-group> --name <app-name> --src ./publish.zip
   ```
   - Or use Visual Studio's Publish feature
   - Or set up CI/CD with GitHub Actions or Azure DevOps

4. **Configure Custom Domain and SSL**:
   - Add a custom domain in the Azure Portal
   - Enable managed SSL certificates

##### Option 2: Docker Deployment

1. **Create Dockerfile**:
   ```dockerfile
   FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
   WORKDIR /app
   EXPOSE 80
   EXPOSE 443

   FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
   WORKDIR /src
   COPY ["backend.csproj", "./"]
   RUN dotnet restore "backend.csproj"
   COPY . .
   RUN dotnet build "backend.csproj" -c Release -o /app/build

   FROM build AS publish
   RUN dotnet publish "backend.csproj" -c Release -o /app/publish

   FROM base AS final
   WORKDIR /app
   COPY --from=publish /app/publish .
   ENTRYPOINT ["dotnet", "backend.dll"]
   ```

2. **Build and Push Docker Image**:
   ```bash
   docker build -t lagerstyring-backend:latest .
   docker tag lagerstyring-backend:latest <registry>/lagerstyring-backend:latest
   docker push <registry>/lagerstyring-backend:latest
   ```

3. **Deploy Container**:
   - Deploy to Kubernetes, Azure Container Instances, or other container platforms
   - Set environment variables in the container configuration

##### Option 3: Traditional Hosting

1. **Prepare Server**:
   - Set up a Windows or Linux server
   - Install .NET Core 8.0 Runtime
   - Configure a reverse proxy (Nginx, Apache, IIS)

2. **Deploy Files**:
   - Copy the published files to the server
   - Set up environment variables on the server
   - Configure the web server to forward requests to the .NET application

3. **Set Up Process Management**:
   - Use systemd on Linux or Windows Services on Windows
   - Configure automatic restarts in case of failures

#### Post-Deployment Steps

1. **Verify Deployment**:
   - Test API endpoints using Swagger or Postman
   - Check logs for any startup errors
   - Monitor application performance

2. **Set Up Monitoring**:
   - Configure Application Insights or other monitoring tools
   - Set up alerts for critical errors
   - Monitor resource usage (CPU, memory, etc.)

3. **Configure Backups**:
   - Set up regular database backups
   - Implement a disaster recovery plan

### Frontend Deployment

The React frontend can be deployed to various static hosting services or traditional web servers.

#### Preparation

1. **Update Environment Variables**:
   - Create a `.env.production` file with production settings:
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   VITE_BACKEND_URL=https://your-production-backend-url.com
   ```

2. **Create Production Build**:
   - Build the production version of the frontend:
   ```bash
   npm run build
   ```
   - This creates optimized static files in the `dist` directory

#### Deployment Options

##### Option 1: Netlify

1. **Set Up Netlify**:
   - Create a Netlify account if you don't have one
   - Install the Netlify CLI: `npm install -g netlify-cli`

2. **Configure Netlify**:
   - Create a `netlify.toml` file in the frontend directory:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

4. **Configure Environment Variables**:
   - Add environment variables in the Netlify dashboard
   - Enable HTTPS and custom domain if needed

##### Option 2: Vercel

1. **Set Up Vercel**:
   - Create a Vercel account if you don't have one
   - Install the Vercel CLI: `npm install -g vercel`

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**:
   - Add environment variables in the Vercel dashboard
   - Configure custom domain and HTTPS settings

##### Option 3: Traditional Web Server

1. **Prepare Web Server**:
   - Set up a web server (Nginx, Apache, IIS)
   - Configure the server to serve static files

2. **Deploy Files**:
   - Copy the contents of the `dist` directory to the web server's document root
   - Configure the web server to redirect all routes to `index.html` for SPA routing

3. **Configure HTTPS**:
   - Set up SSL certificates (Let's Encrypt is a free option)
   - Configure HTTPS redirection

#### Post-Deployment Steps

1. **Verify Deployment**:
   - Test the application in different browsers
   - Check for console errors
   - Verify that API requests work correctly

2. **Set Up Monitoring**:
   - Configure analytics (Google Analytics, Plausible, etc.)
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Monitor performance metrics

3. **Performance Optimization**:
   - Run Lighthouse audits to identify performance issues
   - Implement caching strategies
   - Configure CDN for static assets

### CI/CD Pipeline

Setting up a Continuous Integration/Continuous Deployment (CI/CD) pipeline automates the build, test, and deployment process.

#### GitHub Actions CI/CD

1. **Create Workflow File**:
   - Create a `.github/workflows/ci-cd.yml` file in your repository:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
    - name: Restore dependencies
      run: dotnet restore
      working-directory: ./backend
    - name: Build
      run: dotnet build --no-restore
      working-directory: ./backend
    - name: Test
      run: dotnet test --no-build --verbosity normal
      working-directory: ./backend

  build-and-test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 16
    - name: Install dependencies
      run: npm ci
      working-directory: ./frontend
    - name: Build
      run: npm run build
      working-directory: ./frontend
    - name: Test
      run: npm test
      working-directory: ./frontend

  deploy-backend:
    needs: [build-and-test-backend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
    - name: Publish
      run: dotnet publish -c Release -o ./publish
      working-directory: ./backend
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'your-app-name'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./backend/publish

  deploy-frontend:
    needs: [build-and-test-frontend, deploy-backend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 16
    - name: Install dependencies
      run: npm ci
      working-directory: ./frontend
    - name: Build
      run: npm run build
      working-directory: ./frontend
      env:
        VITE_BACKEND_URL: https://your-production-backend-url.com
        VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --dir=./frontend/dist --prod
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

2. **Configure Secrets**:
   - Add the necessary secrets in your GitHub repository settings:
     - `AZURE_WEBAPP_PUBLISH_PROFILE`: Azure publish profile
     - `NETLIFY_AUTH_TOKEN`: Netlify authentication token
     - `NETLIFY_SITE_ID`: Netlify site ID
     - `SUPABASE_URL`: Supabase URL
     - `SUPABASE_ANON_KEY`: Supabase anonymous key

3. **Customize Workflow**:
   - Adjust the workflow file based on your specific deployment targets
   - Add additional steps for database migrations, notifications, etc.

#### Azure DevOps Pipeline

1. **Create Pipeline File**:
   - Create an `azure-pipelines.yml` file in your repository:

```yaml
trigger:
- main

stages:
- stage: Build
  jobs:
  - job: BuildBackend
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: UseDotNet@2
      inputs:
        packageType: 'sdk'
        version: '8.0.x'
    - script: dotnet restore
      workingDirectory: ./backend
      displayName: 'Restore dependencies'
    - script: dotnet build --configuration Release
      workingDirectory: ./backend
      displayName: 'Build backend'
    - script: dotnet publish -c Release -o $(Build.ArtifactStagingDirectory)/backend
      workingDirectory: ./backend
      displayName: 'Publish backend'
    - task: PublishBuildArtifacts@1
      inputs:
        pathtoPublish: '$(Build.ArtifactStagingDirectory)/backend'
        artifactName: 'backend'

  - job: BuildFrontend
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '16.x'
    - script: npm ci
      workingDirectory: ./frontend
      displayName: 'Install dependencies'
    - script: npm run build
      workingDirectory: ./frontend
      displayName: 'Build frontend'
      env:
        VITE_BACKEND_URL: https://your-production-backend-url.com
        VITE_SUPABASE_URL: $(SUPABASE_URL)
        VITE_SUPABASE_ANON_KEY: $(SUPABASE_ANON_KEY)
    - task: CopyFiles@2
      inputs:
        sourceFolder: './frontend/dist'
        contents: '**'
        targetFolder: '$(Build.ArtifactStagingDirectory)/frontend'
    - task: PublishBuildArtifacts@1
      inputs:
        pathtoPublish: '$(Build.ArtifactStagingDirectory)/frontend'
        artifactName: 'frontend'

- stage: Deploy
  dependsOn: Build
  jobs:
  - job: DeployBackend
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: DownloadBuildArtifacts@0
      inputs:
        buildType: 'current'
        downloadType: 'single'
        artifactName: 'backend'
        downloadPath: '$(System.ArtifactsDirectory)'
    - task: AzureWebApp@1
      inputs:
        azureSubscription: 'Your-Azure-Subscription'
        appType: 'webApp'
        appName: 'your-app-name'
        package: '$(System.ArtifactsDirectory)/backend'
        deploymentMethod: 'auto'

  - job: DeployFrontend
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: DownloadBuildArtifacts@0
      inputs:
        buildType: 'current'
        downloadType: 'single'
        artifactName: 'frontend'
        downloadPath: '$(System.ArtifactsDirectory)'
    - task: AzureStaticWebApp@0
      inputs:
        app_location: '$(System.ArtifactsDirectory)/frontend'
        azure_static_web_apps_api_token: $(AZURE_STATIC_WEB_APPS_API_TOKEN)
```

2. **Configure Variables**:
   - Add the necessary variables in your Azure DevOps pipeline settings:
     - `SUPABASE_URL`: Supabase URL
     - `SUPABASE_ANON_KEY`: Supabase anonymous key
     - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Azure Static Web Apps deployment token

3. **Set Up Service Connections**:
   - Configure service connections for Azure in the Azure DevOps project settings

### Deployment Best Practices

1. **Environment Separation**:
   - Maintain separate environments for development, staging, and production
   - Use environment-specific configuration and variables

2. **Zero-Downtime Deployment**:
   - Implement blue-green deployment or rolling updates
   - Ensure database migrations are backward compatible

3. **Rollback Plan**:
   - Have a clear plan for rolling back deployments if issues occur
   - Keep previous versions of the application available for quick rollback

4. **Security**:
   - Scan dependencies for vulnerabilities before deployment
   - Implement proper access controls for deployment environments
   - Use secure communication channels for all deployment steps

5. **Documentation**:
   - Document the deployment process and requirements
   - Keep deployment scripts and configurations in version control
   - Maintain a deployment log with dates, versions, and notes

## Troubleshooting

This section provides guidance for diagnosing and resolving common issues that may arise during development, deployment, or operation of the Lagerstyring application.

### Common Issues

#### Backend Issues

##### Connection Errors

**Issue**: "Kunne ikke forbinde til backend-serveren. Sørg for at backend-serveren kører på http://localhost:5212"

This error occurs when the frontend cannot establish a connection to the backend server.

**Troubleshooting Steps**:

1. **Verify Backend Server Status**:
   - Ensure the backend server is running on http://localhost:5212
   - Check that you started the backend with the correct profile: `dotnet run --launch-profile http`
   - Try accessing Swagger UI at http://localhost:5212/swagger to verify the API is accessible

2. **Check Network Configuration**:
   - Verify there are no firewall rules blocking the connection
   - Check if any antivirus or security software is blocking the connection
   - Ensure your network allows connections to localhost

3. **Verify CORS Configuration**:
   - Check that CORS is properly configured in Program.cs
   - Ensure the frontend origin (http://localhost:5173) is allowed in the CORS policy
   - Look for CORS-related errors in the browser console

4. **Port Conflicts**:
   - Check if another application is using port 5212
   - Use `netstat -ano | findstr 5212` (Windows) or `lsof -i :5212` (Linux/macOS) to identify processes using the port
   - Change the port in launchSettings.json if needed

##### Serialization Errors

**Issue**: "System.NotSupportedException: The type 'Supabase.Postgrest.Attributes.PrimaryKeyAttribute' is not a supported dictionary key"

This error occurs when trying to serialize Supabase models directly in API responses.

**Troubleshooting Steps**:

1. **Use DTOs for API Responses**:
   - Ensure you're using DTOs (Data Transfer Objects) to return data from controllers
   - Map Supabase models to DTOs before returning them from API endpoints
   - Example:
     ```csharp
     var beholdningDTOs = beholdning.Select(b => new BeholdningDTO
     {
         Id = b.Id,
         Navn = b.Navn,
         // Map other properties
     }).ToList();

     return Ok(beholdningDTOs);
     ```

2. **Configure JSON Serialization**:
   - Verify JSON serialization options are properly configured in Program.cs
   - Ensure ReferenceHandler.IgnoreCycles is set to handle circular references
   - Check that PropertyNamingPolicy is set correctly

3. **Check Model Inheritance**:
   - Ensure your DTOs don't inherit from Supabase's BaseModel
   - Remove any Supabase-specific attributes from DTOs

##### Database Connection Issues

**Issue**: "Error connecting to Supabase" or "Supabase client initialization failed"

**Troubleshooting Steps**:

1. **Verify Environment Variables**:
   - Check that SUPABASE_URL and SUPABASE_ANON_KEY are correctly set in the .env file
   - Ensure DotNetEnv.Env.Load() is called before accessing environment variables
   - Try printing the environment variables to the console for verification

2. **Check Supabase Status**:
   - Verify your Supabase project is active and accessible
   - Check the Supabase dashboard for any service disruptions
   - Ensure your IP address is not blocked by Supabase

3. **Network Connectivity**:
   - Verify your network can reach the Supabase servers
   - Check if a proxy is required for external connections

#### Frontend Issues

##### Data Not Displaying

**Issue**: The frontend loads but doesn't display any inventory data.

**Troubleshooting Steps**:

1. **Check Browser Console**:
   - Open browser developer tools (F12) and check the console for errors
   - Look for network request failures or JavaScript errors

2. **Verify API Responses**:
   - Use the Network tab in browser developer tools to inspect API requests
   - Verify that the API is returning the expected data
   - Check response status codes and headers

3. **Data Parsing**:
   - Ensure the frontend is correctly parsing the response data
   - Verify that the Beholdning interface matches the structure of the API response
   - Add console.log statements to debug data handling

4. **Component Rendering**:
   - Check if conditional rendering logic is working as expected
   - Verify that loading and error states are handled correctly
   - Ensure the component is receiving and using props correctly

##### TypeScript Errors

**Issue**: TypeScript compilation errors or type mismatches.

**Troubleshooting Steps**:

1. **Check Interface Definitions**:
   - Ensure the Beholdning interface matches the structure of the API response
   - Verify property names and types are correct
   - Use optional properties (?) for fields that might be null or undefined

2. **Update TypeScript Configuration**:
   - Check tsconfig.json for proper configuration
   - Ensure strict mode settings match your development needs
   - Update TypeScript version if needed

3. **Fix Type Assertions**:
   - Use proper type assertions or type guards
   - Avoid using `any` type when possible
   - Use the correct generic types for state hooks

##### Styling Issues

**Issue**: UI elements are not styled correctly or responsive design is not working.

**Troubleshooting Steps**:

1. **Inspect CSS**:
   - Use browser developer tools to inspect element styles
   - Check for CSS conflicts or overrides
   - Verify that CSS files are being imported correctly

2. **Check Responsive Design**:
   - Test the application at different screen sizes
   - Verify media queries are working as expected
   - Ensure flexbox or grid layouts are implemented correctly

### Debugging Tips

#### Backend Debugging

1. **Use Visual Studio Debugger**:
   - Set breakpoints at critical points in your code
   - Use the Watch window to monitor variable values
   - Step through code execution to identify issues

2. **Enable Detailed Exceptions**:
   - Configure the application to show detailed exceptions in development
   - Add try-catch blocks with detailed error logging
   - Use middleware to capture and log unhandled exceptions

3. **API Testing Tools**:
   - Use Swagger UI to test API endpoints directly
   - Try Postman for more advanced API testing scenarios
   - Compare responses with expected results

#### Frontend Debugging

1. **React Developer Tools**:
   - Install the React Developer Tools browser extension
   - Inspect component props, state, and hooks
   - Monitor component re-renders and performance

2. **Console Logging**:
   - Use strategic console.log statements to track data flow
   - Log component lifecycle events
   - Use console.table for displaying structured data

3. **Network Monitoring**:
   - Use the Network tab in browser developer tools
   - Monitor API requests and responses
   - Check for CORS issues or network errors

### Logging

Effective logging is crucial for troubleshooting issues, especially in production environments.

#### Backend Logging

1. **Configure Logging in Program.cs**:
   ```csharp
   builder.Logging.AddConsole();
   builder.Logging.AddDebug();
   builder.Logging.SetMinimumLevel(LogLevel.Information);
   ```

2. **Use ILogger in Controllers and Services**:
   ```csharp
   private readonly ILogger<BeholdningController> _logger;

   public BeholdningController(ILogger<BeholdningController> logger, Supabase.Client supabase)
   {
       _logger = logger;
       _supabase = supabase;
   }

   [HttpGet]
   public async Task<ActionResult<IEnumerable<BeholdningDTO>>> GetBeholdning()
   {
       try
       {
           _logger.LogInformation("Fetching inventory items");
           // Method implementation
       }
       catch (Exception ex)
       {
           _logger.LogError(ex, "Error fetching inventory items");
           return StatusCode(500, $"Internal server error: {ex.Message}");
       }
   }
   ```

3. **Log Important Events**:
   - Application startup and shutdown
   - API requests and responses
   - Database operations
   - Authentication and authorization events
   - Exceptions and errors

#### Frontend Logging

1. **Create a Logging Service**:
   ```typescript
   // logger.ts
   enum LogLevel {
       DEBUG,
       INFO,
       WARN,
       ERROR
   }

   class Logger {
       private component: string;

       constructor(component: string) {
           this.component = component;
       }

       debug(message: string, ...data: any[]): void {
           console.debug(`[${this.component}] ${message}`, ...data);
       }

       info(message: string, ...data: any[]): void {
           console.info(`[${this.component}] ${message}`, ...data);
       }

       warn(message: string, ...data: any[]): void {
           console.warn(`[${this.component}] ${message}`, ...data);
       }

       error(message: string, ...data: any[]): void {
           console.error(`[${this.component}] ${message}`, ...data);
       }
   }

   export const createLogger = (component: string): Logger => {
       return new Logger(component);
   };
   ```

2. **Use the Logger in Components**:
   ```typescript
   // Database.tsx
   import { createLogger } from '../utils/logger';

   function Database() {
       const logger = createLogger('Database');

       async function getBeholdning() {
           try {
               logger.info('Fetching inventory data');
               // Method implementation
           } catch (err) {
               logger.error('Error fetching inventory data', err);
               // Error handling
           }
       }

       // Component implementation
   }
   ```

3. **Production Logging**:
   - Consider using a service like Sentry or LogRocket for production logging
   - Configure log levels based on the environment
   - Ensure sensitive information is not logged

### Troubleshooting Checklist

When encountering issues, follow this general troubleshooting checklist:

1. **Identify the Problem Area**:
   - Is it a backend issue, frontend issue, or integration issue?
   - Is it happening consistently or intermittently?
   - What were the last changes made before the issue appeared?

2. **Check Logs and Error Messages**:
   - Review backend logs for exceptions or errors
   - Check browser console for JavaScript errors
   - Look for network request failures

3. **Verify Environment**:
   - Ensure all services are running (backend, database)
   - Check environment variables and configuration
   - Verify network connectivity between components

4. **Isolate the Issue**:
   - Test individual components separately
   - Create a minimal reproduction of the problem
   - Disable features one by one to identify the cause

5. **Apply Fixes**:
   - Make one change at a time
   - Test thoroughly after each change
   - Document the solution for future reference

6. **Prevent Recurrence**:
   - Add tests to catch similar issues
   - Improve error handling and validation
   - Update documentation with lessons learned

## Security Considerations

Security is a critical aspect of any application that handles inventory data. This section outlines the security measures implemented in the Lagerstyring application and provides recommendations for enhancing security.

### Authentication and Authorization

#### Current Implementation

The current version of Lagerstyring does not implement user authentication or authorization. This is suitable for development and testing purposes but should be enhanced before deploying to production.

#### Recommended Enhancements

1. **User Authentication**:
   - Implement user authentication using Supabase Auth
   - Support email/password authentication and social login providers
   - Implement secure password policies and account recovery

2. **Role-Based Access Control**:
   - Define user roles (e.g., Admin, Manager, Viewer)
   - Implement permission checks in API endpoints
   - Restrict UI elements based on user permissions

3. **JWT Token Handling**:
   - Implement secure token storage in the frontend
   - Add token refresh mechanisms
   - Include token validation in API middleware

### Data Protection

#### Current Implementation

The application currently uses environment variables to store Supabase credentials, which provides basic protection for sensitive configuration.

#### Recommended Enhancements

1. **Data Encryption**:
   - Implement encryption for sensitive data in the database
   - Use HTTPS for all communications
   - Consider field-level encryption for highly sensitive information

2. **Input Validation**:
   - Implement comprehensive input validation on both frontend and backend
   - Sanitize all user inputs to prevent injection attacks
   - Validate data types, ranges, and formats

3. **Output Encoding**:
   - Implement proper output encoding to prevent XSS attacks
   - Use React's built-in XSS protection
   - Sanitize data before rendering

### API Security

#### Current Implementation

The API currently uses CORS to restrict access to specific origins.

#### Recommended Enhancements

1. **Rate Limiting**:
   - Implement rate limiting to prevent abuse
   - Add retry mechanisms with exponential backoff
   - Monitor for unusual request patterns

2. **API Keys and Secrets**:
   - Implement API key authentication for external integrations
   - Rotate keys and secrets regularly
   - Use different keys for different environments

3. **Request Validation**:
   - Validate request parameters and payloads
   - Implement request size limits
   - Add request timeout handling

### Security Monitoring

#### Recommended Practices

1. **Logging and Auditing**:
   - Log security-relevant events (login attempts, permission changes, etc.)
   - Implement audit trails for sensitive operations
   - Regularly review logs for suspicious activities

2. **Vulnerability Scanning**:
   - Regularly scan dependencies for vulnerabilities
   - Use tools like OWASP ZAP for application scanning
   - Implement a responsible disclosure policy

3. **Incident Response**:
   - Develop an incident response plan
   - Define roles and responsibilities
   - Practice incident scenarios

### Security Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Supabase Security Documentation](https://supabase.com/docs/guides/platform/security)
- [ASP.NET Core Security Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)

## Performance Optimization

Performance optimization ensures that the Lagerstyring application remains responsive and efficient, even as the inventory data grows. This section outlines strategies for optimizing performance across different layers of the application.

### Backend Optimization

#### Database Queries

1. **Query Optimization**:
   - Use appropriate indexes on frequently queried columns
   - Limit the number of columns returned in queries
   - Implement pagination for large result sets

2. **Caching**:
   - Implement response caching for frequently accessed data
   - Use memory caching for reference data
   - Consider distributed caching for multi-instance deployments

3. **Asynchronous Processing**:
   - Use async/await patterns consistently
   - Implement background processing for time-consuming operations
   - Consider using message queues for workload distribution

#### API Performance

1. **Response Compression**:
   - Enable Gzip or Brotli compression for API responses
   - Implement response size optimization
   - Use streaming for large responses

2. **Connection Pooling**:
   - Configure appropriate connection pool settings
   - Monitor connection usage
   - Implement connection retry patterns

3. **Middleware Optimization**:
   - Minimize middleware overhead
   - Order middleware for optimal performance
   - Use conditional middleware execution

### Frontend Optimization

#### Rendering Performance

1. **Component Optimization**:
   - Implement React.memo for expensive components
   - Use useCallback and useMemo hooks to prevent unnecessary re-renders
   - Implement virtualization for long lists

2. **Code Splitting**:
   - Use dynamic imports for route-based code splitting
   - Implement lazy loading for components
   - Configure appropriate chunk sizes

3. **Asset Optimization**:
   - Optimize images and other assets
   - Implement lazy loading for images
   - Use appropriate image formats (WebP, AVIF)

#### Network Optimization

1. **Bundle Optimization**:
   - Minimize bundle sizes
   - Implement tree shaking
   - Use modern JavaScript features with appropriate polyfills

2. **Caching Strategies**:
   - Implement appropriate cache headers
   - Use service workers for offline support
   - Implement optimistic UI updates

3. **Request Optimization**:
   - Batch API requests where possible
   - Implement request cancellation for superseded requests
   - Use appropriate fetch policies

### Monitoring and Profiling

1. **Performance Monitoring**:
   - Implement real user monitoring (RUM)
   - Track key performance metrics (TTFB, FCP, LCP, etc.)
   - Set up alerts for performance degradation

2. **Profiling Tools**:
   - Use Chrome DevTools Performance tab for frontend profiling
   - Implement .NET profiling tools for backend analysis
   - Regular performance testing in CI/CD pipeline

3. **Performance Testing**:
   - Implement load testing for API endpoints
   - Conduct stress testing for peak loads
   - Benchmark critical operations

### Performance Resources

- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [ASP.NET Core Performance Best Practices](https://docs.microsoft.com/en-us/aspnet/core/performance/performance-best-practices)
- [Web Vitals](https://web.dev/vitals/)
- [Supabase Performance Optimization](https://supabase.com/docs/guides/platform/performance)

## Testing

Comprehensive testing ensures the reliability and stability of the Lagerstyring application. This section outlines testing strategies and practices for different levels of testing.

### Unit Testing

Unit tests verify that individual components or functions work as expected in isolation.

#### Backend Unit Testing

1. **Test Framework**:
   - Use xUnit for .NET Core unit testing
   - Implement FluentAssertions for readable assertions
   - Use Moq for mocking dependencies

2. **Test Coverage**:
   - Aim for high test coverage of business logic
   - Test edge cases and error conditions
   - Implement parameterized tests for multiple scenarios

3. **Example Unit Test**:
   ```csharp
   public class BeholdningControllerTests
   {
       [Fact]
       public async Task GetBeholdning_ReturnsOkResult_WithBeholdningDTOs()
       {
           // Arrange
           var mockSupabase = new Mock<Supabase.Client>();
           var controller = new BeholdningController(mockSupabase.Object);

           // Act
           var result = await controller.GetBeholdning();

           // Assert
           var okResult = Assert.IsType<OkObjectResult>(result.Result);
           var items = Assert.IsAssignableFrom<IEnumerable<BeholdningDTO>>(okResult.Value);
           Assert.NotEmpty(items);
       }
   }
   ```

#### Frontend Unit Testing

1. **Test Framework**:
   - Use Jest for JavaScript/TypeScript unit testing
   - Implement React Testing Library for component testing
   - Use MSW for mocking API requests

2. **Component Testing**:
   - Test component rendering
   - Verify state updates and effects
   - Test user interactions

3. **Example Component Test**:
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import Database from './Database';

   test('renders loading state initially', () => {
     render(<Database />);
     expect(screen.getByText('Indlæser...')).toBeInTheDocument();
   });

   test('displays error message when API fails', async () => {
     // Mock failed API call
     jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

     render(<Database />);

     // Wait for error message
     const errorMessage = await screen.findByText(/Der opstod en fejl/i);
     expect(errorMessage).toBeInTheDocument();
   });
   ```

### Integration Testing

Integration tests verify that different components work together correctly.

#### API Integration Tests

1. **Test Approach**:
   - Test API endpoints with actual HTTP requests
   - Verify response status codes and content
   - Test error handling and edge cases

2. **Test Environment**:
   - Use a test database with known test data
   - Reset database state between tests
   - Mock external dependencies

3. **Example Integration Test**:
   ```csharp
   public class BeholdningApiTests : IClassFixture<WebApplicationFactory<Program>>
   {
       private readonly WebApplicationFactory<Program> _factory;

       public BeholdningApiTests(WebApplicationFactory<Program> factory)
       {
           _factory = factory;
       }

       [Fact]
       public async Task GetBeholdning_ReturnsSuccessAndCorrectContentType()
       {
           // Arrange
           var client = _factory.CreateClient();

           // Act
           var response = await client.GetAsync("/api/beholdning");

           // Assert
           response.EnsureSuccessStatusCode();
           Assert.Equal("application/json; charset=utf-8", 
               response.Content.Headers.ContentType.ToString());
       }
   }
   ```

### End-to-End Testing

End-to-end tests verify that the entire application works correctly from the user's perspective.

#### E2E Testing Approach

1. **Test Framework**:
   - Use Cypress or Playwright for end-to-end testing
   - Implement visual regression testing
   - Test critical user flows

2. **Test Scenarios**:
   - Verify that inventory items are displayed correctly
   - Test sorting and filtering functionality
   - Verify error handling and feedback

3. **Example E2E Test**:
   ```javascript
   describe('Inventory Table', () => {
     beforeEach(() => {
       cy.visit('/');
     });

     it('displays inventory items', () => {
       cy.get('table.beholdning-tabel').should('be.visible');
       cy.get('table.beholdning-tabel tbody tr').should('have.length.greaterThan', 0);
     });

     it('sorts items when column header is clicked', () => {
       // Get initial order
       cy.get('table.beholdning-tabel tbody tr td:nth-child(2)').first().invoke('text').as('initialName');

       // Click on Name column header
       cy.get('table.beholdning-tabel thead tr th:nth-child(2)').click();

       // Verify order has changed
       cy.get('table.beholdning-tabel tbody tr td:nth-child(2)').first().invoke('text').then((sortedName) => {
         cy.get('@initialName').then((initialName) => {
           expect(sortedName).not.to.eq(initialName);
         });
       });
     });
   });
   ```

### Test Automation

1. **CI/CD Integration**:
   - Run unit tests on every pull request
   - Run integration tests on merge to main branch
   - Schedule regular E2E tests

2. **Test Reporting**:
   - Generate test coverage reports
   - Implement test result visualization
   - Track test metrics over time

3. **Test Data Management**:
   - Implement test data generators
   - Use database seeding for consistent test data
   - Implement data cleanup after tests

### Testing Resources

- [xUnit Documentation](https://xunit.net/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [ASP.NET Core Testing](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests)

## Future Development

This section outlines the roadmap for future development of the Lagerstyring application, including planned features and architectural improvements.

### Planned Features

#### Inventory Management

1. **CRUD Operations**:
   - Create new inventory items
   - Update existing items
   - Delete items with confirmation
   - Bulk operations for multiple items

2. **Advanced Filtering and Search**:
   - Full-text search across all fields
   - Advanced filtering with multiple criteria
   - Saved filters and searches
   - Export filtered results to CSV/Excel

3. **Inventory Categories**:
   - Hierarchical category management
   - Category-specific attributes
   - Category-based reporting
   - Visual category navigation

#### User Management

1. **Authentication and Authorization**:
   - User registration and login
   - Role-based access control
   - User profile management
   - Password reset and account recovery

2. **User Preferences**:
   - Customizable dashboard
   - Saved views and reports
   - Notification preferences
   - Theme selection (light/dark mode)

#### Reporting and Analytics

1. **Inventory Reports**:
   - Inventory valuation reports
   - Stock level reports
   - Category distribution reports
   - Trend analysis

2. **Data Visualization**:
   - Interactive charts and graphs
   - Real-time inventory dashboards
   - Custom report builder
   - Scheduled report generation

### Architectural Improvements

#### Backend Enhancements

1. **Service Layer**:
   - Implement a service layer for business logic
   - Separate data access from business rules
   - Implement domain-driven design principles
   - Add comprehensive validation

2. **API Enhancements**:
   - Implement GraphQL for flexible data querying
   - Add API versioning
   - Implement API documentation with OpenAPI
   - Add real-time updates with SignalR

3. **Data Access Improvements**:
   - Implement repository pattern
   - Add unit of work pattern
   - Implement database migrations
   - Add data auditing

#### Frontend Enhancements

1. **State Management**:
   - Implement Redux or Context API for global state
   - Add client-side caching
   - Implement optimistic UI updates
   - Add offline support with service workers

2. **UI/UX Improvements**:
   - Implement a design system
   - Add animations and transitions
   - Improve accessibility
   - Implement responsive design for mobile devices

3. **Performance Optimizations**:
   - Implement code splitting
   - Add server-side rendering
   - Optimize bundle size
   - Implement progressive web app features

### Integration Opportunities

1. **External Systems**:
   - ERP system integration
   - Accounting software integration
   - E-commerce platform integration
   - Warehouse management system integration

2. **IoT Integration**:
   - Barcode scanner integration
   - RFID reader integration
   - Automated inventory tracking
   - Sensor data integration

3. **Mobile Applications**:
   - Native mobile apps for iOS and Android
   - Barcode scanning with mobile camera
   - Offline inventory management
   - Push notifications for inventory alerts

### Development Timeline

| Phase | Timeframe | Focus Areas |
|-------|-----------|-------------|
| 1 | Q1 2024 | CRUD operations, basic filtering, UI improvements |
| 2 | Q2 2024 | User authentication, role-based access control |
| 3 | Q3 2024 | Advanced reporting, data visualization |
| 4 | Q4 2024 | External system integrations, mobile support |

## Contributing

This section provides guidelines for contributing to the Lagerstyring project, ensuring consistent code quality and a smooth collaboration process.

### Code Style Guidelines

#### Backend (C#)

1. **Naming Conventions**:
   - Use PascalCase for class names, method names, properties, and public fields
   - Use camelCase for local variables, parameters, and private fields
   - Prefix private fields with underscore (e.g., `_supabase`)
   - Use descriptive names that convey intent

2. **Code Organization**:
   - Organize code into logical namespaces
   - Keep classes focused on a single responsibility
   - Limit method length to improve readability
   - Use regions sparingly and only for logical grouping

3. **Documentation**:
   - Add XML comments for all public APIs
   - Include parameter descriptions and return value documentation
   - Document exceptions that may be thrown
   - Provide usage examples for complex methods

4. **Example C# Style**:
   ```csharp
   /// <summary>
   /// Retrieves inventory items from the database.
   /// </summary>
   /// <returns>A collection of inventory items.</returns>
   /// <exception cref="Exception">Thrown when database access fails.</exception>
   public async Task<ActionResult<IEnumerable<BeholdningDTO>>> GetBeholdning()
   {
       try
       {
           var result = await _supabase.From<Beholdning>().Get();
           var beholdning = result.Models;

           // Map to DTOs
           var beholdningDTOs = beholdning.Select(MapToDTO).ToList();

           return Ok(beholdningDTOs);
       }
       catch (Exception ex)
       {
           _logger.LogError(ex, "Failed to retrieve inventory items");
           return StatusCode(500, $"Internal server error: {ex.Message}");
       }
   }

   private BeholdningDTO MapToDTO(Beholdning model)
   {
       return new BeholdningDTO
       {
           Id = model.Id,
           Navn = model.Navn,
           // Map other properties
       };
   }
   ```

#### Frontend (TypeScript/React)

1. **Naming Conventions**:
   - Use PascalCase for component names, interfaces, and types
   - Use camelCase for variables, functions, and properties
   - Use ALL_CAPS for constants
   - Use descriptive names that convey intent

2. **Code Organization**:
   - Organize components by feature or route
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use named exports for better import statements

3. **Formatting and Style**:
   - Use 2-space indentation
   - Use semicolons consistently
   - Use single quotes for strings
   - Place each import on its own line

4. **Example React/TypeScript Style**:
   ```typescript
   import { useState, useEffect } from 'react';
   import { Button } from '../components/Button';
   import { createLogger } from '../utils/logger';
   import '../styles/Database.css';

   interface Beholdning {
     Id: number;
     Navn: string;
     Beskrivelse: string;
     // Other properties
   }

   const logger = createLogger('Database');
   const API_URL = 'http://localhost:5212/api/beholdning';

   function Database(): JSX.Element {
     const [beholdning, setBeholdning] = useState<Beholdning[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       fetchBeholdning();
     }, []);

     const fetchBeholdning = async (): Promise<void> => {
       try {
         setLoading(true);
         logger.info('Fetching inventory data');

         const response = await fetch(API_URL);

         if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
         }

         const data = await response.json();
         setBeholdning(data || []);
       } catch (err) {
         logger.error('Error fetching inventory data', err);
         setError(`Der opstod en fejl: ${err instanceof Error ? err.message : String(err)}`);
       } finally {
         setLoading(false);
       }
     };

     // Component rendering
     if (loading) return <div>Indlæser...</div>;
     if (error) return <div>Fejl: {error}</div>;

     return (
       <div className="container">
         {/* Component UI */}
       </div>
     );
   }

   export default Database;
   ```

### Pull Request Process

1. **Branching Strategy**:
   - Create a feature branch from `develop` branch
   - Use a descriptive branch name (e.g., `feature/add-inventory-filtering`)
   - Keep branches focused on a single feature or bugfix
   - Regularly sync with the base branch to minimize merge conflicts

2. **Commit Guidelines**:
   - Write clear, concise commit messages
   - Use present tense ("Add feature" not "Added feature")
   - Reference issue numbers in commit messages
   - Keep commits logical and atomic

3. **Pull Request Submission**:
   - Create a pull request with a descriptive title
   - Provide a detailed description of the changes
   - Include screenshots or GIFs for UI changes
   - Link to related issues or documentation

4. **Code Review Process**:
   - At least one approval is required before merging
   - Address all review comments
   - Ensure all automated checks pass
   - Squash commits if necessary for a clean history

5. **Merge Requirements**:
   - All discussions must be resolved
   - CI/CD pipeline must pass
   - Documentation must be updated
   - Tests must be included for new features

### Development Environment Setup

1. **IDE Configuration**:
   - **Visual Studio Code**:
     - Install recommended extensions:
       - ESLint
       - Prettier
       - C# Dev Kit
       - TypeScript and JavaScript Language Features
       - React Developer Tools
     - Use workspace settings for consistent formatting
     - Configure debugging for both frontend and backend

   - **Visual Studio**:
     - Install recommended extensions:
       - ReSharper or CodeMaid for code cleanup
       - Web Essentials
     - Configure code style settings
     - Set up debugging profiles

2. **Git Configuration**:
   - Configure Git user name and email
   - Set up Git hooks for pre-commit linting
   - Configure .gitignore for project-specific files
   - Set up Git LFS for large files if needed

3. **Local Development Setup**:
   - Install required SDKs and tools
   - Set up environment variables
   - Configure local database
   - Set up HTTPS certificates for local development

### Contribution Guidelines

1. **Types of Contributions**:
   - Bug fixes
   - Feature implementations
   - Documentation improvements
   - Performance optimizations
   - Test coverage improvements

2. **Getting Started**:
   - Fork the repository
   - Set up the development environment
   - Pick an issue to work on
   - Discuss approach in the issue comments

3. **Communication**:
   - Use issue comments for discussion
   - Ask questions if requirements are unclear
   - Provide regular updates on progress
   - Be respectful and constructive in feedback

## Environment Variables

Environment variables are used to configure the application for different environments without changing the code. This section documents all environment variables used in the Lagerstyring application.

### Root-Level Environment Variables

The Lagerstyring application now uses a single `.env` file in the root directory that is shared by all components (backend, frontend, and realtime-bridge). This simplifies configuration and ensures consistency across all components.

#### Setting Up the Root .env File

Create a `.env` file in the root directory of the project with the following variables:

#### Required Variables

| Variable | Description | Used By | Example |
|----------|-------------|---------|---------|
| `SUPABASE_URL` | The URL of your Supabase project | Backend, Realtime Bridge | `https://example.supabase.co` |
| `SUPABASE_ANON_KEY` | The anonymous key for Supabase authentication | Backend, Realtime Bridge | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `BACKEND_ENDPOINT` | The endpoint for the realtime bridge to send updates to | Realtime Bridge | `http://localhost:5212/api/realtime/beholdning` |

#### Optional Variables

| Variable | Description | Used By | Default | Example |
|----------|-------------|---------|---------|---------|
| `ASPNETCORE_ENVIRONMENT` | The environment the application is running in | Backend | `Development` | `Production` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins for CORS | Backend | `http://localhost:5173` | `https://app.example.com,https://admin.example.com` |
| `LOG_LEVEL` | The minimum log level to record | Backend | `Information` | `Debug`, `Warning`, `Error` |
| `VITE_BACKEND_URL` | The URL of the backend API | Frontend | `http://localhost:5212` | `https://api.example.com` |
| `VITE_API_TIMEOUT` | Timeout for API requests in milliseconds | Frontend | `30000` | `60000` |
| `VITE_LOG_LEVEL` | The minimum log level to record | Frontend | `info` | `debug`, `warn`, `error` |
| `VITE_ENABLE_MOCK_API` | Whether to use mock API responses | Frontend | `false` | `true` |

#### Example .env File

```
# Required variables
SUPABASE_URL=https://wilitrpckvtndqvxayxn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BACKEND_ENDPOINT=http://localhost:5212/api/realtime/beholdning

# Optional backend variables
ASPNETCORE_ENVIRONMENT=Development
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=Information

# Optional frontend variables
VITE_BACKEND_URL=http://localhost:5212
VITE_API_TIMEOUT=30000
VITE_LOG_LEVEL=info
VITE_ENABLE_MOCK_API=false
```

> **Note**: Frontend variables must be prefixed with `VITE_` to be accessible in the frontend code.

### Environment-Specific Configuration

For different environments, create environment-specific .env files:

- `.env.development` - Development environment
- `.env.test` - Testing environment
- `.env.production` - Production environment

#### Production Configuration Best Practices

1. **Security**:
   - Use different API keys for different environments
   - Rotate keys regularly
   - Use more restrictive permissions for production keys

2. **Configuration Management**:
   - Store production environment variables in a secure vault
   - Use environment variable injection in CI/CD pipelines
   - Document the required variables in deployment documentation

3. **Validation**:
   - Validate required environment variables on application startup
   - Provide clear error messages for missing or invalid variables
   - Implement fallbacks for non-critical variables
