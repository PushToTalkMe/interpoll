import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from '../entities/poll.entity';
import { PollsGateway } from './polls.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Poll])],
  providers: [PollsService, PollsGateway],
  controllers: [PollsController],
})
export class PollsModule {}
