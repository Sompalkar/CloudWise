import { DataTypes } from "sequelize"

export default (sequelize) => {
  const CostData = sequelize.define(
    "CostData",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      provider: {
        type: DataTypes.ENUM("aws", "azure", "gcp"),
        allowNull: false,
      },
      accountId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resourceName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "USD",
      },
      usageQuantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      usageUnit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      tableName: "cost_data",
      timestamps: true,
      indexes: [
        {
          fields: ["provider", "accountId", "date"],
        },
        {
          fields: ["provider", "accountId", "service"],
        },
        {
          fields: ["provider", "accountId", "resourceId"],
        },
      ],
    },
  )

  CostData.associate = (models) => {
    // Polymorphic associations based on provider
    CostData.belongsTo(models.AwsAccount, {
      foreignKey: "accountId",
      constraints: false,
      as: "awsAccount",
      scope: {
        provider: "aws",
      },
    })

    CostData.belongsTo(models.AzureAccount, {
      foreignKey: "accountId",
      constraints: false,
      as: "azureAccount",
      scope: {
        provider: "azure",
      },
    })

    CostData.belongsTo(models.GcpAccount, {
      foreignKey: "accountId",
      constraints: false,
      as: "gcpAccount",
      scope: {
        provider: "gcp",
      },
    })
  }

  return CostData
}
