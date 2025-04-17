import { Sequelize } from "sequelize"
import config from "../config/config.js"

// Create Sequelize instance
let sequelize
if (config.database.url) {
  // Use connection URL if provided
  sequelize = new Sequelize(config.database.url, {
    dialect: "postgres",
    dialectOptions: config.database.dialectOptions,
    logging: config.database.logging ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  })
} else {
  // Use individual connection parameters
  sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: "postgres",
    logging: config.database.logging ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  })
}

// Import models
import User from "./user.js"
import AwsAccount from "./awsAccount.js"
import AzureAccount from "./azureAccount.js"
import GcpAccount from "./gcpAccount.js"
import CostData from "./costData.js"
import Resource from "./resource.js"
import Recommendation from "./recommendation.js"
import Alert from "./alert.js"
import BlogPost from "./blogPost.js"
import Payment from "./payment.js"
import Subscription from "./subscription.js"

// Initialize models
const models = {
  User: User(sequelize),
  AwsAccount: AwsAccount(sequelize),
  AzureAccount: AzureAccount(sequelize),
  GcpAccount: GcpAccount(sequelize),
  CostData: CostData(sequelize),
  Resource: Resource(sequelize),
  Recommendation: Recommendation(sequelize),
  Alert: Alert(sequelize),
  BlogPost: BlogPost(sequelize),
  Payment: Payment(sequelize),
  Subscription: Subscription(sequelize),
}

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

export { sequelize }
export default models
