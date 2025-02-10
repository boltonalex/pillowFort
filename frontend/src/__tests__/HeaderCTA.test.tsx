import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HeaderCTA from '../components/HeaderCTA';
import { AuthProvider } from '../context/AuthProvider';
import { useAuth } from '../context/useAuth';

// ✅ Mock `useLocation` globally
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useLocation: vi.fn(() => ({ pathname: '/somepage' })), // Default mock
  };
});

// ✅ Mock `useAuth`
vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

test('renders HeaderCTA with Get Started when user is not logged in', () => {
  // @ts-expect-error - Ignoring TypeScript error on this line
  vi.mocked(useAuth).mockReturnValue({ user: null });

  render(
    <MemoryRouter>
      <AuthProvider>
        <HeaderCTA />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: /Get Started/i })).toBeTruthy();
});

test('renders HeaderCTA with View Funds when user is logged in', () => {
  // @ts-expect-error - Ignoring TypeScript error on this line
  vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' } });

  render(
    <MemoryRouter>
      <AuthProvider>
        <HeaderCTA />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: /view funds/i })).toBeTruthy();
});

test('renders AuthButtons component', () => {
  // @ts-expect-error - Ignoring TypeScript error on this line
  vi.mocked(useAuth).mockReturnValue({ user: null });

  render(
    <MemoryRouter>
      <AuthProvider>
        <HeaderCTA />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByText(/login/i)).toBeTruthy(); // ✅ Use "Login" instead of "Sign in"
});

test('does not render CushonButton when on "fundlist" page', () => {
  global.window = Object.create(window);
  const url = new URL("http://localhost:0000/fundlist");
  Object.defineProperty(window, 'location', {
    value: {
      href: url.href,
      hostname: url.hostname
    }
  });
  render(
    <MemoryRouter>
      <AuthProvider>
        <HeaderCTA />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.queryByRole('button', { name: /view funds/i })).toBeNull();
});

