import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsInt,
  IsBoolean,
  IsPositive,
  IsOptional,
} from "class-validator";

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(new Date().getFullYear())
  publicationYear: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  isNewBook: boolean;

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class DeleteBookDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity: number;
}
