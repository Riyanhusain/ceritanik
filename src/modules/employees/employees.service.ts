import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UsersService } from 'src/modules/users/users.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Employees } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly databasePrisma: PrismaService,
    private readonly userService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<HttpException> {
    this.logger.info(`Register new User ${JSON.stringify(createEmployeeDto)} `);
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      dateOfBirth,
      placeOfBirth,
      password,
      confirmPassword,
      email,
      role,
    } = createEmployeeDto;
    await this.userService.findEmail(email);
    const hashPassword = await this.userService.hashingPassword(
      password,
      confirmPassword,
    );
    try {
      await this.databasePrisma.employees.create({
        data: {
          firstName,
          lastName,
          address,
          phoneNumber,
          dateOfBirth,
          placeOfBirth,
          user: {
            create: {
              password: hashPassword,
              email,
              role,
            },
          },
        },
        include: { user: true },
      });
      return new HttpException('Employee has been created', 200);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
  public async findAllEmployees(): Promise<Employees[] | HttpException> {
    this.logger.info('findAll Employee');
    try {
      return await this.databasePrisma.employees.findMany();
    } catch (error) {
      return new NotFoundException();
    }
  }

  public async findOneEmployee(id: number): Promise<Employees | HttpException> {
    this.logger.info('FindOne Employee');
    try {
      return await this.databasePrisma.employees.findUnique({
        where: { id },
        include: { user: true },
      });
    } catch (error) {
      return new NotFoundException();
    }
  }

  public async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<HttpException> {
    const {
      firstName,
      lastName,
      address,
      phoneNumber,
      dateOfBirth,
      placeOfBirth,
      password,
      confirmPassword,
      email,
      role,
    } = updateEmployeeDto;

    const hashPassword = await this.userService.hashingPassword(
      password,
      confirmPassword,
    );
    const employee: any = await this.findOneEmployee(id);
    try {
      await this.databasePrisma.employees.update({
        where: { id },
        data: {
          firstName: firstName || employee.firstName,
          lastName: lastName || employee.lastName,
          address: address || employee.address,
          phoneNumber: phoneNumber || employee.phoneNumber,
          dateOfBirth: dateOfBirth || employee.dateOfBirth,
          placeOfBirth: placeOfBirth || employee.placeOfBirth,
          user: {
            update: {
              email: email || employee.user.email,
              password: hashPassword || employee.user.password,
              role: role || employee.user.role,
            },
          },
        },
        include: { user: true },
      });
      return new HttpException('Your data has been update', 200);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  public async removeEmployee(id: number): Promise<HttpException> {
    try {
      await this.databasePrisma.employees.delete({ where: { id } });
      return new HttpException('has been deleted', 200);
    } catch (error) {
      return new BadRequestException();
    }
  }
}
