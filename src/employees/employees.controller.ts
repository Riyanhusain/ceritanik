import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpCode,
  UseFilters,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Response } from 'express';
import { Employees } from '@prisma/client';
import { ValidationError } from 'class-validator';
import { ValidationFilter } from 'src/validation/validation.filter';
import { TimeInterceptor } from 'src/time/time.interceptor';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseInterceptors(TimeInterceptor)
  public async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Res() response: Response,
  ) {
    const employee =
      await this.employeesService.createEmployee(createEmployeeDto);
    return response.status(HttpStatus.OK).json({ employee });
  }
  @Get()
  @HttpCode(200)
  public async findAll(): Promise<Employees> {
    return await this.employeesService.findAllEmployees();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOneEmployee(+id);
  }

  @Patch(':id')
  public async updateEmployee(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.employeesService.updateEmployee(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
