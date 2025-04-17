import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Recommendation = sequelize.define(
    "Recommendation",
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
      resourceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resourceType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recommendationType: {
        type: DataTypes.ENUM("rightsizing", "termination", "scheduling", "reservation", "storage", "network", "other"),
        allowNull: false,
      },
      impact: {
        type: DataTypes.ENUM("high", "medium", "low"),
        allowNull: false,
      },
      potentialSavings: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "USD",
      },
      status: {
        type: DataTypes.ENUM("open", "in_progress", "implemented", "dismissed", "expired"),
        defaultValue: "open",
      },
      actionDetails: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "recommendations",
      timestamps: true,
      indexes: [
        {
          fields: ["provider", "accountId", "resourceId"],
        },
        {
          fields: ["provider", "accountId", "status"],
        },
        {
          fields: ["provider", "accountId", "recommendationType"],
        },
        {
          fields: ["provider", "accountId", "impact"],
        },
      ],
    },
  )

  Recommendation.associate = (models) => {
    // Polymorphic associations based on provider
    Recommendation.belongsTo(models.AwsAccount, {
      foreignKey: "accountId",
      constraints: false,
      as: "awsAccount",
      scope: {
        provider: "aws",
      },
    })

    Recommendation.belongsTo(models.AzureAccount, {
      foreignKey: "accountId",
      constraints: false,
      as: "azureAccount",
      scope: {
        provider: "azure",
      },
    })

    Recommendation.belongsTo(models.GcpAccount, {
      foreignKey: "accountId",
      constraints: false,
      as: "gcpAccount",
      scope: {
        provider: "gcp",
      },
    })

    Recommendation.belongsTo(models.Resource, {
      foreignKey: "resourceId",
      as: "resource",
      constraints: false,
    })
  }

  return Recommendation
}
