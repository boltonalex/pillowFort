import { expect, test, describe } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import CushonButton from '../components/CushonButton';

describe('CushonButton Component', () => {
  test('renders with pink variant as default', () => {
    render(
      <RouterProvider
        router={createMemoryRouter([
          { path: '/', element: <CushonButton clickTarget="/test">Click Me</CushonButton> },
        ])}
      />
    );
    const link = screen.getByRole('link', { name: /click me/i });
    const button = within(link).getByRole('button');
    expect(button.getAttribute("class")).toContain('text-white bg-pink-500');
  });
  test('renders with pink variant when specified', () => {
    render(
      <RouterProvider
        router={createMemoryRouter([
          { path: '/', element: <CushonButton clickTarget="/test" variant='pink'>Click Me</CushonButton> },
        ])}
      />
    );
    const link = screen.getByRole('link', { name: /click me/i });
    const button = within(link).getByRole('button');
    expect(button.getAttribute("class")).toContain('text-white bg-pink-500');
  });
  test('renders with white variant', () => {
    render(
      <RouterProvider
        router={createMemoryRouter([
          { path: '/', element: <CushonButton clickTarget="/test" variant="white">Click Me</CushonButton> },
        ])}
      />
    );
    const link = screen.getByRole('link', { name: /click me/i });
    const button = within(link).getByRole('button');
    expect(button.getAttribute("class")).toContain('text-pink-500 border-pink-500');
  });

  test('clicking button navigates to clickTarget', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <CushonButton clickTarget="/target">Go to Target</CushonButton>,
      },
      {
        path: '/target',
        element: <div>target</div>,
      },
    ]);
    render(<RouterProvider router={router} />);
    const targetBtn = screen.getByText(/Go to Target/i);
    expect(targetBtn).toBeTruthy();
    await userEvent.click(targetBtn);
    expect(router.state.location.pathname).toBe('/target');
  });
});