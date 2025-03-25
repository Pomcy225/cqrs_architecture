#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const nest_js_stack_1 = require("../lib/nest-js-stack");
const app = new cdk.App();
const environment = String(app.node.tryGetContext('environment')).toLowerCase();
const appName = app.node.tryGetContext('appName');
const stackName = `${appName}-${environment}`;
new nest_js_stack_1.NestJsStack(app, stackName, {});
cdk.Tags.of(app).add('Environment', environment);
//# sourceMappingURL=nest-js.js.map