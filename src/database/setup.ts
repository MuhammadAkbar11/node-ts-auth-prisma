import { PrismaClient } from "@prisma/client";
import logger from "../configs/logger.config";
const prisma = new PrismaClient();

const DB_AUTOINC_COLOUMNS: {
  table: string;
  columns: { name: string; prefix: string }[];
}[] = [
  {
    table: "tb_users",
    columns: [{ name: "user_id", prefix: "USR" }],
  },
  // { table: "tb_products", columns: [{ name: "product_id", prefix: "PRD" }] },
];

const main = async () => {
  logger.info("[DATABASE] setup database...");

  const getdb = (await prisma.$queryRaw`SELECT DATABASE()`) as Array<any>;
  const dbname = getdb[0]["DATABASE()"] as any;
  const result = (await prisma.$queryRaw`
  SELECT TABLE_NAME, COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = ${dbname}
`) as any; // AND COLUMN_KEY = 'PRI'

  const tablesObj: Record<string, string[]> = {};
  result.forEach((row: any) => {
    const { TABLE_NAME, COLUMN_NAME } = row;
    if (tablesObj[TABLE_NAME]) {
      tablesObj[TABLE_NAME].push(COLUMN_NAME);
    } else {
      tablesObj[TABLE_NAME] = [COLUMN_NAME];
    }
  });

  const tables: { table: string; columns: string[] }[] = Object.keys(
    tablesObj
  ).map(table => ({
    table,
    columns: tablesObj[table],
  })) as [];

  const autoIncrementConfigs = [];
  for (const { table, columns } of tables) {
    for (const column of columns) {
      const match = DB_AUTOINC_COLOUMNS.find(
        c => c.table === table && c.columns.find(col => col.name === column)
      );
      if (match) {
        autoIncrementConfigs.push({
          tb_name: table,
          field: column,
          prefix: match.columns[0].prefix,
        });
      }
    }
  }

  // // find tables in DB_AUTOINC_COLOUMNS that are not used in tables
  // for (const { table } of DB_AUTOINC_COLOUMNS) {
  //   if (!usedTables.has(table)) {
  //     logger.warn(
  //       `[DATABASE] Table ${table} in DB_AUTOINC_COLOUMNS is not found in tables of database`
  //     );
  //   }
  // }

  for (const { table, columns } of DB_AUTOINC_COLOUMNS) {
    const match = tables.find(t => t.table === table);
    if (!match) {
      logger.warn(`[DATABASE] Table ${table} not found in tables`);
      continue;
    }

    for (const column of columns) {
      if (!match.columns.includes(column.name)) {
        logger.warn(
          `[DATABASE] Column ${column.name} not found in table ${table}`
        );
      }
    }
  }

  await prisma.autoIncrement.createMany({ data: autoIncrementConfigs });

  logger.info("[DATABASE] setup database successfully");
};

main()
  .catch((err: any) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
