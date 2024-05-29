import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { UserSchema } from './schema/user.schema';
import { ConfigModule } from '@nestjs/config';
// import { DocumentsModule } from 'src/documents/documents.module';
// import { RabbitModule } from 'src/rabbit/rabbit.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
        ]),
        ConfigModule,
        // RabbitModule,
        // DocumentsModule
    ],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(UsersController);
    }
}
