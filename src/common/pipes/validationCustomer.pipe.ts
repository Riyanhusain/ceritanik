import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationCustomerPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value.dateOfBirth) {
      value.dateOfBirth = new Date(value.dateOfBirth);
    }
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.log('terjadi kesalahan di pipe');
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
