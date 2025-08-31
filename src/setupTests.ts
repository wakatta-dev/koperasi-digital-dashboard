/** @format */

// Global test setup for Vitest
// - Provides TextEncoder/TextDecoder used by some Next.js internals
// - Ensures global fetch/Headers exist (Node 18+ provides these via undici)
// - Adds small shims to avoid crashes in JSDOM

import { afterEach } from "vitest";

// Keep time operations stable
process.env.TZ = process.env.TZ || "UTC";

// TextEncoder/TextDecoder polyfill for environments that lack them
try {
  const { TextEncoder, TextDecoder } = await import("node:util");
  // @ts-ignore
  if (typeof (global as any).TextEncoder === "undefined")
    // @ts-ignore
    (global as any).TextEncoder = TextEncoder;
  // @ts-ignore
  if (typeof (global as any).TextDecoder === "undefined")
    // @ts-ignore
    (global as any).TextDecoder = TextDecoder as any;
} catch {}

// Ensure fetch/Headers exist; Node >= 18 provides these by default.
// If a test needs to override, it will stub global.fetch explicitly.

// JSDOM missing implementation stubs used by some components
if (typeof window !== "undefined") {
  if (typeof (window as any).matchMedia === "undefined") {
    // @ts-ignore
    (window as any).matchMedia = () => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
}

// Clean up DOM between tests when using Testing Library
try {
  const { cleanup } = await import("@testing-library/react");
  afterEach(() => cleanup());
} catch {
  // testing-library might not be used in all tests
}
