import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [UsersModule, JwtModule],
})
export class CustomersModule {}
