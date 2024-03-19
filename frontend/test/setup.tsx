import "@testing-library/jest-dom";
import { afterEach } from "node:test";
import { vi } from "vitest";
afterEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
