import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExchangeRateService {
  private readonly apiUrl = this.configService.get<string>('URL_DEVISE');

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.loadCurrencies();
  }

  private loadCurrencies() {
    const filePath = path.join(
      __dirname,

      '../../../../src/assets/',
      'rates.json',
    );

    try {
      if (!fs.existsSync(filePath)) {
        console.warn(
          'Fichier de devises introuvable, aucun chargement effectué.',
        );
        return;
      }

      const data = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors du chargement des devises :', error.message);
    }
  }
  async getDevise() {
    const filePath = path.join(
      __dirname,

      '../../../../src/assets/',
      'rates.json',
    );

    try {
      if (!fs.existsSync(filePath)) {
        console.warn(
          'Fichier de devises introuvable, aucun chargement effectué.',
        );
        return;
      }

      const data = fs.readFileSync(filePath, 'utf8');
      const result = JSON.parse(data);
      return {
        statusCode: 200,
        data: result,
      };
    } catch (error) {
      console.error('Erreur lors du chargement des devises :', error.message);
    }
  }
  async getExchangeRates(currencies: string[]): Promise<any> {
    const params = {
      access_key: this.configService.get<string>('ACCESS_KEY'),
      currencies: currencies.join(','),
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(this.apiUrl, { params }),
      );
      if (!response.data) {
        throw new InternalServerErrorException(
          'Données vides reçues depuis l’API.',
        );
      }
      return response.data;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des taux de change :',
        error.message,
      );
      throw new Error(`Failed to fetch exchange rates: ${error.message}`);
    }
  }

  async calculateExchangeRate(data: any): Promise<any> {
    if (!data || !data.usd_xof || !data.usd_eur) {
      throw new Error('Données invalides pour le calcul des taux de change.');
    }

    const eur_xof = data.usd_xof / data.usd_eur;
    return {
      eur_xof,
      usd_xof: data.usd_xof,
    };
  }

  private saveRatesToFile(rates: any) {
    const filePath = path.join(
      __dirname,

      '../../../../src/assets/',
      'rates.json',
    );

    try {
      fs.writeFileSync(filePath, JSON.stringify(rates, null, 2), 'utf8');
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des taux de change :",
        error.message,
      );
    }
  }

  // Tâche cron qui se déclenche à 9h55, 14h55 et 20h55 du lundi au vendredi
  @Cron('7 9,14,21 * * 1-5') // Format CRON : minute heure jour mois jour-semaine
  async handleCron() {
    const currencies = ['EUR', 'XOF'];

    try {
      const rates = await this.getExchangeRates(currencies);

      const usd_xof = rates.quotes.USDXOF;
      const usd_eur = rates.quotes.USDEUR;

      const data = await this.calculateExchangeRate({ usd_xof, usd_eur });
      this.saveRatesToFile(data);
    } catch (error) {
      console.error(
        'Erreur lors de l’exécution de la tâche cron :',
        error.message,
      );
    }
  }
}
