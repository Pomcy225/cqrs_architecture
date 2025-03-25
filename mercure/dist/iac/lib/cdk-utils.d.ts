import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
export declare class CdkUtils {
    static LEBEDOO: string;
    static getEnvironment(scope: Construct): string;
    private static getVariableFromScope;
    static formatId(scope: Construct, id: string): string;
    static createSsmParameter(scope: Construct, name: string, value: string): ssm.StringParameter;
    static getRegion(scope: Construct): string;
}
