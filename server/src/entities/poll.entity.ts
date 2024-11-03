import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { OptionDto } from '../polls/dto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({ length: 250 })
  @IsString()
  question: string;

  @Column('json')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: { title: string; votes: number }[];
}
