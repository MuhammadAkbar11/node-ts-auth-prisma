import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hashSync(password, salt);
}

export async function comparePassword(candidatePw: string, password: string) {
  return bcrypt.compare(candidatePw, password).catch(_e => false);
}
