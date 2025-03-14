// This file contains setup code that will be run before all tests

// Set up global variables or mocks here
import { vi } from 'vitest';

// Mock console methods to avoid cluttering test output
// Comment these out if you want to see console output during tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'info').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
// Keep error logging enabled for debugging
// vi.spyOn(console, 'error').mockImplementation(() => {});

// Set up environment variables for testing
process.env.NODE_ENV = 'test';

// Add any other global setup here
