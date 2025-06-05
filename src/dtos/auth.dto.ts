import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';


export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty.' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

}


export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;
}
