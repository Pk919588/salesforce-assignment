import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Salesforce login screen', () => {
  render(<App />);
  expect(
    screen.getByText(/salesforce validation rules manager/i)
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login with salesforce/i })).toBeInTheDocument();
});
