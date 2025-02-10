import { expect, test, vi, describe, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AvailableFunds from '../components/AvailableFunds';
import { useAuth } from '../context/useAuth';
// import userEvent from '@testing-library/user-event';
import { page, userEvent } from '@vitest/browser/context'

import { vi } from "vitest";

// ✅ Mock `useAuth`
vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockPush = vi.fn();

vi.mock("@hooks/useNavigation", () => {
  return {
    // useNavigation
    default: () => ({
      push: mockPush,
    }),
  };
});

// ✅ Sample fund data
const sampleFunds = [
  { id: '1', name: 'Tech Growth Fund', description: 'A fund focusing on technology stocks.', minimum: 100 },
  { id: '2', name: 'Green Energy Fund', description: 'Invest in renewable energy.', minimum: 200 },
];

// ✅ Common setup before each test
let mockSetSelectedFund = vi.fn();
let mockSetIsInvesting = vi.fn();

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(() => mockNavigate), // ✅ Ensures `useNavigate()` is a spy
  };
});

beforeEach(() => {
  vi.clearAllMocks(); // Reset mocks before each test
  beforeEach(() => {
    render(<AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/"]}>
          {children}
        </MemoryRouter>
      ),
    });
  });
});

describe('AvailableFunds Component', () => {
  test('renders "Available Funds" title', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, userData: {} });

    render(
      <MemoryRouter>
        <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Available Funds/i)).toBeInTheDocument();
  });

  test('shows "Loading..." when no funds are available', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, userData: {} });

    render(
      <MemoryRouter>
        <AvailableFunds funds={[]} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  // test('renders fund cards correctly', () => {
  //   vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: true } });

  //   render(
  //     <MemoryRouter>
  //       <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByText(/Tech Growth Fund/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Green Energy Fund/i)).toBeInTheDocument();
  // });

  // test('guest users see "Login to Invest"', () => {
  //   vi.mocked(useAuth).mockReturnValue({ user: null, userData: {} });

  //   render(
  //     <MemoryRouter>
  //       <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getAllByText(/Login to Invest/i)).toHaveLength(2);
  // });

  // test('KYC-verified users can see "Invest" button', () => {
  //   vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: true } });

  //   render(
  //     <MemoryRouter>
  //       <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getAllByText(/Invest/i)).toHaveLength(2);
  // });

  // test('non-KYC users see "Complete KYC to Invest" button', () => {
  //   vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: false } });

  //   render(
  //     <MemoryRouter>
  //       <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getAllByText(/Complete KYC to Invest/i)).toHaveLength(2);
  // });

  // test('clicking "Invest" calls setSelectedFund and setIsInvesting', () => {
  //   vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' }, userData: { kycVerified: true } });

  //   render(
  //     <MemoryRouter>
  //       <AvailableFunds funds={sampleFunds} setSelectedFund={mockSetSelectedFund} setIsInvesting={mockSetIsInvesting} />
  //     </MemoryRouter>
  //   );

  //   const investButton = screen.getByText(/Invest/i);
  //   fireEvent.click(investButton);

  //   expect(mockSetSelectedFund).toHaveBeenCalledWith(sampleFunds[0]); // First fund in sorted list
  //   expect(mockSetIsInvesting).toHaveBeenCalledWith(true);
  // });



  // test('clicking "Complete KYC to Invest" navigates to /kyc', async () => {
  //   const kycButtons = page.getByText(/Complete KYC to Invest/i);
  //   const kycButton = kycButtons.nth(0);

  //   // let kycClickFired = false

  //   // kycButton.addEventListener('click', (evt) => {
  //   //   if (evt.detail === 1) {
  //   //     kycClickFired = true
  //   //   }
  //   // })

  //   await userEvent.click(kycButton)

  //   expect(mockPush.mock.lastCall[0]).toEqual("/kyc");

  //   // await kycButton.click()

  //   // console.log('Mock navigate calls:', mockNavigate.mock.calls); // ✅ Log navigate calls

  //   // expect(kycClickFired).toBe(true)
  //   // expect(mockNavigate).toHaveBeenCalledWith('/kyc');
  // });

});