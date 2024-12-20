import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCatDto {
  @IsString({ message: 'No puede tener numeros ' })
  @MinLength(2)
  name: string;
  @IsInt()
  @IsPositive()
  age: number;
  @IsInt()
  @IsOptional()
  breed?: number;
}
