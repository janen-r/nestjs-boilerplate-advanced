import { IsNotEmpty, IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}