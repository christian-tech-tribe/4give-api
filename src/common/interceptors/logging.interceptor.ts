import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CallHandler } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
  
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`After... ${Date.now() - now}ms`)),
      );
  }
}