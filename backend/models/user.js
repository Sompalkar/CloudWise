import { DataTypes } from "sequelize"

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      auth0Id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      settings: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      profilePicture: { // Add profilePicture field
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true, // Soft deletes
    },
  )

  User.associate = (models) => {
    User.hasMany(models.AwsAccount, { foreignKey: "userId", as: "awsAccounts" })
    User.hasMany(models.AzureAccount, { foreignKey: "userId", as: "azureAccounts" })
    User.hasMany(models.GcpAccount, { foreignKey: "userId", as: "gcpAccounts" })
    User.hasMany(models.Alert, { foreignKey: "userId", as: "alerts" })
    User.hasMany(models.BlogPost, { foreignKey: "userId", as: "blogPosts" })
    User.hasMany(models.Payment, { foreignKey: "userId", as: "payments" })
    User.hasMany(models.Subscription, { foreignKey: "userId", as: "subscriptions" })
  }

  return User
}
