import { apiFetch } from "../client";
import { endpoints } from "../endpoints";

/**
 * 📦 Get all warranties
 */
export function getWarranties() {
  return apiFetch(endpoints.user.warranty);
}

/**
 * ➕ Create / Mint / Register warranty
 */
export function createWarranty(data: any) {
  return apiFetch(endpoints.user.warranty, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 🔄 Transfer warranty ownership
 */
export function transferWarranty(data: {
  warrantyId: string;
  fromWallet: string;
  toWallet: string;
}) {
  return apiFetch(endpoints.user.transfer, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 🔍 Verify warranty by tokenId
 */
export function verifyWarranty(tokenId: string) {
  return apiFetch(`${endpoints.user.verify}?tokenId=${tokenId}`);
}
