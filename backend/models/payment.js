import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
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
      stripePaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "USD",
      },
      status: {
        type: DataTypes.ENUM("pending", "succeeded", "failed", "refunded"),
        defaultValue: "pending",
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      tableName: "payments",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["stripePaymentId"],
        },
        {
          fields: ["status"],
        },
      ],
    },
  )

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: "userId", as: "user" })
  }

  return Payment
}
