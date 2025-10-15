# Files Storage Application

A monorepo containing a file storage application with both API (NestJS) and UI (React) components.

## Project Structure

```
files-storage/
├── api/          # NestJS backend API
├── ui/           # React frontend application
└── package.json  # Root package.json with monorepo scripts
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)
- AWS S3 bucket and credentials

## Database Setup

### 1. Install PostgreSQL

Make sure PostgreSQL is installed and running on your system.

### 2. Create Database

Create a new PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE files_storage;

# Exit psql
\q
```

**Note:** Set `DB_SYNCHRONIZE=true` for development to automatically sync database schema. For production, use migrations and set it to `false`.

**Note:** Set `DB_LOGGING=true` to enable SQL query logging in the console

## Installation

### Install All Dependencies

To install dependencies for both API and UI projects:

```bash
npm run install:all
```

### Install Dependencies Separately

Install API dependencies only:
```bash
npm run api:install
```

Install UI dependencies only:
```bash
npm run ui:install
```

## Running the Application

### Development Mode

Run both API and UI in development mode simultaneously:
```bash
npm run dev
```

Run API in development mode only:
```bash
npm run api:dev
```

Run UI in development mode only:
```bash
npm run ui:dev
```

### Production Mode

Start both API and UI in production mode:
```bash
npm run start:all
```

Start API in production mode only:
```bash
npm run api:start
```

Start UI in production mode only:
```bash
npm run ui:start
```

## Building the Application

Build both API and UI:
```bash
npm run build:all
```

Build API only:
```bash
npm run api:build
```

Build UI only:
```bash
npm run ui:build
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for both API and UI |
| `npm run api:install` | Install API dependencies |
| `npm run ui:install` | Install UI dependencies |
| `npm run dev` | Run both API and UI in development mode |
| `npm run api:dev` | Run API in development mode |
| `npm run ui:dev` | Run UI in development mode |
| `npm run start:all` | Start both API and UI in production mode |
| `npm run api:start` | Start API in production mode |
| `npm run ui:start` | Start UI in production mode |
| `npm run build:all` | Build both API and UI |
| `npm run api:build` | Build API |
| `npm run ui:build` | Build UI |

UNLICENSED

