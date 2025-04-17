import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Alert = sequelize.define(
    "Alert",
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
      provider: {
        type: DataTypes.ENUM("aws", "azure", "gcp", "system"),
        allowNull: false,
      },
      accountId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM("critical", "high", "medium", "low", "info"),
        defaultValue: "medium",
      },
      status: {
        type: DataTypes.ENUM("new", "read", "acknowledged", "resolved"),
        defaultValue: "new",
      },
      category: {
        type: DataTypes.ENUM("cost", "security", "performance", "availability", "other"),
        defaultValue: "cost",
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      notificationSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "alerts",
      timestamps: true,
      indexes: [
        {
          fields: ["userId", "status"],
        },
        {
          fields: ["userId", "severity"],
        },
        {
          fields: ["provider", "accountId"],
        },
      ],
    },
  )

  Alert.associate = (models) => {
    Alert.belongsTo(models.User, { foreignKey: "userId", as: "user" })
  }

  return Alert
}
