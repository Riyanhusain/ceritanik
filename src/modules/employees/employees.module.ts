import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [UsersModule],
})
export class EmployeesModule {}
