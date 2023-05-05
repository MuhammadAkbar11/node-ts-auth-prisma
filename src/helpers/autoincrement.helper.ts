import logger from "../configs/logger.config";
import mainPrisma from "../configs/prisma.config";
import BaseError from "./error.helper";
import { IGenerateAutoIncFieldHelper } from "../utils/types/interfaces";

async function GenerateAutoIncField({
  prismaTx,
  tableName,
  field,
  length = 6,
}: IGenerateAutoIncFieldHelper) {
  const prisma = prismaTx ? prismaTx : mainPrisma;
  try {
    const tableTarget = await prisma.autoIncrement.findFirst({
      where: {
        field: field,
        tb_name: tableName,
      },
    });
    let zero = [];

    if (tableTarget) {
      const prefix = `${tableTarget.prefix}`;
      const counter = Number(tableTarget?.value) as number;
      const prefixLength = prefix.length;
      const num = length - +prefixLength - counter.toString().length;
      for (let i = 0; i < num; i++) {
        zero.push("0");
      }

      const result = `${prefix}${zero.join("")}${counter}`;

      await prisma.autoIncrement.update({
        where: {
          id: tableTarget.id,
        },
        data: {
          value: { increment: 1 },
        },
      });
      logger.info(
        `[HELPER] successfully generated auto increment for column ${field} in table ${tableName} = ${result}, Length = ${length} `
      );
      return result;
    }

    throw new BaseError(
      "ERR_AUTOINCREMENT",
      400,
      `failed to generate auto-increment for column ${field} with table ${tableName}. because column ${field} or table ${tableName} is not found in the auto-increments table.`
    );
  } catch (error: any) {
    logger.error(error);
    throw BaseError.transformError(error);
  }
}

export default GenerateAutoIncField;
