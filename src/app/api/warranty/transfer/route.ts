import { transferWarranty } from "@/server/controllers/transfer.controller";

export async function POST(req: Request) {
  return transferWarranty(req);
}
