import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { ConfigModule } from '@nestjs/config';
import { repositoryProviders } from '../database/repository.providers';
import { DatabaseModule } from '../database/database.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { UsersController } from 'src/users/users.controller';

@Module({
  controllers: [NoteController],
  imports: [DatabaseModule, ConfigModule],
  providers: [
    ...repositoryProviders,
    NoteService
  ]
})
export class NoteModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
