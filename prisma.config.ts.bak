import "dotenv/config";
import { defineConfig, env } from "prisma/config";

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env<Env>("DATABASE_URL"),
  },
});

// import { defineConfig, env } from "prisma/config";

// export default defineConfig({

//   schema: path.join("prisma", "schema.prisma"),
// });
