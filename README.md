# Next.js + Tauri Project

## Overview
This project is a cross-platform desktop application built using **Next.js** for the frontend and **Tauri** for the backend, allowing seamless integration between web technologies and native system functionalities.

## Tech Stack
- **Next.js** – Frontend framework for React applications
- **Tauri** – Lightweight framework for building desktop applications
- **TypeScript** – Ensuring type safety and maintainability
- **Bun** – Fast package manager and runtime for JavaScript/TypeScript
- **Tailwind CSS** – Utility-first CSS framework for styling
- **ShadCN** – UI components library for consistent design
- **MariaDB/MySQL** – Database for storing application data
- **React Hook Form** – Handling form validation and submission
- **Tenstack Table** – Advanced table management

## Features
- **Database Management**: Handles banking transactions and financial records.
- **Barcode Generation**: Uses `react-barcode` for printing barcodes.
- **Dynamic UI**: Fully responsive and optimized for desktop use.
- **Optimized Performance**: Leveraging Bun for faster dependency management and runtime execution.
- **Backup System**: Automatic database backups using MariaDB’s `mysqldump`.
- **Secure Authentication**: Utilizing Clerk for managing user authentication.
- **Custom Filtering**: Advanced data filtering using Tenstack Table.

## Challenges & Solutions
### 1. **Handling `document is not defined` in Tauri**
   - **Issue**: Next.js renders pages on the server, but Tauri runs in a native WebView.
   - **Solution**: Used dynamic imports and checked `typeof window !== 'undefined'` before accessing DOM-related APIs.

### 2. **Fixing Database Connection Issues in Tauri**
   - **Issue**: Using MariaDB inside a Tauri project caused connection failures.
   - **Solution**: Used `tauri-plugin-sql-api` to interface with the database securely.

### 3. **Improving Performance with Bun**
   - **Issue**: Slow package installs and builds with `npm`.
   - **Solution**: Switched to `Bun`, significantly improving install speed and execution.

### 4. **Managing Transactions & Balances Correctly**
   - **Issue**: Incorrect balance calculations when fetching bank transactions.
   - **Solution**: Applied aggregation logic to sum deposits and withdrawals separately, ensuring accurate calculations.

### 5. **Backup & Restore System**
   - **Issue**: Needed a way to back up and restore database states.
   - **Solution**: Used `mysqldump` to create timestamped backup files.

## Installation & Setup
### Prerequisites
- Install **Bun**: `curl -fsSL https://bun.sh/install | bash`
- Install **Tauri CLI**: `cargo install tauri-cli`
- Install **MariaDB/MySQL**

### Setup Instructions
```sh
# Clone the repository
git clone <repo-url>
cd <project-folder>

# Install dependencies
bun install

# Start the development server
bun dev

# Build the Tauri application
bun tauri build
```

## Future Improvements
- Implement employee management in financial transactions.
- Add a logging system for tracking user actions.
- Improve UI/UX for better user experience.

## Author
**Yousef Romany** – [LinkedIn](https://www.linkedin.com/in/yousef-romany-09a2a5233)