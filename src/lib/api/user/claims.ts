import { apiFetch } from "../client";
import { endpoints } from "../endpoints";

export function createClaim(data: any) {
  return apiFetch(endpoints.user.claims, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
