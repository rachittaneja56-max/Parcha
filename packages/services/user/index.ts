import { eq } from "@repo/database";
import type { db } from "@repo/database";
import { usersTable } from "@repo/database/schema";

class UserService {
  constructor(private readonly dbInstance: typeof db) {}

  public async getUserById(id: string) {
    const user = await this.dbInstance.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    return user;
  }
}

export default UserService;
