import type { Order } from "@/types/order";
import { CONFIG } from "@/lib/config";

const HOUR_MS = 60 * 60 * 1000;

/** True once order.expiresAt (stamped when a handoff attempt starts or
 * is explicitly declined) has passed. Always false for an ordinary
 * in-progress cart, which has no expiresAt. */
export function isOrderExpired(order: Order, now: number): boolean {
  return order.expiresAt !== undefined && now > order.expiresAt;
}

export function pendingHandoffExpiresAt(now: number): number {
  return now + CONFIG.pendingHandoffExpiryHours * HOUR_MS;
}

export function declinedHandoffExpiresAt(now: number): number {
  return now + CONFIG.declinedHandoffExpiryHours * HOUR_MS;
}
