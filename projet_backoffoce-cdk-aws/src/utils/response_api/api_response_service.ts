import { Injectable, HttpStatus } from '@nestjs/common';
@Injectable()
export class ApiResponseService {
  private statusCode: number = HttpStatus.OK;
  private message: string = 'Operation effectuée avec succès';
  setStatusCode(statusCode: number): this {
    this.statusCode = statusCode;
    return this;
  }
  getStatusCode(): number {
    return this.statusCode;
  }
  setMessage(message: string): this {
    this.message = message;
    return this;
  }
  getMessage(): string {
    return this.message;
  }
  getPaginate(data: any) {
    return data;
  }

  response(data: any = null, additionalHeaders: Record<string, string> = {}) {
    const response = {
      status: this.statusCode,
      message: this.message,
      data: data || [],
    };
    return response;
  }



  responseError(
    errorMessage: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return this.setStatusCode(statusCode).setMessage(errorMessage).response();
  }
  responseTrue(data: any = null) {
    return this.response(data);
  }
}
