import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationEmployeePipe implements PipeTransform {
  constructor(private readonly databasePrisma: PrismaService) {}
  async transform(value: any, { type, metatype, data }: ArgumentMetadata) {
    if (type !== 'body') {
      return value;
    }
    if (value.dateOfBirth) {
      value.dateOfBirth = new Date(value.dateOfBirth);
    }
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const message = errors.map((e) => e.constraints);
      throw new BadRequestException(message);
    }
    return value;
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object, Date];
    return !types.includes(metatype);
  }
}
