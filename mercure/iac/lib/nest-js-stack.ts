import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecrdeploy from 'cdk-ecr-deployment';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { CdkUtils } from './cdk-utils';
import * as path from 'path';
import * as fs from 'fs';

// To integrate an app with APIgateway
// Step 1. Add the dependencies. Please add it to package.json as well
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigatewayv2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class NestJsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const environment = CdkUtils.getEnvironment(this);
    const envConfig = this.node.tryGetContext('environments')[environment];
    const appName = this.node.tryGetContext('appName');

    const vpc_Id = `lebedoo-${environment}-vpc-id`;
    const importedVpcId = cdk.Fn.importValue(vpc_Id);

    const privateSubnets = cdk.Fn.split(
      ',',
      cdk.Fn.importValue(`lebedoo-${environment}-vpc-private-subnets`),
    );
    const publicSubnets = cdk.Fn.split(
      ',',
      cdk.Fn.importValue(`lebedoo-${environment}-vpc-public-subnets`),
    );
    const availabilityZones = cdk.Fn.split(
      ',',
      cdk.Fn.importValue(`lebedoo-${environment}-vpc-azs`),
    );

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'LebedooImportedVpc', {
      vpcId: importedVpcId,
      availabilityZones: availabilityZones,
      privateSubnetIds: privateSubnets,
      publicSubnetIds: publicSubnets,
    });

    const importedClusterName = cdk.Fn.importValue(
      `lebedoo-${environment}-ecs-cluster-name`,
    );
    const cluster = ecs.Cluster.fromClusterAttributes(
      this,
      'LebedooImportedCluster',
      {
        clusterName: importedClusterName,
        vpc: vpc,
        securityGroups: [],
      },
    );

    const existingRepoName = `${appName.toLowerCase()}-${environment}`;
    const ecrRepository = ecr.Repository.fromRepositoryName(
      this,
      CdkUtils.formatId(this, existingRepoName),
      existingRepoName,
    );

    // Generate image tag based on timestamp
    const imageTag = new Date()
      .toISOString()
      .split('.')[0]
      .replace(/[:\-]/g, '');

    const dockerfilePath = path.join(
      path.join(__dirname, '../../'),
      'Dockerfile',
    );

    // Copy Dockerfile from iac/docker to root
    fs.copyFileSync(
      path.join(__dirname, '../docker/Dockerfile'),
      dockerfilePath,
    );
    const dockerImage = new assets.DockerImageAsset(this, 'DockerImage', {
      directory: path.join(__dirname, '../../'),
      buildArgs: {
        NODE_ENV: environment,
        START_COMMAND: environment === 'prod' ? 'start:prod' : 'start:dev',
      },
    });

    // Deploy Docker image to ECR
    new ecrdeploy.ECRDeployment(
      this,
      CdkUtils.formatId(this, `${appName}-docker-image`),
      {
        src: new ecrdeploy.DockerImageName(dockerImage.imageUri),
        dest: new ecrdeploy.DockerImageName(
          `${ecrRepository.repositoryUri}:${imageTag}`,
        ),
      },
    );
    // Create Task Role with permissions
    const taskRole = new iam.Role(
      this,
      CdkUtils.formatId(this, `${appName}-TaskRole`),
      {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      },
    );

    // Add SSM permissions
    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMReadOnlyAccess'),
    );

    // SQS permissions
    const sqsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sqs:*'],
      resources: [
        // Grant access to all SQS queues in all regions
        'arn:aws:sqs:*:*:*',
      ],
    });
    taskRole.addToPolicy(sqsPolicy);
    const dynamoDbPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:UpdateItem',
        'dynamodb:BatchGetItem',
        'dynamodb:BatchWriteItem',
      ],
      resources: ['arn:aws:dynamodb:*:*:table/*'],
    });
    taskRole.addToPolicy(dynamoDbPolicy);

    const rdsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'rds-db:connect',
        'rds:DescribeDBInstances',
        'rds:Query',
        'rds:Execute',
        'rds-data:BatchExecuteStatement',
        'rds-data:BeginTransaction',
        'rds-data:CommitTransaction',
        'rds-data:ExecuteStatement',
        'rds-data:RollbackTransaction',
      ],
      resources: [`*`],
    });
    taskRole.addToPolicy(rdsPolicy);

    const secretsManagerPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'secretsmanager:GetSecretValue',
        'secretsmanager:DescribeSecret',
      ],
      resources: [`*`],
    });
    taskRole.addToPolicy(secretsManagerPolicy);

    // Add SSM Parameter Store permissions with more specific resource pattern
    const ssmPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ssm:GetParameters',
        'ssm:GetParameter',
        'ssm:GetParametersByPath',
      ],
      resources: [`arn:aws:ssm:*:*:parameter/*`],
    });
    taskRole.addToPolicy(ssmPolicy);

    // allows connection ecs container through 'aws ecs execute-command' command
    taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecs:ExecuteCommand',
          'ssm:SendCommand',
          'ssm:GetCommandInvocation',
          'ssmmessages:CreateControlChannel',
          'ssmmessages:CreateDataChannel',
          'ssmmessages:OpenControlChannel',
          'ssmmessages:OpenDataChannel',
          'ssm:UpdateInstanceInformation',
          'ssm:StartSession',
          'ec2:DescribeInstances',
          'ec2:CreateNetworkInterface',
          'ec2:DescribeNetworkInterfaces',
          'ec2:DeleteNetworkInterface',
          'ecs:DescribeTasks',
        ],
        resources: ['*'],
      }),
    );

    // Task Definition with dynamic environment variables
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      CdkUtils.formatId(this, `${appName}-TaskDef`),
      {
        memoryLimitMiB: envConfig.service.memoryLimit || 512,
        cpu: envConfig.service.cpu || 256,
        taskRole: taskRole,
      },
    );

    // Dynamically build environment variables from config
    const environmentVariables: { [key: string]: string } = {
      NODE_ENV: environment,
    };

    // Add all config variables from cdk.json automatically
    if (envConfig.config) {
      Object.entries(envConfig.config).forEach(([key, value]) => {
        if (typeof value === 'string') {
          environmentVariables[key] = value;
        } else {
          // Handle non-string values by converting them to strings
          environmentVariables[key] = JSON.stringify(value);
        }
      });
    }

    // Step 2. Create a variable of containerName to be passed to target group
    const containerName = CdkUtils.formatId(this, `${appName}-Container`);

    // Add container to task definition with dynamic environment variables
    const container = taskDefinition.addContainer(containerName, {
      image: ecs.ContainerImage.fromEcrRepository(ecrRepository, imageTag),
      logging: new ecs.AwsLogDriver({
        streamPrefix: appName,
        logRetention: logs.RetentionDays.THREE_DAYS,
      }),
      environment: environmentVariables,
      command: ['npm', 'run', `start:${environment}`],
      healthCheck: {
        command: [
          'CMD-SHELL',
          'curl -f http://localhost:3000/health || exit 1', // Adjust the health check endpoint according to your app
        ],
        interval: cdk.Duration.seconds(60), // How often to perform the health check
        timeout: cdk.Duration.seconds(10), // How long to wait for health check
        retries: 3, // Number of retries before marking unhealthy
        startPeriod: cdk.Duration.seconds(120), // Grace period for startup
      },
    });

    container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // Create Security Group
    const serviceSecurityGroup = new ec2.SecurityGroup(
      this,
      'ServiceSecurityGroup',
      {
        vpc,
        allowAllOutbound: true,
        description: `Security group for ${appName}`,
      },
    );

    // To integrate an app with APIgateway
    // Step 1. Create the Application Load Balancer (ALB)
    const loadBalancer = new elbv2.ApplicationLoadBalancer(
      this,
      `${appName}-ServiceALB`,
      {
        vpc,
        internetFacing: false,
      },
    );

    // Add a listener to the ALB
    const albListener = loadBalancer.addListener(`${appName}-ServiceListener`, {
      port: 80,
      open: true,
    });

    const albSecurityGroup = new ec2.SecurityGroup(
      this,
      `${appName}-ALBSecurityGroup`,
      {
        vpc,
        allowAllOutbound: true, // Allow outgoing traffic
        description: 'Security group for the ALB',
      },
    );

    // Allow HTTP traffic from the internet to the ALB
    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic from the Internet',
    );

    serviceSecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(3000),
      'Allow traffic from ALB to ECS tasks',
    );

    // Create Fargate Service
    const service = new ecs.FargateService(
      this,
      CdkUtils.formatId(this, `${appName}-Service`),
      {
        cluster,
        taskDefinition,
        desiredCount: envConfig.service.desiredCount || 2,
        assignPublicIp: false,
        securityGroups: [serviceSecurityGroup],
        enableExecuteCommand: true,
        circuitBreaker: {
          enable: true,
          rollback: true,
        },
        deploymentController: {
          type: ecs.DeploymentControllerType.ECS,
        },
        minHealthyPercent: 50,
        maxHealthyPercent: 200,
        healthCheckGracePeriod: cdk.Duration.seconds(180),
      },
    );

    // Setup Auto Scaling
    const scaling = service.autoScaleTaskCount({
      minCapacity: envConfig.service.minCapacity || 1,
      maxCapacity: envConfig.service.maxCapacity || 10,
    });

    // CPU utilization scaling
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // Memory utilization scaling
    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // Step 4. Add the Taret group and API gateway
    // Add the ECS Fargate service as a target group for the listener
    const targetGroup = albListener.addTargets(
      `${appName}-ServiceTargetGroup`,
      {
        port: 80, // Forward traffic to this port on the ECS tasks
        targets: [
          service.loadBalancerTarget({
            containerName: containerName,
            containerPort: 3000, // The port exposed by your container
          }),
        ],
        healthCheck: {
          path: '/health', // Adjust to your application's health check endpoint
          interval: cdk.Duration.seconds(60),
          timeout: cdk.Duration.seconds(10),
          healthyThresholdCount: 2,
          unhealthyThresholdCount: 3,
        },
      },
    );

    // Create API Gateway
    const api = new apigatewayv2.HttpApi(this, `${appName}-ApiGateway`, {
      apiName: `${appName}-${environment}-api`,
      description: `API Gateway for ${appName} service in ${environment}`,
      corsPreflight: {
        allowOrigins: ['*'], // Replace '*' with specific origins for better security
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.PUT,
          apigatewayv2.CorsHttpMethod.DELETE,
        ],
        allowHeaders: ['Authorization', 'Content-Type'],
        maxAge: cdk.Duration.days(10),
      },
    });

    // Create a VPC Link for API Gateway to connect to ECS service
    const vpcLink = new apigatewayv2.VpcLink(
      this,
      `${appName}-${environment}-VpcLink`,
      {
        vpc,
        subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
    );

    // Add integration to API Gateway
    api.addRoutes({
      path: '/{proxy+}', // Proxy all requests
      methods: [apigatewayv2.HttpMethod.ANY], // Allow all HTTP methods
      integration: new apigatewayv2Integrations.HttpAlbIntegration(
        `${appName}-${environment}-AlbIntegration`,
        albListener,
        {
          vpcLink,
        },
      ),
    });

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.apiEndpoint,
      description: 'API Gateway URL for the service',
    });

    // Output the environment variables for verification
    new cdk.CfnOutput(this, 'EnvironmentVariables', {
      value: JSON.stringify(environmentVariables, null, 2),
      description: 'Environment variables passed to the container',
    });
  }
}
