import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "book_store",
  synchronize: true,
  logging: true,
  entities: ["src/entities/**/*.entity.ts"],
  migrations: [],
});
