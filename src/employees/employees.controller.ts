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
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Response } from 'express';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  public async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Res() response: Response,
  ) {
    const employee =
      await this.employeesService.createEmployee(createEmployeeDto);
    return response.status(HttpStatus.OK).json(employee);
  }

  @Get()
  findAll() {
    return this.employeesService.findAllEmployees();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
