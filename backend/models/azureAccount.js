import { DataTypes } from "sequelize"
import { encryptData, decryptData } from "../utils/encryption.js"

export default (sequelize) => {
  const AzureAccount = sequelize.define(
    "AzureAccount",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tenantId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subscriptionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue("clientId")
          return value ? decryptData(value) : null
        },
        set(value) {
          this.setDataValue("clientId", value ? encryptData(value) : null)
        },
      },
      clientSecret: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue("clientSecret")
          return value ? decryptData(value) : null
        },
        set(value) {
          this.setDataValue("clientSecret", value ? encryptData(value) : null)
        },
      },
      status: {
        type: DataTypes.ENUM("connected", "error", "pending"),
        defaultValue: "pending",
      },
      lastSync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      settings: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      tableName: "azure_accounts",
      timestamps: true,
      paranoid: true, // Soft deletes
      indexes: [
        {
          unique: true,
          fields: ["userId", "subscriptionId"],
        },
      ],
    },
  )

  AzureAccount.associate = (models) => {
    AzureAccount.belongsTo(models.User, { foreignKey: "userId", as: "user" })
    AzureAccount.hasMany(models.CostData, {
      foreignKey: "accountId",
      as: "costData",
      constraints: false,
      scope: { provider: "azure" },
    })
    AzureAccount.hasMany(models.Resource, {
      foreignKey: "accountId",
      as: "resources",
      constraints: false,
      scope: { provider: "azure" },
    })
    AzureAccount.hasMany(models.Recommendation, {
      foreignKey: "accountId",
      as: "recommendations",
      constraints: false,
      scope: { provider: "azure" },
    })
  }

  return AzureAccount
}
