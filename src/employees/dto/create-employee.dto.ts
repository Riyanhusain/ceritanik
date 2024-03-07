import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateEmployeeDto {
  //fristname
  @IsString()
  @IsNotEmpty({ message: 'fristname is required' })
  firstName: string;
  //lastname
  @IsString()
  @IsNotEmpty({ message: 'lastname is required' })
  lastName: string;
  //address
  @IsString()
  @IsNotEmpty({ message: 'address is requred' })
  address: string;
  //phone number
  @IsInt()
  phoneNumber: number;
  //date birth
  @IsDate()
  dateOfBirth: Date;
  //place of birth
  @IsString()
  placeOfBirth: string;
  //email
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;
  //password
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
  //confirmPassword
  @IsString()
  @IsNotEmpty({ message: 'ConfirmPassword is required' })
  confirmPassword: string;
  //role
  @IsEnum(['ADMIN', 'CUSTOMER', 'SELLER'], { message: 'valid role reqired' })
  role: 'ADMIN' | 'CUSTOMER' | 'SELLER';
}
