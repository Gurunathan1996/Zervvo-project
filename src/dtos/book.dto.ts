import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Book title cannot be empty.' })
  title: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber({}, { message: 'Publication year must be a number.' })
  @IsInt({ message: 'Publication year must be an integer.' })
  @Min(1000, { message: 'Publication year must be a valid year (e.g., 1000 or later).' })
  publicationYear?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Author ID must be a number.' })
  @IsInt({ message: 'Author ID must be an integer.' })
  @IsNotEmpty({ message: 'Author ID cannot be empty.' })
  @Min(1, { message: 'Author ID must be a positive integer.' })
  authorId: number;
}

export class BookIdParamsDto {
  @Type(() => Number) 
  @IsNumber({}, { message: 'Book ID must be a number.' })
  @IsInt({ message: 'Book ID must be an integer.' })
  @Min(1, { message: 'Book ID must be a positive integer.' })
  id: number;
}


export class UpdateBookBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Book title cannot be empty if provided.' })
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Publication year must be a number if provided.' })
  @IsInt({ message: 'Publication year must be an integer if provided.' })
  @Min(1000, { message: 'Publication year must be a valid year (e.g., 1000 or later) if provided.' })
  publicationYear?: number;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber({}, { message: 'Author ID must be a number if provided.' })
  @IsInt({ message: 'Author ID must be an integer if provided.' })
  @Min(1, { message: 'Author ID must be a positive integer if provided.' })
  authorId?: number;
}
