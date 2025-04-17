import { sequelize } from "../models/index.js"
import { Umzug, SequelizeStorage } from "umzug"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.js"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

const runMigrations = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")

    // Check if there are any pending migrations
    const pendingMigrations = await umzug.pending()

    if (pendingMigrations.length === 0) {
      console.log("No pending migrations to run.")
      return
    }

    // Run pending migrations
    console.log("Running pending migrations...")
    await umzug.up()
    console.log("All migrations have been executed successfully.")
  } catch (error) {
    console.error("Error running migrations:", error)
  } finally {
    await sequelize.close()
  }
}

runMigrations()
