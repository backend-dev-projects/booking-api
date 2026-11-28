import { Role } from "../../../authentication/enums/roles.enum.js";

export function canUpdateCustomer(
  user_id: string,
  user_role: Role,
  customer_id: string,
): boolean {
  return user_role === Role.ADMIN || user_id === customer_id;
}
