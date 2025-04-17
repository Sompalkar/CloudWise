import { DataTypes } from "sequelize"
import { encryptData, decryptData } from "../utils/encryption.js"

export default (sequelize) => {
  const GcpAccount = sequelize.define(
    "GcpAccount",
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
      projectId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceAccountKey: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const value = this.getDataValue("serviceAccountKey")
          return value ? decryptData(value) : null
        },
        set(value) {
          this.setDataValue("serviceAccountKey", value ? encryptData(value) : null)
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
      tableName: "gcp_accounts",
      timestamps: true,
      paranoid: true, // Soft deletes
      indexes: [
        {
          unique: true,
          fields: ["userId", "projectId"],
        },
      ],
    },
  )

  GcpAccount.associate = (models) => {
    GcpAccount.belongsTo(models.User, { foreignKey: "userId", as: "user" })
    GcpAccount.hasMany(models.CostData, {
      foreignKey: "accountId",
      as: "costData",
      constraints: false,
      scope: { provider: "gcp" },
    })
    GcpAccount.hasMany(models.Resource, {
      foreignKey: "accountId",
      as: "resources",
      constraints: false,
      scope: { provider: "gcp" },
    })
    GcpAccount.hasMany(models.Recommendation, {
      foreignKey: "accountId",
      as: "recommendations",
      constraints: false,
      scope: { provider: "gcp" },
    })
  }

  return GcpAccount
}
