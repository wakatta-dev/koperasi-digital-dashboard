# Development Guide

This guide outlines how to set up and contribute to the Koperasi Digital backend. For a high-level project description, see the [README](../README.md) and [architecture overview](overview/README.md).

## Prerequisites

- [Go](https://go.dev/) **1.24** or newer
- [PostgreSQL](https://www.postgresql.org/)
- [Make](https://www.gnu.org/software/make/) (to use the provided `Makefile` tasks)

## Installation & Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd koperasi-digital-backend-2
   ```
2. **Install dependencies**
   ```bash
   go mod download
   ```
3. **Create your `.env` file**
   ```bash
   cp .env.example .env
   # edit values as needed
   ```
4. **Prepare the database**
   Ensure PostgreSQL is running and the `DATABASE_URL` in `.env` points to a reachable database.

## Database Migrations

The `Makefile` wraps the migration utility located in `cmd/migrate`.

```bash
make migrate-up      # apply all migrations
make migrate-down    # rollback all migrations
make migrate-steps n=-1  # step migrations (e.g. n=-1)
make migrate-force v=3   # force version (e.g. v=3)
```

## Seed Data

Populate the database with initial data:

```bash
make seed
```

## Running the Application

```bash
make run   # starts the HTTP server on :8080
```

## Testing & Code Quality

```bash
go test ./...
go fmt ./...
go vet ./...
```

## Branching & Commit Conventions

- Create feature branches from `work` (or the main development branch).
- Use descriptive branch prefixes such as `feature/`, `fix/`, or `docs/`.
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:
  - `feat: add payment endpoint`
  - `fix: handle nil invoice`
  - `docs: update development guide`

## Further Reading

- [Project README](../README.md)
- [Architecture Overview](overview/README.md)

