  import { Injectable } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import * as http from 'http';
  import * as querystring from 'querystring';

  @Injectable()
  export class MercureService {
    private hubUrl: string;
    private jwtToken: string;

    constructor(private readonly configService: ConfigService) {
      this.hubUrl = 'https://148.113.143.59:8091/.well-known/mercure';
      this.jwtToken = this.configService.get('MERCURE_HUB_JWT_KEY');
    }

    async publishNotification(topic: string, data: any) {

      const token = this.configService.get('MERCURE_HUB_JWT_KEY');

      if (!token) {
        throw new Error('JWT token is missing');
      }

      try {
      

        const postData = querystring.stringify({
          topic: topic,
          data: JSON.stringify(data),
        });

        const options = {
          hostname: '148.113.143.59',
          port: 8091,
          path: '/.well-known/mercure',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
          },
        };

        const req = http.request(options, (res) => {
         
          let responseBody = '';

          res.on('data', (chunk) => {
            responseBody += chunk;
          });

          res.on('end', () => {
            console.log(
              '[publishNotification] Response received:',
              responseBody,
            );
          });
        });

        req.on('error', (error) => {
          console.error('[publishNotification] HTTP request error:', error);
        });

        req.write(postData);
        req.end();
        console.log('[publishNotification] Notification sent successfully');
      } catch (error) {
        console.error('[publishNotification] Error:', error);
        throw error;
      }
    }
  }



