import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

/**
 * Custom render function with Mantine Provider
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MantineProvider>
        {children}
      </MantineProvider>
    ),
    ...options,
  });
}

/**
 * Mock data generators
 */

export const createMockFormData = (overrides = {}) => ({
  category: 'electronics',
  title: 'Test Product',
  price: 10000,
  description: 'Test description',
  params: {},
  ...overrides,
});

export const createMockAd = (overrides = {}) => ({
  id: 1,
  category: 'electronics',
  title: 'Test Product',
  price: 10000,
  description: 'Test description',
  params: {},
  imageUrl: 'http://example.com/image.jpg',
  views: 0,
  createdAt: new Date(),
  ...overrides,
});

export const createMockChatMessage = (
  role: 'user' | 'assistant' = 'user',
  overrides = {}
) => ({
  id: Math.random().toString(),
  role,
  content: 'Test message',
  timestamp: new Date(),
  ...overrides,
});

/**
 * Wait helpers
 */

export const waitForLoadingToFinish = async (element: HTMLElement) => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(() => {
    expect(element).not.toHaveAttribute('aria-busy', 'true');
  });
};

/**
 * User interaction helpers
 */

export const fillTextInput = async (input: HTMLInputElement, text: string) => {
  const { default: userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.clear(input);
  await user.type(input, text);
};

export const clickElement = async (element: HTMLElement) => {
  const { default: userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.click(element);
};

/**
 * Storage helpers
 */

export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

/**
 * Mock API responses
 */

export const mockSuccessResponse = (data: any) => ({
  ok: true,
  status: 200,
  json: async () => data,
});

export const mockErrorResponse = (status = 400, message = 'Error') => ({
  ok: false,
  status,
  json: async () => ({ error: message }),
});

/**
 * Time helpers
 */

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const flushPromises = () =>
  new Promise(resolve => setImmediate(resolve));

/**
 * Component snapshot helpers
 */

export const createComponentSnapshot = (
  component: string,
  props: Record<string, any>
) => ({
  component,
  props,
  timestamp: new Date().toISOString(),
});

export * from '@testing-library/react';
