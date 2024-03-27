import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ValidationCustomerPipe } from 'src/common/pipes/validationCustomer.pipe';
import { Employees } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  public async createCustomer(
    @Body(ValidationCustomerPipe) createCustomerDto: CreateCustomerDto,
  ): Promise<HttpException> {
    return await this.customersService.createCustomer(createCustomerDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  public async findAllCustomer(): Promise<Employees[] | HttpException> {
    return await this.customersService.findAllCustomer();
  }

  @Get(':id')
  public async findOneCustomer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Employees | HttpException> {
    return this.customersService.findOneCustomer(+id);
  }

  @Patch(':id')
  public async updateCustomer(
    @Param('id') id: string,
    @Body(ValidationCustomerPipe) updateCustomerDto: UpdateCustomerDto,
  ): Promise<HttpException> {
    return await this.customersService.updateCustomer(+id, updateCustomerDto);
  }

  @Delete(':id')
  public async removeEmployee(@Param('id') id: string): Promise<HttpException> {
    return await this.customersService.removeCustomer(+id);
  }
}
