import { describe, expect, it } from "vitest";
import {
  isOrderExpired,
  pendingHandoffExpiresAt,
  declinedHandoffExpiresAt,
} from "@/lib/cartExpiry";
import type { Order } from "@/types/order";

function order(overrides: Partial<Order> = {}): Order {
  return {
    lines: [],
    fulfillment: "pickup",
    whenNeeded: { kind: "today" },
    customerName: "",
    pendingHandoff: false,
    ...overrides,
  };
}

const NOW = 1_700_000_000_000;

describe("isOrderExpired", () => {
  it("is false for an ordinary cart with no expiresAt", () => {
    expect(isOrderExpired(order(), NOW)).toBe(false);
  });

  it("is false before expiresAt", () => {
    expect(isOrderExpired(order({ expiresAt: NOW + 1000 }), NOW)).toBe(false);
  });

  it("is false exactly at expiresAt (not yet past it)", () => {
    expect(isOrderExpired(order({ expiresAt: NOW }), NOW)).toBe(false);
  });

  it("is true once past expiresAt", () => {
    expect(isOrderExpired(order({ expiresAt: NOW - 1 }), NOW)).toBe(true);
  });
});

describe("pendingHandoffExpiresAt", () => {
  it("is 2 hours from now (ADR-003's unanswered-prompt window)", () => {
    expect(pendingHandoffExpiresAt(NOW)).toBe(NOW + 2 * 60 * 60 * 1000);
  });
});

describe("declinedHandoffExpiresAt", () => {
  it("is 24 hours from now (ADR-003's explicit-decline window)", () => {
    expect(declinedHandoffExpiresAt(NOW)).toBe(NOW + 24 * 60 * 60 * 1000);
  });

  it("is longer than the pending-handoff window", () => {
    expect(declinedHandoffExpiresAt(NOW)).toBeGreaterThan(pendingHandoffExpiresAt(NOW));
  });
});
