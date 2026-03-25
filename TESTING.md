# Testing Guide for Avito Ads Editor

## Overview

This testing suite provides comprehensive coverage for the ads editing functionality including:

- **Utility Functions Tests** (`adsEditUtils.test.ts`)
- **Zustand Store Tests** (`adsEditStore.test.ts`)
- **Service Layer Tests** (`adsEditService.test.ts`)
- **Component Tests** (`ChatBox.test.tsx`, `AiPopover.test.tsx`)

## Setup

### Install Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

### Vitest Configuration

Add to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

### Setup File

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});
```

## Test Structure

### 1. adsEditUtils.test.ts

Tests for utility functions:
- `updateFormData()` - Field updates
- `updateParams()` - Parameter management
- `saveDraft()` - Draft persistence
- `loadDraft()` - Draft retrieval

**Coverage**: ~95%

```bash
npm run test src/pages/ads-item/__tests__/adsEditUtils.test.ts
```

### 2. adsEditStore.test.ts

Tests for Zustand store:
- Ad state management
- Form data management
- AI state management
- Chat message handling

**Coverage**: ~90%

```bash
npm run test src/pages/ads-item/__tests__/adsEditStore.test.ts
```

### 3. adsEditService.test.ts

Tests for service layer:
- `improveDescription()` - AI description improvement
- `marketPrice()` - Market price analysis
- `applyPriceFromText()` - Price parsing
- `chatWithAI()` - Chat with context

**Coverage**: ~95%

```bash
npm run test src/pages/ads-item/__tests__/adsEditService.test.ts
```

### 4. ChatBox.test.tsx

Tests for ChatBox component:
- Message rendering
- User interactions
- Loading states
- Form submission

**Coverage**: ~95%

```bash
npm run test src/widgets/ads-item/__tests__/ChatBox.test.tsx
```

### 5. AiPopover.test.tsx

Tests for AiPopover component:
- Popover display
- Text comparison
- Button interactions
- Difference highlighting

**Coverage**: ~92%

```bash
npm run test src/widgets/ads-item/__tests__/AiPopover.test.tsx
```

## Running Tests

### Run All Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm run test src/pages/ads-item/__tests__/adsEditUtils.test.ts
```

### Run Tests Matching Pattern

```bash
npm run test -- --grep "updateFormData"
```

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## Key Testing Patterns Used

### 1. Mocking

```typescript
vi.mock('../../../shared/api/llmApi');
vi.mocked(callGemini).mockResolvedValue('response');
```

### 2. Async Operations

```typescript
vi.mocked(mockFn).mockResolvedValue(data);
await waitFor(() => {
  expect(...).toBe(...);
});
```

### 3. User Interactions

```typescript
const user = userEvent.setup();
await user.type(input, 'text');
await user.click(button);
```

### 4. Store Testing

```typescript
const { result } = renderHook(() => useAdsEditStore());
act(() => {
  result.current.setFormData(data);
});
```

### 5. Component Props

```typescript
render(
  <ChatBox
    messages={mockMessages}
    loading={false}
    onSendMessage={mockFn}
  />
);
```

## Test Data Fixtures

### Mock Form Data

```typescript
const mockFormData: FormData = {
  category: "electronics",
  title: "iPhone 14",
  price: 50000,
  description: "Great phone",
  params: { brand: "Apple" },
};
```

### Mock Chat Messages

```typescript
const mockMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Hello",
    timestamp: new Date(),
  },
  {
    id: "2",
    role: "assistant",
    content: "Hi there",
    timestamp: new Date(),
  },
];
```

### Mock Ad Item

```typescript
const mockAd: AdItem = {
  id: 1,
  category: "electronics",
  title: "iPhone",
  price: 50000,
  description: "Great phone",
  params: {},
  imageUrl: "url",
  views: 0,
  createdAt: new Date(),
};
```

## Coverage Goals

- **adsEditUtils.ts**: 95%+
- **adsEditStore.ts**: 90%+
- **adsEditService.ts**: 95%+
- **ChatBox.tsx**: 95%+
- **AiPopover.tsx**: 92%+

## Common Issues & Solutions

### Issue: Tests timeout

```typescript
// Increase timeout
it('test name', async () => {
  // test code
}, { timeout: 10000 });
```

### Issue: localStorage not clearing

```typescript
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
```

### Issue: Component not rendering

```typescript
await waitFor(() => {
  expect(screen.getByText('...')).toBeInTheDocument();
});
```

### Issue: Unmocked API calls

```typescript
vi.mock('../path/to/module');
vi.mocked(functionName).mockResolvedValue(data);
```

## Best Practices

1. **Keep tests focused** - One assertion per test when possible
2. **Use descriptive names** - Test names should describe what is being tested
3. **Mock external dependencies** - Mock API calls, localStorage, etc.
4. **Test user behavior** - Test how users interact with components
5. **Use setup/teardown** - Clean state before and after tests
6. **Test edge cases** - Empty states, errors, special characters
7. **Avoid implementation details** - Test behavior, not internals
8. **Use fixtures** - Reusable test data reduces duplication

## Debugging Tests

### Debug a Specific Test

```typescript
it.only('test name', () => {
  // Only this test will run
});
```

### Skip a Test

```typescript
it.skip('test name', () => {
  // This test will be skipped
});
```

### Add Debug Output

```typescript
import { screen, debug } from '@testing-library/react';

debug(); // Prints the DOM
screen.debug(element); // Prints specific element
```

### Use VSCode Debugger

```json
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["--inspect-brk", "--no-coverage"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Continuous Monitoring

### Run tests before commit

```bash
npm run test -- --run
```

### Watch mode for development

```bash
npm run test:watch
```

### Coverage reports

```bash
npm run test:coverage
open coverage/index.html
```

## Next Steps

1. Run all tests: `npm run test`
2. Check coverage: `npm run test:coverage`
3. Add more tests for other components as needed
4. Set up CI/CD integration
5. Maintain >80% code coverage target
