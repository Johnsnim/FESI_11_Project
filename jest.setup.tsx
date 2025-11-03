import "@testing-library/jest-dom";
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IO,
});

jest.mock("motion/react", () => {
  const React = require("react");
  const factory =
    (tag: any) =>
    ({ children, ...props }: any) =>
      React.createElement(tag, props, children);

  const handler = { get: (_t: any, prop: any) => factory(prop) };

  return {
    m: new Proxy({}, handler),
    motion: new Proxy({}, handler),
  };
});
