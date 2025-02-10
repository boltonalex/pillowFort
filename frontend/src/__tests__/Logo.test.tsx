import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Logo from '../components/Logo';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

test('Logo component should render without crashing', () => {
  render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );

  expect(screen.getByRole('img')).toBeTruthy();
});