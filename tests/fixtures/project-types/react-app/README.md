# React App Project Type

This fixture represents a React application project type for testing.

## Description

A React application with TypeScript and Webpack configuration. This project type extends the web project type and adds React-specific configuration.

## Configuration

The project type includes:

- Build configuration using Webpack
- Development server with HMR
- TypeScript support
- ESLint configuration
- Jest testing setup

## Inheritance

This project type extends the web project type, which in turn extends the base project type:

```
base → web → react-app
```

## Usage in Tests

This fixture is used to test:

1. Project type inheritance
2. Application of React-specific configuration
3. Template file copying
4. Project type syncing 
