import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { CoreService } from "../../core/service.core";
import { BindAllMethods } from "../../utils/decorators.utils";
import { omit } from "lodash";

@BindAllMethods
class UserService extends CoreService {
  constructor() {
    super();
  }

  public async createUser(input: Omit<User, "id">) {
    try {
      const existEmail = await this.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (existEmail) {
        throw this.error(
          "DUPLICATE_ENTRY_ERR",
          409,
          `Email ${input.email} already exists`
        );
      }

      const newUser = {
        name: input.name,
        email: input.email,
        password: await this.hashPassword(input.password),
      } as User;

      const user = await this.prisma.user.create({
        data: newUser,
      });

      return omit(user, "password");
    } catch (error: any) {
      this.throwError(error);
    }
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hashSync(password, salt);
  }
}

export default UserService;
