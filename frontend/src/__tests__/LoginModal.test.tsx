import { expect, test, vi, describe, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../context/useAuth';

// ✅ Mock `useAuth`
vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('LoginModal Component', () => {
  // @ts-expect-error - Ignoring TypeScript error on this line
  let mockLogin: vi.Mock;
  // @ts-expect-error - Ignoring TypeScript error on this line
  let mockSignup: vi.Mock;
  // @ts-expect-error - Ignoring TypeScript error on this line
  let mockLoginWithGoogle: vi.Mock;
  // @ts-expect-error - Ignoring TypeScript error on this line
  let mockSetIsLoginOpen: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    // ✅ Create mock functions for auth actions
    mockLogin = vi.fn();
    mockSignup = vi.fn();
    mockLoginWithGoogle = vi.fn();
    mockSetIsLoginOpen = vi.fn();

    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      loginWithGoogle: mockLoginWithGoogle,
      setIsLoginOpen: mockSetIsLoginOpen,
      isLoginOpen: true, // ✅ Ensure modal is open for the test
      loginErrorMessage: '',
    });
  });

  // ✅ Test 1: Modal renders when `isLoginOpen` is true
  test('renders LoginModal when isLoginOpen is true', () => {
    render(<LoginModal />);

    expect(screen.getByText(/Login to PillowFort/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Password/i)).toBeTruthy();
  });

  // ✅ Test 2: Can switch between Login and Sign Up
  test('toggles between Login and Sign Up', async () => {
    render(<LoginModal />);

    // Click on "New user? Sign Up"
    fireEvent.click(screen.getByText(/New user\? Sign Up/i));

    expect(screen.getByText(/Sign Up to PillowFort/i)).toBeTruthy();

    // Click on "Already have an account? Login"
    fireEvent.click(screen.getByText(/Already have an account\? Login/i));

    expect(screen.getByText(/Login to PillowFort/i)).toBeTruthy();
  });

  // ✅ Test 3: User can toggle password visibility
  test('toggles password visibility', async () => {
    render(<LoginModal />);

    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const toggleButton = screen.getByRole('button', { name: /👁️|🙈/i });

    // @ts-expect-error - Ignoring TypeScript error on this line
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    // @ts-expect-error - Ignoring TypeScript error on this line
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    // @ts-expect-error - Ignoring TypeScript error on this line
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // ✅ Test 4: User can log in successfully
  test('calls login function on form submit', async () => {
    render(<LoginModal />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  // ✅ Test 5: User can sign up successfully
  test('calls signup function when in Sign Up mode', async () => {
    render(<LoginModal />);

    fireEvent.click(screen.getByText(/New user\? Sign Up/i)); // Switch to Sign Up

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledTimes(1);
      expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  // ✅ Test 6: Displays login error message
  test('displays login error message when login fails', async () => {
    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      loginWithGoogle: mockLoginWithGoogle,
      setIsLoginOpen: mockSetIsLoginOpen,
      isLoginOpen: true,
      loginErrorMessage: 'Invalid credentials', // ✅ Simulate login error
    });

    render(<LoginModal />);

    expect(screen.getByText(/Invalid credentials/i)).toBeTruthy();
  });

  // ✅ Test 7: Clicking "Sign in with Google" calls loginWithGoogle
  test('calls loginWithGoogle when Google button is clicked', async () => {
    render(<LoginModal />);

    fireEvent.click(screen.getByText(/Sign in with Google/i));

    expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1);
  });

  // ✅ Test 8: Clicking "Cancel" closes the modal
  test('closes modal when cancel button is clicked', async () => {
    render(<LoginModal />);

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(mockSetIsLoginOpen).toHaveBeenCalledWith(false);
  });
});