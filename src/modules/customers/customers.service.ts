import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customers } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UsersService } from '../users/users.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userService: UsersService,
  ) {}

  public async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<HttpException> {
    this.logger.info('Create Customer');
    const {
      firstName,
      lastName,
      address,
      dateOfBirth,
      placeOfBirth,
      password,
      confirmPassword,
      role,
      phoneNumber,
      email,
    } = createCustomerDto;
    await this.userService.findEmail(email);
    const hashPassword = await this.userService.hashingPassword(
      password,
      confirmPassword,
    );
    try {
      await this.prismaService.customers.create({
        data: {
          firstName,
          lastName,
          address,
          dateOfBirth,
          placeOfBirth,
          phoneNumber,
          user: {
            create: {
              email,
              password: hashPassword,
              role,
            },
          },
        },
        include: { user: true },
      });

      return new HttpException('data has been created', 200);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  public async findAllCustomer(): Promise<Customers[] | HttpException> {
    try {
      return await this.prismaService.customers.findMany();
    } catch (error) {
      return new NotFoundException();
    }
  }

  public async findOneCustomer(id: number): Promise<Customers | HttpException> {
    try {
      const customer = await this.prismaService.customers.findUnique({
        where: { id },
      });
      if (!customer) {
        return new NotFoundException('Data Not Found');
      }
      return customer;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  public async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<HttpException> {
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      dateOfBirth,
      placeOfBirth,
      role,
      email,
      password,
      confirmPassword,
    } = updateCustomerDto;
    const user: any = await this.findOneCustomer(id);
    const hashPassword = await this.userService.hashingPassword(
      password,
      confirmPassword,
    );
    try {
      await this.prismaService.customers.update({
        where: { id },
        data: {
          firstName: firstName || user.customer.firstName,
          lastName: lastName || user.customer.lastName,
          address: address || user.customer.address,
          dateOfBirth: dateOfBirth || user.customer.dateOfBirth,
          placeOfBirth: placeOfBirth || user.customer.placeOfBirth,
          phoneNumber: phoneNumber || user.customer.phoneNumber,
          user: {
            update: {
              email: email || user.email,
              role: role || user.role,
              password: hashPassword || user.password,
            },
          },
        },
        include: { user: true },
      });
      return new HttpException('Data has been update', 200);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  public async removeCustomer(id: number): Promise<HttpException> {
    await this.findOneCustomer(id);
    try {
      await this.prismaService.customers.delete({ where: { id } });
      return new HttpException('data has been deleted', 200);
    } catch (error) {
      return new BadRequestException();
    }
  }
}
