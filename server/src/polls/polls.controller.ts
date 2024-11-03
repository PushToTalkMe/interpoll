import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto, VoteDto } from './dto';
import { PollsGateway } from './polls.gateway';
import { Response } from 'express';

@Controller('polls')
export class PollsController {
  constructor(
    private readonly pollsService: PollsService,
    private readonly pollsGateway: PollsGateway,
  ) {}

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    const createdPoll = await this.pollsService.create(createPollDto);
    this.pollsGateway.handlePollCreated(createdPoll);
    return createdPoll;
  }

  @Get()
  async getPolls(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.pollsService.getPolls(page, limit);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const pollIsDeleted = await this.pollsService.delete(id);
    this.pollsGateway.handlePollDeleted(pollIsDeleted.id);
    return pollIsDeleted;
  }

  @Post(':id/vote')
  async vote(
    @Param('id') id: number,
    @Body() voteDto: VoteDto,
    @Res() res: Response,
  ) {
    const updatedPoll = await this.pollsService.vote(id, voteDto.optionIndex);
    this.pollsGateway.handlePollUpdated(updatedPoll);
    return res.status(HttpStatus.OK).json(updatedPoll);
  }
}
