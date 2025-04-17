import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer"
import { EC2Client, DescribeInstancesCommand, DescribeVolumesCommand } from "@aws-sdk/client-ec2"
import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds"
import { S3Client } from "@aws-sdk/client-s3"
import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch"
import { IAMClient } from "@aws-sdk/client-iam"
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts"
import { logger } from "./logger.js"
import config from "../config/config.js"

/**
 * Creates AWS SDK clients with the provided credentials
 * @param {Object} credentials - AWS credentials
 * @returns {Object} - Object containing AWS SDK clients
 */
export const createAwsClients = (credentials) => {
  // Set AWS config
  const region = credentials.region || config.aws.region
  const clientConfig = {
    region,
    credentials: {
      accessKeyId: credentials.accessKeyId || config.aws.accessKeyId,
      secretAccessKey: credentials.secretAccessKey || config.aws.secretAccessKey,
    },
  }

  // Create AWS SDK clients
  const costExplorer = new CostExplorerClient(clientConfig)
  const ec2 = new EC2Client(clientConfig)
  const rds = new RDSClient(clientConfig)
  const s3 = new S3Client(clientConfig)
  const cloudWatch = new CloudWatchClient(clientConfig)
  const iam = new IAMClient(clientConfig)

  return {
    costExplorer,
    ec2,
    rds,
    s3,
    cloudWatch,
    iam,
  }
}

/**
 * Assumes an IAM role for cross-account access
 * @param {string} roleArn - ARN of the role to assume
 * @param {string} externalId - External ID for the role (optional)
 * @returns {Promise<Object>} - Temporary credentials
 */
export const assumeRole = async (roleArn, externalId = null) => {
  try {
    const sts = new STSClient({ region: config.aws.region })

    const params = {
      RoleArn: roleArn,
      RoleSessionName: "CloudWiseSession",
      DurationSeconds: 3600, // 1 hour
    }

    if (externalId) {
      params.ExternalId = externalId
    }

    const command = new AssumeRoleCommand(params)
    const result = await sts.send(command)

    return {
      accessKeyId: result.Credentials.AccessKeyId,
      secretAccessKey: result.Credentials.SecretAccessKey,
      sessionToken: result.Credentials.SessionToken,
      expiration: result.Credentials.Expiration,
    }
  } catch (error) {
    logger.error("Error assuming AWS role:", error)
    throw error
  }
}

/**
 * Generates a read-only IAM policy for CloudWise
 * @returns {Object} - IAM policy document
 */
export const generateReadOnlyPolicy = () => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "ce:Get*",
          "ce:Describe*",
          "ce:List*",
          "ec2:Describe*",
          "rds:Describe*",
          "s3:Get*",
          "s3:List*",
          "cloudwatch:Get*",
          "cloudwatch:Describe*",
          "cloudwatch:List*",
          "tag:Get*",
        ],
        Resource: "*",
      },
    ],
  }
}

/**
 * Fetches cost and usage data from AWS Cost Explorer
 * @param {CostExplorerClient} costExplorer - AWS Cost Explorer client
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} granularity - Time granularity (DAILY, MONTHLY)
 * @returns {Promise<Object>} - Cost and usage data
 */
export const getCostAndUsage = async (costExplorer, startDate, endDate, granularity = "DAILY") => {
  try {
    const params = {
      TimePeriod: {
        Start: startDate,
        End: endDate,
      },
      Granularity: granularity,
      Metrics: ["UnblendedCost", "UsageQuantity"],
      GroupBy: [
        {
          Type: "DIMENSION",
          Key: "SERVICE",
        },
      ],
    }

    const command = new GetCostAndUsageCommand(params)
    const result = await costExplorer.send(command)
    return result
  } catch (error) {
    logger.error("Error fetching AWS cost and usage data:", error)
    throw error
  }
}

