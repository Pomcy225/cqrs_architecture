"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestJsStack = void 0;
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const ecr = require("aws-cdk-lib/aws-ecr");
const ecrdeploy = require("cdk-ecr-deployment");
const assets = require("aws-cdk-lib/aws-ecr-assets");
const iam = require("aws-cdk-lib/aws-iam");
const logs = require("aws-cdk-lib/aws-logs");
const cdk_utils_1 = require("./cdk-utils");
const path = require("path");
const fs = require("fs");
const apigatewayv2 = require("@aws-cdk/aws-apigatewayv2-alpha");
const apigatewayv2Integrations = require("@aws-cdk/aws-apigatewayv2-integrations-alpha");
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
class NestJsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const environment = cdk_utils_1.CdkUtils.getEnvironment(this);
        const envConfig = this.node.tryGetContext('environments')[environment];
        const appName = this.node.tryGetContext('appName');
        const vpc_Id = `lebedoo-${environment}-vpc-id`;
        const importedVpcId = cdk.Fn.importValue(vpc_Id);
        const privateSubnets = cdk.Fn.split(',', cdk.Fn.importValue(`lebedoo-${environment}-vpc-private-subnets`));
        const publicSubnets = cdk.Fn.split(',', cdk.Fn.importValue(`lebedoo-${environment}-vpc-public-subnets`));
        const availabilityZones = cdk.Fn.split(',', cdk.Fn.importValue(`lebedoo-${environment}-vpc-azs`));
        const vpc = ec2.Vpc.fromVpcAttributes(this, 'LebedooImportedVpc', {
            vpcId: importedVpcId,
            availabilityZones: availabilityZones,
            privateSubnetIds: privateSubnets,
            publicSubnetIds: publicSubnets,
        });
        const importedClusterName = cdk.Fn.importValue(`lebedoo-${environment}-ecs-cluster-name`);
        const cluster = ecs.Cluster.fromClusterAttributes(this, 'LebedooImportedCluster', {
            clusterName: importedClusterName,
            vpc: vpc,
            securityGroups: [],
        });
        const existingRepoName = `${appName.toLowerCase()}-${environment}`;
        const ecrRepository = ecr.Repository.fromRepositoryName(this, cdk_utils_1.CdkUtils.formatId(this, existingRepoName), existingRepoName);
        const imageTag = new Date()
            .toISOString()
            .split('.')[0]
            .replace(/[:\-]/g, '');
        const dockerfilePath = path.join(path.join(__dirname, '../../'), 'Dockerfile');
        fs.copyFileSync(path.join(__dirname, '../docker/Dockerfile'), dockerfilePath);
        const dockerImage = new assets.DockerImageAsset(this, 'DockerImage', {
            directory: path.join(__dirname, '../../'),
            buildArgs: {
                NODE_ENV: environment,
                START_COMMAND: environment === 'prod' ? 'start:prod' : 'start:dev',
            },
        });
        new ecrdeploy.ECRDeployment(this, cdk_utils_1.CdkUtils.formatId(this, `${appName}-docker-image`), {
            src: new ecrdeploy.DockerImageName(dockerImage.imageUri),
            dest: new ecrdeploy.DockerImageName(`${ecrRepository.repositoryUri}:${imageTag}`),
        });
        const taskRole = new iam.Role(this, cdk_utils_1.CdkUtils.formatId(this, `${appName}-TaskRole`), {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        });
        taskRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMReadOnlyAccess'));
        const sqsPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['sqs:*'],
            resources: [
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
        taskRole.addToPolicy(new iam.PolicyStatement({
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
        }));
        const taskDefinition = new ecs.FargateTaskDefinition(this, cdk_utils_1.CdkUtils.formatId(this, `${appName}-TaskDef`), {
            memoryLimitMiB: envConfig.service.memoryLimit || 512,
            cpu: envConfig.service.cpu || 256,
            taskRole: taskRole,
        });
        const environmentVariables = {
            NODE_ENV: environment,
        };
        if (envConfig.config) {
            Object.entries(envConfig.config).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    environmentVariables[key] = value;
                }
                else {
                    environmentVariables[key] = JSON.stringify(value);
                }
            });
        }
        const containerName = cdk_utils_1.CdkUtils.formatId(this, `${appName}-Container`);
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
                    'curl -f http://localhost:3000/health || exit 1',
                ],
                interval: cdk.Duration.seconds(60),
                timeout: cdk.Duration.seconds(10),
                retries: 3,
                startPeriod: cdk.Duration.seconds(120),
            },
        });
        container.addPortMappings({
            containerPort: 3000,
            protocol: ecs.Protocol.TCP,
        });
        const serviceSecurityGroup = new ec2.SecurityGroup(this, 'ServiceSecurityGroup', {
            vpc,
            allowAllOutbound: true,
            description: `Security group for ${appName}`,
        });
        const loadBalancer = new elbv2.ApplicationLoadBalancer(this, `${appName}-ServiceALB`, {
            vpc,
            internetFacing: false,
        });
        const albListener = loadBalancer.addListener(`${appName}-ServiceListener`, {
            port: 80,
            open: true,
        });
        const albSecurityGroup = new ec2.SecurityGroup(this, `${appName}-ALBSecurityGroup`, {
            vpc,
            allowAllOutbound: true,
            description: 'Security group for the ALB',
        });
        albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic from the Internet');
        serviceSecurityGroup.addIngressRule(albSecurityGroup, ec2.Port.tcp(3000), 'Allow traffic from ALB to ECS tasks');
        const service = new ecs.FargateService(this, cdk_utils_1.CdkUtils.formatId(this, `${appName}-Service`), {
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
        });
        const scaling = service.autoScaleTaskCount({
            minCapacity: envConfig.service.minCapacity || 1,
            maxCapacity: envConfig.service.maxCapacity || 10,
        });
        scaling.scaleOnCpuUtilization('CpuScaling', {
            targetUtilizationPercent: 80,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(60),
        });
        scaling.scaleOnMemoryUtilization('MemoryScaling', {
            targetUtilizationPercent: 80,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(60),
        });
        const targetGroup = albListener.addTargets(`${appName}-ServiceTargetGroup`, {
            port: 80,
            targets: [service.loadBalancerTarget({
                    containerName: containerName,
                    containerPort: 3000,
                })],
            healthCheck: {
                path: '/health',
                interval: cdk.Duration.seconds(60),
                timeout: cdk.Duration.seconds(10),
                healthyThresholdCount: 2,
                unhealthyThresholdCount: 3,
            },
        });
        const api = new apigatewayv2.HttpApi(this, `${appName}-ApiGateway`, {
            apiName: `${appName}-${environment}-api`,
            description: `API Gateway for ${appName} service in ${environment}`,
            corsPreflight: {
                allowOrigins: ['*'],
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
        const vpcLink = new apigatewayv2.VpcLink(this, `${appName}-${environment}-VpcLink`, {
            vpc,
            subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        });
        api.addRoutes({
            path: '/{proxy+}',
            methods: [apigatewayv2.HttpMethod.ANY],
            integration: new apigatewayv2Integrations.HttpAlbIntegration(`${appName}-${environment}-AlbIntegration`, albListener, {
                vpcLink,
            }),
        });
        new cdk.CfnOutput(this, 'ApiGatewayUrl', {
            value: api.apiEndpoint,
            description: 'API Gateway URL for the service',
        });
        new cdk.CfnOutput(this, 'EnvironmentVariables', {
            value: JSON.stringify(environmentVariables, null, 2),
            description: 'Environment variables passed to the container',
        });
    }
}
exports.NestJsStack = NestJsStack;
//# sourceMappingURL=nest-js-stack.js.map