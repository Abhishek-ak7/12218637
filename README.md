# URL Shortener Application

A React-based URL shortener with analytics and client-side routing.

## Features

- Shorten up to 5 URLs simultaneously
- Custom short codes and validity periods
- Client-side URL redirection
- Click analytics and statistics
- Local storage persistence
- Material UI responsive design

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will run on http://localhost:3000

## Architecture

### Components
- **UrlShortener**: Main shortening interface
- **Statistics**: Analytics dashboard
- **RedirectHandler**: Handles short URL redirects
- **Navigation**: App navigation bar

### Data Storage
- Uses localStorage for client-side persistence
- Stores URL data, click counts, and analytics

### Routing
- `/` - URL shortener page
- `/statistics` - Analytics page
- `/:shortCode` - Redirect handler

## Technology Stack

- React 18
- Material UI
- React Router
- Local Storage API
