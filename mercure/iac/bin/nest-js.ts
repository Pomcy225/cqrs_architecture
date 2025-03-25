#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NestJsStack } from '../lib/nest-js-stack';

const app = new cdk.App();
// Read the environment from context
const environment = String(app.node.tryGetContext('environment')).toLowerCase();
const appName = app.node.tryGetContext('appName');

// Create a dynamic stack name
const stackName = `${appName}-${environment}`;

new NestJsStack(app, stackName, {});

cdk.Tags.of(app).add('Environment', environment);
