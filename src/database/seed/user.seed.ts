import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { ROLES, USER_STATUS } from "../../configs/vars.config";
import { hashPassword } from "../../utils/password.utils";

async function generateSeedUsers(numUsers: number) {
  const seedUsers: User[] = [];

  for (let i = 0; i < numUsers; i++) {
    const name = faker.name.fullName();
    const email = faker.internet.email(name);
    const status = faker.helpers.arrayElement([
      ...Object.keys(USER_STATUS),
    ]) as string;
    const role = faker.helpers.arrayElement([...Object.keys(ROLES)]) as string;
    const newUser = {
      email: email,
      name: name,
      password: await hashPassword("123456"),
      status: status,
      role: role,
      avatar: faker.image.avatar(),
    } as User;

    seedUsers.push(newUser);
  }

  return seedUsers;
}

export default generateSeedUsers;
