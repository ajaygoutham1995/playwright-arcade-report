import { describe, expect, it } from 'vitest';
import ArcadeReporter from '../src/index';

describe('reporter export', () => {
  it('exports a single default class', () => {
    expect(ArcadeReporter).toBeDefined();
    expect(typeof ArcadeReporter).toBe('function');
  });
});
