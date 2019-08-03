/**
 * Test loadable
 */

import { Suspense } from 'react';
import loadable from '../loadable';

describe('loadable', () => {
  const importFunc = () => {};

  it('should return a function', () => {
    expect(loadable(importFunc)).toBeInstanceOf(Function);
  });

  it('should return a suspense component', () => {
    const loadableComponent = loadable(importFunc)();
    expect(loadableComponent.type).toBe(Suspense);
  });
});
