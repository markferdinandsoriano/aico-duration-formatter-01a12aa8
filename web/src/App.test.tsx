import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('web', () => {
  it('renders the heading', () => {
    expect(renderToString(<App />)).toContain('<h1>Project</h1>');
  });
});
