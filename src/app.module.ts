import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { EmployeesModule } from './modules/employees/employees.module';
import { CustomersModule } from './modules/customers/customers.module';
import { UsersModule } from './modules/users/users.module';
import { LogMiddleware } from './common/middlewares/log.middleware';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmployeesModule,
    CustomersModule,
    UsersModule,
    CommonModule,
  ],

  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogMiddleware)
      .forRoutes({ path: '/employees/*', method: RequestMethod.ALL });
  }
}
