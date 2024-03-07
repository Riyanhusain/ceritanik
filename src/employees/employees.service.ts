import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly databasePrisma: DatabaseService,
    private readonly userService: UsersService,
  ) {}
  public async findEmailEmployee(email: string) {
    const findEmailActive = await this.databasePrisma.users.findUnique({
      where: { email },
    });
    try {
      if (findEmailActive)
        throw new BadRequestException(`${email} already used`);
      return findEmailActive;
    } catch (error) {
      return error;
    }
  }
  public async hashingPassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException('your password doesnt match');
    }
    const saltNumber: number = 10;
    const hashPassword = await bcrypt.hash(password, saltNumber);
    return hashPassword;
  }
  public async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<{ message: string }> {
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
    await this.findEmailEmployee(email);
    const hashPassword = await this.hashingPassword(password, confirmPassword);
    try {
      const employee = await this.databasePrisma.employees.create({
        data: {
          firstName,
          lastName,
          address,
          phoneNumber,
          dateOfBirth: new Date(dateOfBirth),
          placeOfBirth,
        },
      });
      await this.databasePrisma.users.create({
        data: {
          password: hashPassword,
          email,
          role,
          employeeId: employee.id,
        },
      });
      return { message: 'data has been created' };
    } catch (error) {
      return { message: error };
    }
  }
  public async findAllEmployees() {
    try {
      return await this.databasePrisma.employees.findMany();
    } catch (error) {
      return error;
    }
  }

  public async findOneEmployee(id: number) {
    const employee = await this.databasePrisma.employees.findUnique({
      where: { id },
    });
    try {
      if (employee) {
        return employee;
      } else {
        throw new NotFoundException('your data no found');
      }
    } catch (error) {
      return { message: error };
    }
  }

  public async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<{ message: string }> {
    let hashPassword;
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
    await this.findOneEmployee(id);
    if (email) await this.findEmailEmployee(email);
    if (password && confirmPassword) {
      hashPassword = await this.hashingPassword(password, confirmPassword);
    }
    const user: any = await this.userService.findOneUser(id);
    console.log(user.employee.dateOfBirth);
    try {
      await this.databasePrisma.users.update({
        where: { id },
        data: {
          email: user.email || email,
          password: user.password || hashPassword,
          role: user.role || role,
          employeeId: user.employeeId,
        },
      });
      await this.databasePrisma.employees.update({
        where: { id: user.emmployeeId },
        data: {
          firstName: firstName || user.employee.firstName,
          lastName: lastName || user.employee.lastName,
          address: address || user.employee.address,
          phoneNumber: phoneNumber || user.employee.phoneNumber,
          dateOfBirth: new Date(dateOfBirth) || user.employee.dateOfBirth,
          placeOfBirth: placeOfBirth || user.employee.placeOfBirth,
        },
      });
      return { message: 'has been update' };
    } catch (error) {
      return { message: error };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
