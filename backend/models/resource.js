import { DataTypes } from "sequelize"

/**
* Resource model definition
* Represents cloud resources across different providers (AWS, Azure, GCP)
*
* @param {Object} sequelize - Sequelize instance
* @returns {Model} Resource model
*/
export default (sequelize) => {
 const Resource = sequelize.define(
   "Resource",
   {
     id: {
       type: DataTypes.UUID,
       defaultValue: DataTypes.UUIDV4,
       primaryKey: true,
       comment: "Unique identifier for the resource",
     },
     provider: {
       type: DataTypes.ENUM("aws", "azure", "gcp"),
       allowNull: false,
       comment: "Cloud provider (aws, azure, gcp)",
     },
     accountId: {
       type: DataTypes.STRING,
       allowNull: false,
       comment: "ID of the cloud account this resource belongs to",
     },
     resourceId: {
       type: DataTypes.STRING,
       allowNull: false,
       comment: "Provider-specific resource identifier",
     },
     resourceName: {
       type: DataTypes.STRING,
       allowNull: true,
       comment: "Human-readable name of the resource",
     },
     resourceType: {
       type: DataTypes.STRING,
       allowNull: false,
       comment: "Type of resource (e.g., ec2, s3, vm, etc.)",
     },
     region: {
       type: DataTypes.STRING,
       allowNull: true,
       comment: "Region where the resource is deployed",
     },
     status: {
       type: DataTypes.STRING,
       allowNull: true,
       comment: "Current status of the resource (e.g., running, stopped)",
     },
     createdAt: {
       type: DataTypes.DATE,
       allowNull: true,
       comment: "When the resource was created in the cloud provider",
     },
     lastUpdatedAt: {
       type: DataTypes.DATE,
       allowNull: true,
       comment: "When the resource was last updated in the cloud provider",
     },
     tags: {
       type: DataTypes.JSONB,
       defaultValue: {},
       comment: "Resource tags as key-value pairs",
     },
     metrics: {
       type: DataTypes.JSONB,
       defaultValue: {},
       comment: "Performance metrics for the resource",
     },
     configuration: {
       type: DataTypes.JSONB,
       defaultValue: {},
       comment: "Resource configuration details",
     },
     cost: {
       type: DataTypes.DECIMAL(10, 2),
       allowNull: true,
       comment: "Current cost of the resource",
     },
     costPerMonth: {
       type: DataTypes.DECIMAL(10, 2),
       allowNull: true,
       comment: "Estimated monthly cost of the resource",
     },
     utilization: {
       type: DataTypes.DECIMAL(5, 2),
       allowNull: true,
       comment: "Resource utilization percentage",
     },
     lastSyncedAt: {
       type: DataTypes.DATE,
       allowNull: true,
       comment: "When the resource was last synced from the cloud provider",
     },
     metadata: {
       type: DataTypes.JSONB,
       defaultValue: {},
       comment: "Additional metadata about the resource",
     },
   },
   {
     tableName: "resources",
     timestamps: true,
     indexes: [
       {
         fields: ["provider", "accountId", "resourceId"],
         unique: true,
         name: "resources_provider_account_resource_idx",
       },
       {
         fields: ["provider", "accountId", "resourceType"],
         name: "resources_provider_account_type_idx",
       },
       {
         fields: ["provider", "accountId", "status"],
         name: "resources_provider_account_status_idx",
       },
       {
         fields: ["provider", "region"],
         name: "resources_provider_region_idx",
       },
       {
         fields: ["resourceType", "utilization"],
         name: "resources_type_utilization_idx",
       },
     ],
   },
 )

 /**
  * Define associations with other models
  */
 Resource.associate = (models) => {
   // Polymorphic associations based on provider
   Resource.belongsTo(models.AwsAccount, {
     foreignKey: "accountId",
     constraints: false,
     as: "awsAccount",
     scope: {
       provider: "aws",
     },
   })

   Resource.belongsTo(models.AzureAccount, {
     foreignKey: "accountId",
     constraints: false,
     as: "azureAccount",
     scope: {
       provider: "azure",
     },
   })

   Resource.belongsTo(models.GcpAccount, {
     foreignKey: "accountId",
     constraints: false,
     as: "gcpAccount",
     scope: {
       provider: "gcp",
     },
   })

   Resource.hasMany(models.Recommendation, {
     foreignKey: "resourceId",
     as: "recommendations",
     constraints: false,
   })

   Resource.hasMany(models.CostData, {
     foreignKey: "resourceId",
     as: "costData",
     constraints: false,
   })
 }

 /**
  * Instance methods
  */
 Resource.prototype.getMetrics = async (metricName, startTime, endTime) => {
   // This would fetch metrics from the cloud provider's API
   // For now, we'll return mock data
   return {
     metricName,
     datapoints: [
       { timestamp: new Date(startTime), value: Math.random() * 100 },
       { timestamp: new Date(new Date(startTime).getTime() + 3600000), value: Math.random() * 100 },
       { timestamp: new Date(new Date(startTime).getTime() + 7200000), value: Math.random() * 100 },
       { timestamp: new Date(endTime), value: Math.random() * 100 },
     ],
   }
 }

 /**
  * Update resource tags
  */
 Resource.prototype.updateTags = async function (tags) {
   // In a real implementation, this would update tags in the cloud provider
   this.tags = { ...this.tags, ...tags }
   return this.save()
 }

 /**
  * Calculate resource efficiency score
  */
 Resource.prototype.getEfficiencyScore = function () {
   // Calculate an efficiency score based on utilization and other factors
   const utilizationScore = this.utilization ? Math.min(100, this.utilization) / 100 : 0.5
   const costScore = this.costPerMonth ? Math.min(1, 1000 / this.costPerMonth) : 0.5

   // Weight the scores (utilization is more important)
   return Math.round((utilizationScore * 0.7 + costScore * 0.3) * 100)
 }

 /**
  * Static methods
  */

 /**
  * Find idle resources
  */
 Resource.findIdle = async (options = {}) => {
   const { provider, accountId, threshold = 10, days = 7 } = options

   const cutoffDate = new Date()
   cutoffDate.setDate(cutoffDate.getDate() - days)

   const whereClause = {
     utilization: { [sequelize.Op.lt]: threshold },
     lastUpdatedAt: { [sequelize.Op.lt]: cutoffDate },
     status: "running",
   }

   if (provider) {
     whereClause.provider = provider
   }

   if (accountId) {
     whereClause.accountId = accountId
   }

   return Resource.findAll({
     where: whereClause,
     order: [["utilization", "ASC"]],
   })
 }

 /**
  * Find resources by tag
  */
 Resource.findByTag = async (tagKey, tagValue) => {
   // This is a simplified implementation
   // In a real database, you would use a more efficient query
   const resources = await Resource.findAll()

   return resources.filter((resource) => {
     return resource.tags && resource.tags[tagKey] === tagValue
   })
 }

 /**
  * Get resource count by type
  */
 Resource.getCountByType = async (provider) => {
   const whereClause = provider ? { provider } : {}

   return Resource.findAll({
     attributes: ["resourceType", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
     where: whereClause,
     group: ["resourceType"],
     order: [[sequelize.literal("count"), "DESC"]],
   })
 }

 return Resource
}
