import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from './common/exception-filter';
// import { ResultInterceptor } from './common/result-interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new ResultInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useBodyParser('json', { limit: '10mb' });

  const options = new DocumentBuilder()
    .setTitle('4Give API')
    .setDescription('Those API provider a way to manage 4Give users')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('api', app, document);

  app.use(helmet());

  let port = process.env.BACKEND_PORT || 3000;
  console.log("Microservice is listening on", port)
  await app.listen(port);
}
bootstrap();
