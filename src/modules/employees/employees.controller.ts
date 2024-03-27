import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employees } from '@prisma/client';
import { ValidationEmployeePipe } from 'src/common/pipes/validationEmployeePipe.pipe';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  @Post()
  public async createEmployee(
    @Body(ValidationEmployeePipe) createEmployeeDto: CreateEmployeeDto,
  ): Promise<HttpException> {
    return await this.employeesService.createEmployee(createEmployeeDto);
  }
  @Get()
  public async findAll(): Promise<Employees[] | HttpException> {
    return await this.employeesService.findAllEmployees();
  }
  @Get(':id')
  public async findOneEmployee(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Employees | HttpException> {
    return await this.employeesService.findOneEmployee(+id);
  }
  @Patch(':id')
  public async updateEmployee(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationEmployeePipe) updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<HttpException> {
    return await this.employeesService.updateEmployee(+id, updateEmployeeDto);
  }
  @Delete(':id')
  public async removeEmployeesController(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<HttpException> {
    return await this.employeesService.removeEmployee(+id);
  }
}
