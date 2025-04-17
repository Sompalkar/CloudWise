import { DataTypes } from "sequelize"
import { encryptData, decryptData } from "../utils/encryption.js"

export default (sequelize) => {
  const AwsAccount = sequelize.define(
    "AwsAccount",
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
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleArn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      externalId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accessKeyId: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue("accessKeyId")
          return value ? decryptData(value) : null
        },
        set(value) {
          this.setDataValue("accessKeyId", value ? encryptData(value) : null)
        },
      },
      secretAccessKey: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue("secretAccessKey")
          return value ? decryptData(value) : null
        },
        set(value) {
          this.setDataValue("secretAccessKey", value ? encryptData(value) : null)
        },
      },
      region: {
        type: DataTypes.STRING,
        defaultValue: "us-east-1",
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
      tableName: "aws_accounts",
      timestamps: true,
      paranoid: true, // Soft deletes
      indexes: [
        {
          unique: true,
          fields: ["userId", "accountId"],
        },
      ],
    },
  )

  AwsAccount.associate = (models) => {
    AwsAccount.belongsTo(models.User, { foreignKey: "userId", as: "user" })
    AwsAccount.hasMany(models.CostData, {
      foreignKey: "accountId",
      as: "costData",
      constraints: false,
      scope: { provider: "aws" },
    })
    AwsAccount.hasMany(models.Resource, {
      foreignKey: "accountId",
      as: "resources",
      constraints: false,
      scope: { provider: "aws" },
    })
    AwsAccount.hasMany(models.Recommendation, {
      foreignKey: "accountId",
      as: "recommendations",
      constraints: false,
      scope: { provider: "aws" },
    })
  }

  return AwsAccount
}
