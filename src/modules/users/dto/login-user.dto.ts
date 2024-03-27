import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'email required' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'password required' })
  password: string;
}
