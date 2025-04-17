import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Subscription = sequelize.define(
    "Subscription",
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
      stripeSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      plan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "canceled", "past_due", "trialing", "incomplete"),
        defaultValue: "active",
      },
      currentPeriodStart: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      currentPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancelAtPeriodEnd: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      tableName: "subscriptions",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["stripeSubscriptionId"],
        },
        {
          fields: ["status"],
        },
      ],
    },
  )

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.User, { foreignKey: "userId", as: "user" })
  }

  return Subscription
}
