import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Meditate and Read navigation links', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /meditate/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /read/i })).toBeInTheDocument();
});
