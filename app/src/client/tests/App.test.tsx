import { renderInContext } from 'wasp/client/test';
import { screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

interface LocalStorageMock extends Storage {
  store: Record<string, string>;
}

const localStorageMock: LocalStorageMock = (function () {
  let store: Record<string, string> = {};

  return {
    get length(): number {
      return Object.keys(store).length;
    },
    getItem(key: string): string | null {
      return store[key] || null;
    },
    setItem(key: string, value: string): void {
      store[key] = value;
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      store = {};
    },
    key(index: number): string | null {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    store,
  };
})();

global.localStorage = localStorageMock;

// Shared mock setup function
function setupMocks(mockUser: any, pathName = '/') {
  // Always mock useAuth with provided user data
  vi.doMock('wasp/client/auth', () => ({ useAuth: () => mockUser }));

  // Correctly mock useLocation to consistently return a pathname
  vi.doMock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'), // Maintain other hooks and routing components
    useLocation: () => ({
      pathname: pathName, // Ensure this is correctly set according to the test scenario
    }),
    useHistory: () => ({
      // Mock useHistory with minimal implementation if not used
      push: vi.fn(),
      replace: vi.fn(),
      goBack: vi.fn(),
    }),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  }));
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App Component', () => {
  it('dynamically imports and test isSignUpComplete', async () => {
    const mockUser = {
      data: {
        id: 1,
        lastActiveTimestamp: new Date(),
      },
      isError: false,
      isLoading: false,
    };
    setupMocks(mockUser);
    const { default: App } = await import('../App');
    renderInContext(
      <MemoryRouter>
        <App children={<div>Test</div>} />
      </MemoryRouter>
    );

    await screen.findByText('Test');
  });
});
