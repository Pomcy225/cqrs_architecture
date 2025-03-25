"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkUtils = void 0;
const cdk = require("aws-cdk-lib");
const ssm = require("aws-cdk-lib/aws-ssm");
class CdkUtils {
    static getEnvironment(scope) {
        return CdkUtils.getVariableFromScope(scope, 'environment', 'dev').toLowerCase();
    }
    static getVariableFromScope(scope, variablename, defaultValue) {
        let current = scope;
        while (current && !(current instanceof cdk.Stack)) {
            current = current.node.scope;
        }
        if (current && current instanceof cdk.Stack) {
            const variableValue = current.node.tryGetContext(variablename);
            if (variableValue) {
                return String(variableValue);
            }
        }
        return defaultValue;
    }
    static formatId(scope, id) {
        const environment = this.getEnvironment(scope);
        return `${id}-${environment}`.substring(0, 52);
    }
    static createSsmParameter(scope, name, value) {
        return new ssm.StringParameter(scope, `SSMParam${name}`, {
            parameterName: `/${CdkUtils.LEBEDOO}/${this.getEnvironment(scope)}/${name}`,
            stringValue: value,
        });
    }
    static getRegion(scope) {
        return CdkUtils.getVariableFromScope(scope, 'aws_region', '').toLowerCase();
    }
}
exports.CdkUtils = CdkUtils;
CdkUtils.LEBEDOO = 'mercure';
//# sourceMappingURL=cdk-utils.js.map