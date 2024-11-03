import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Poll } from '../entities/poll.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePollDto } from './dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private pollsRepository: Repository<Poll>,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    const optionWithVotes = createPollDto.options.map((option) => {
      return { title: option.title, votes: 0 };
    });
    return this.pollsRepository.save({
      ...createPollDto,
      options: optionWithVotes,
    });
  }

  async getPolls(page: number, limit: number): Promise<Poll[]> {
    const skip = (page - 1) * limit;
    return this.pollsRepository.find({
      skip: skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });
  }

  async delete(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({ where: { id } });
    if (!poll) {
      throw new NotFoundException('Опрос не найден');
    }
    await this.pollsRepository.delete(id);
    return poll;
  }

  async vote(id: number, optionIndex: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({ where: { id } });

    if (!poll) {
      throw new NotFoundException('Опрос не найден');
    }

    if (poll.options[optionIndex]) {
      poll.options[optionIndex].votes += 1;
    } else {
      throw new NotFoundException('Вариант не найден');
    }

    return this.pollsRepository.save(poll);
  }
}
