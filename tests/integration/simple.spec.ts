import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Simple integration test', () => {
  it('should be able to read files', () => {
    // Create a temporary file
    const tempDir = path.join(__dirname, '..', 'fixtures');
    const tempFile = path.join(tempDir, 'temp-test.txt');

    // Write to the file
    fs.writeFileSync(tempFile, 'Hello, world!');

    // Read from the file
    const content = fs.readFileSync(tempFile, 'utf8');

    // Verify the content
    expect(content).toBe('Hello, world!');

    // Clean up
    fs.unlinkSync(tempFile);
  });
});
