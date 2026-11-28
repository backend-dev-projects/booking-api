import { Role } from "../../authentication/domain/enums/roles.enum.js";

export class Customer {
  constructor(
    public customer_id: string,
    public full_name: string,
    public user_role: Role,
    public email: string,
  ) {}

  canUpdateUser(user_id: string) {
    return this.user_role === Role.ADMIN || user_id === this.customer_id;
  }
}