/**
 * Fetches EC2 instances with their utilization metrics
 * @param {EC2Client} ec2 - AWS EC2 client
 * @param {CloudWatchClient} cloudWatch - AWS CloudWatch client
 * @returns {Promise<Array>} - EC2 instances with utilization data
 */
export const getEC2InstancesWithUtilization = async (ec2, cloudWatch) => {
  try {
    // Get all EC2 instances
    const describeInstancesCommand = new DescribeInstancesCommand({})
    const instances = await ec2.send(describeInstancesCommand)

    const allInstances = []

    // Process each reservation
    for (const reservation of instances.Reservations) {
      for (const instance of reservation.Instances) {
        // Get CPU utilization for the instance
        const endTime = new Date()
        const startTime = new Date()
        startTime.setDate(startTime.getDate() - 14) // Last 14 days

        const metricParams = {
          MetricName: "CPUUtilization",
          Namespace: "AWS/EC2",
          Period: 86400, // 1 day in seconds
          StartTime: startTime,
          EndTime: endTime,
          Statistics: ["Average"],
          Dimensions: [
            {
              Name: "InstanceId",
              Value: instance.InstanceId,
            },
          ],
        }

        const metricCommand = new GetMetricStatisticsCommand(metricParams)
        const metricData = await cloudWatch.send(metricCommand)

        // Calculate average CPU utilization
        let avgCpuUtilization = 0
        if (metricData.Datapoints.length > 0) {
          const sum = metricData.Datapoints.reduce((acc, point) => acc + point.Average, 0)
          avgCpuUtilization = sum / metricData.Datapoints.length
        }

        // Get tags
        const tags = {}
        if (instance.Tags) {
          instance.Tags.forEach((tag) => {
            tags[tag.Key] = tag.Value
          })
        }

        // Add instance with utilization data
        allInstances.push({
          instanceId: instance.InstanceId,
          instanceType: instance.InstanceType,
          state: instance.State.Name,
          launchTime: instance.LaunchTime,
          availabilityZone: instance.Placement.AvailabilityZone,
          privateIpAddress: instance.PrivateIpAddress,
          publicIpAddress: instance.PublicIpAddress,
          tags,
          cpuUtilization: avgCpuUtilization,
        })
      }
    }

    return allInstances
  } catch (error) {
    logger.error("Error fetching EC2 instances with utilization:", error)
    throw error
  }
}

/**
 * Identifies idle EC2 instances based on CPU utilization
 * @param {Array} instances - EC2 instances with utilization data
 * @param {number} cpuThreshold - CPU utilization threshold (%)
 * @param {number} days - Number of days to consider
 * @returns {Array} - Idle EC2 instances
 */
export const identifyIdleEC2Instances = (instances, cpuThreshold = 10, days = 7) => {
  const now = new Date()
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return instances.filter((instance) => {
    // Check if instance is running
    if (instance.state !== "running") {
      return false
    }

    // Check if instance is older than the cutoff date
    const launchTime = new Date(instance.launchTime)
    if (launchTime > cutoffDate) {
      return false
    }

    // Check if CPU utilization is below threshold
    return instance.cpuUtilization < cpuThreshold
  })
}

/**
 * Fetches unattached EBS volumes
 * @param {EC2Client} ec2 - AWS EC2 client
 * @returns {Promise<Array>} - Unattached EBS volumes
 */
export const getUnattachedEBSVolumes = async (ec2) => {
  try {
    const command = new DescribeVolumesCommand({
      Filters: [
        {
          Name: "status",
          Values: ["available"],
        },
      ],
    })

    const volumes = await ec2.send(command)

    return volumes.Volumes.map((volume) => {
      // Get tags
      const tags = {}
      if (volume.Tags) {
        volume.Tags.forEach((tag) => {
          tags[tag.Key] = tag.Value
        })
      }

      return {
        volumeId: volume.VolumeId,
        size: volume.Size,
        volumeType: volume.VolumeType,
        createTime: volume.CreateTime,
        availabilityZone: volume.AvailabilityZone,
        state: volume.State,
        iops: volume.Iops,
        tags,
      }
    })
  } catch (error) {
    logger.error("Error fetching unattached EBS volumes:", error)
    throw error
  }
}

