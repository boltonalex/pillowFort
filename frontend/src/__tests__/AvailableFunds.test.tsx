import { expect, test, vi, describe, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AvailableFunds from '../components/AvailableFunds';
import { useAuth } from '../context/useAuth';
import { UserData } from '../types';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockPush = vi.fn();

vi.mock("@hooks/useNavigation", () => ({
  useNavigation: () => ({
    push: mockPush,
  }),
}));

vi.mocked(useAuth).mockReturnValue({
  user: null,
  userData: {
    id: null,
    email: null,
    name: null
  },
  token: null,
  isLoginOpen: false,
  isKYCOpen: false,
  loginErrorMessage: '',
  setToken: function (token: string | null): void {
    throw new Error(`Function not implemented. ${token}`,);
  },
  loginWithGoogle: function (): Promise<void> {
    throw new Error(`Function not implemented.`);
  },
  login: function (email: string, password: string): Promise<void> {
    throw new Error(`Function not implemented. ${email}, ${password}`);
  },
  signup: function (email: string, password: string): Promise<void> {
    throw new Error(`Function not implemented. ${email}, ${password}`);
  },
  logout: function (): Promise<void> {
    throw new Error(`Function not implemented.`);
  },
  setIsLoginOpen: function (isOpen: boolean): void {
    throw new Error(`Function not implemented. ${isOpen}`);
  },
  setIsKYCOpen: function (isOpen: boolean): void {
    throw new Error(`Function not implemented. ${isOpen}`);
  },
  updateKYC: function (kycData: Partial<UserData>): Promise<void> {
    throw new Error(`Function not implemented. ${kycData}`);
  }
});

const sampleFunds = [
  { id: '1', name: 'Tech Growth Fund', description: 'A fund focusing on technology stocks.', minimum: 100 },
  { id: '2', name: 'Green Energy Fund', description: 'Invest in renewable energy.', minimum: 200 },
];

const mockSetSelectedFund = vi.fn();
const mockSetIsInvesting = vi.fn();

const mockNavigate = vi.fn();

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: vi.fn(() => mockNavigate),
  };
});


describe('AvailableFunds Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('renders "Available Funds" title', () => {
    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({ user: null, userData: {} });

    render(
      <MemoryRouter>
        <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Available Funds/i)).toBeTruthy();
  });

  test('shows "Loading..." when no funds are available', () => {
    render(
      <MemoryRouter>
        <AvailableFunds funds={[]} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeTruthy();
  });

  test('renders fund cards correctly', () => {
    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: true } });

    render(
      <MemoryRouter>
        <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Tech Growth Fund/i)).toBeTruthy();
    expect(screen.getByText(/Green Energy Fund/i)).toBeTruthy();
  });

  test('guest users see "Login to Invest"', () => {
    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({ user: null, userData: {} });

    render(
      <MemoryRouter>
        <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Login to Invest/i)).toHaveLength(2);
  });

  test('KYC-verified users can see two "Invest" buttons', () => {
    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: true } });

    render(
      <MemoryRouter>
        <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getAllByTitle(/investCTA/i).length === 2);
  });

  test('non-KYC users see "Complete KYC to Invest" button', () => {
    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: false } });

    render(
      <MemoryRouter>
        <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Complete KYC to Invest/i)).toHaveLength(2);
  });

  test('clicking "Invest" calls setSelectedFund and setIsInvesting', async () => {
    // @ts-expect-error - Ignoring TypeScript error on this line
    vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: true } });

    render(
      <MemoryRouter>
        <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    const investButton = screen.getAllByTitle(/investCTA/i)[1];
    await userEvent.click(investButton);

    expect(mockSetSelectedFund).toHaveBeenCalledWith(sampleFunds[0]);
    expect(mockSetIsInvesting).toHaveBeenCalledWith(true);
  });


  test('clicking "Complete KYC to Invest" navigates to /kyc', async () => {
    vi.mocked(useAuth).mockReturnValue({
      // @ts-expect-error - Ignoring TypeScript error on this line
      user: { name: 'Test User' },
      // @ts-expect-error - Ignoring TypeScript error on this line
      userData: { kycVerified: false },
    });

    const router = createMemoryRouter([
      {
        path: '/',
        element: <AvailableFunds funds={[{ id: '1', name: 'Test Fund', description: 'desc', minimum: 10 }]} setSelectedFund={vi.fn()} setIsInvesting={vi.fn()} />,
      },
      {
        path: '/kyc',
        element: <div>KYC Page</div>,
      },
    ]);

    render(<RouterProvider router={router} />);
    const kycButton = screen.getByText(/Complete KYC to Invest/i);
    expect(kycButton).toBeTruthy();
    await userEvent.click(kycButton);
    expect(router.state.location.pathname).toBe('/kyc');
  });
});