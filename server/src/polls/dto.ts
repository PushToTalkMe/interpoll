import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  question: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => OptionTitleDto)
  options: OptionTitleDto[];
}

export class OptionDto {
  @IsString()
  title: string;

  @IsNumber()
  votes: number;
}

export class OptionTitleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}

export class VoteDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(9)
  optionIndex: number;
}
