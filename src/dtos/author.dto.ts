
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty({ message: 'Author name cannot be empty.' })
  name!: string;

  @IsOptional()
  @IsString()
  bio?: string;
}


export class AuthorIdParamsDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Author ID must be a number.' })
  @IsInt({ message: 'Author ID must be an integer.' })
  @Min(1, { message: 'Author ID must be a positive integer.' })
  id!: number;
}


export class UpdateAuthorBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Author name cannot be empty if provided.' })
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

