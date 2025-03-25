import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { Client } from 'pg';

@Injectable()
export class DBUtil {
  private secretsManager: SecretsManagerClient;
  private ssm: SSMClient;
  private environment: string;

  constructor(private configService: ConfigService) {
    this.secretsManager = new SecretsManagerClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.ssm = new SSMClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.environment = this.configService.get<string>('ENVIRONMENT');
  }

  private async getSSMParameter(paramName: string): Promise<string> {
    const response = await this.ssm.send(
      new GetParameterCommand({
        Name: `/lebedoo/${this.environment}/${paramName}`,
        WithDecryption: true,
      }),
    );
    return response.Parameter!.Value!;
  }

  private async getConnectionConfig(prefix: string): Promise<any> {
    try {
      // Récupère les paramètres SSM
      const [credentialsArn, proxyEndpoint, dbName, port] = await Promise.all([
        this.getSSMParameter(`${prefix}/rds-secret-arn`),
        this.getSSMParameter(`${prefix}/rds-proxy-endpoint`),
        this.getSSMParameter(`${prefix}/rds-db-name`),
        this.getSSMParameter(`${prefix}/rds-db-port`),
      ]);

      // Récupère le secret depuis Secrets Manager
      const secretResponse = await this.secretsManager.send(
        new GetSecretValueCommand({ SecretId: credentialsArn }),
      );
      const { username, password } = JSON.parse(secretResponse.SecretString!);

      return {
        host: proxyEndpoint,
        port: +port,
        user: username,
        password: password,
        database: dbName,
        ssl: {
          rejectUnauthorized: false, // SSL requis pour RDS Proxy
        },
      };
    } catch (error) {
      console.error(
        'Erreur de configuration de la connexion à la base de données:',
        error,
      );
      throw error;
    }
  }

  private async query(
    prefix: string,
    text: string,
    params?: any[],
  ): Promise<any> {
    const config = await this.getConnectionConfig(prefix);
    const client = new Client(config);

    try {
      await client.connect();
      const result = await client.query(text, params);
      return result;
    } finally {
      await client.end();
    }
  }

  public async placeServiceQuery(text: string, params?: any[]): Promise<any> {
    return await this.query('place-service', text, params);
  }

  public async loyaltyServiceQuery(text: string, params?: any[]): Promise<any> {
    return await this.query('loyalty-service', text, params);
  }

  public async bedooMallServiceQuery(
    text: string,
    params?: any[],
  ): Promise<any> {
    return await this.query('bedoo-mall-service', text, params);
  }

  public async adminServiceQuery(text: string, params?: any[]): Promise<any> {
    return await this.query('admin-access-mgmt', text, params);
  }

  public async endUserServiceQuery(text: string, params?: any[]): Promise<any> {
    return await this.query('end-user-service', text, params);
  }

  public async walletServiceQuery(text: string, params?: any[]): Promise<any> {
    return await this.query('wallet-transaction-service', text, params);
  }

}