/**
 * Fetches RDS instances with their utilization metrics
 * @param {RDSClient} rds - AWS RDS client
 * @param {CloudWatchClient} cloudWatch - AWS CloudWatch client
 * @returns {Promise<Array>} - RDS instances with utilization data
 */
export const getRDSInstancesWithUtilization = async (rds, cloudWatch) => {
  try {
    // Get all RDS instances
    const command = new DescribeDBInstancesCommand({})
    const instances = await rds.send(command)

    const allInstances = []

    // Process each instance
    for (const instance of instances.DBInstances) {
      // Get CPU utilization for the instance
      const endTime = new Date()
      const startTime = new Date()
      startTime.setDate(startTime.getDate() - 14) // Last 14 days

      const cpuParams = {
        MetricName: "CPUUtilization",
        Namespace: "AWS/RDS",
        Period: 86400, // 1 day in seconds
        StartTime: startTime,
        EndTime: endTime,
        Statistics: ["Average"],
        Dimensions: [
          {
            Name: "DBInstanceIdentifier",
            Value: instance.DBInstanceIdentifier,
          },
        ],
      }

      const connectionParams = {
        MetricName: "DatabaseConnections",
        Namespace: "AWS/RDS",
        Period: 86400, // 1 day in seconds
        StartTime: startTime,
        EndTime: endTime,
        Statistics: ["Average"],
        Dimensions: [
          {
            Name: "DBInstanceIdentifier",
            Value: instance.DBInstanceIdentifier,
          },
        ],
      }

      const cpuCommand = new GetMetricStatisticsCommand(cpuParams)
      const connectionCommand = new GetMetricStatisticsCommand(connectionParams)

      const cpuData = await cloudWatch.send(cpuCommand)
      const connectionData = await cloudWatch.send(connectionCommand)

      // Calculate average CPU utilization and connections
      let avgCpuUtilization = 0
      if (cpuData.Datapoints.length > 0) {
        const sum = cpuData.Datapoints.reduce((acc, point) => acc + point.Average, 0)
        avgCpuUtilization = sum / cpuData.Datapoints.length
      }

      let avgConnections = 0
      if (connectionData.Datapoints.length > 0) {
        const sum = connectionData.Datapoints.reduce((acc, point) => acc + point.Average, 0)
        avgConnections = sum / connectionData.Datapoints.length
      }

      // Add instance with utilization data
      allInstances.push({
        instanceId: instance.DBInstanceIdentifier,
        instanceClass: instance.DBInstanceClass,
        engine: instance.Engine,
        engineVersion: instance.EngineVersion,
        status: instance.DBInstanceStatus,
        allocatedStorage: instance.AllocatedStorage,
        multiAZ: instance.MultiAZ,
        cpuUtilization: avgCpuUtilization,
        connections: avgConnections,
      })
    }

    return allInstances
  } catch (error) {
    logger.error("Error fetching RDS instances with utilization:", error)
    throw error
  }
}

/**
 * Identifies oversized RDS instances based on CPU utilization and connections
 * @param {Array} instances - RDS instances with utilization data
 * @param {number} cpuThreshold - CPU utilization threshold (%)
 * @param {number} connectionThreshold - Connection threshold
 * @returns {Array} - Oversized RDS instances
 */
export const identifyOversizedRDSInstances = (instances, cpuThreshold = 30, connectionThreshold = 5) => {
  return instances.filter((instance) => {
    // Check if instance is available
    if (instance.status !== "available") {
      return false
    }

    // Check if CPU utilization is below threshold and connections are low
    return instance.cpuUtilization < cpuThreshold && instance.connections < connectionThreshold
  })
}
