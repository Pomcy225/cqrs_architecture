import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ApiResponseService } from 'src/utils/response_api/api_response_service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('devise pour front-end')
@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(
    private readonly exchangeRateService: ExchangeRateService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @Get()
  async getRates(@Query('currencies') currencies: string): Promise<any> {
    const currencyArray = currencies ? currencies.split(',') : ['EUR', 'XOF'];
    return this.exchangeRateService.getExchangeRates(currencyArray);
  }

  @Get('getRate')
  async getRate(){
    const data = this.exchangeRateService.getDevise();
    return data
  }
}
