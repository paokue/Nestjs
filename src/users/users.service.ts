import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as argon2 from 'argon2';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new User();
      user.fullname = createUserDto.fullname;
      user.email = createUserDto.email;
      user.password = await argon2.hash(createUserDto.password);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new HttpException('Duplicate Email', HttpStatus.CONFLICT); // 409
      }
      throw new HttpException('Something went wrong!!', HttpStatus.BAD_REQUEST); // 400
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ order: { id: 'DESC' } });
  }

  async findAllWithPagination(
    page: number = 1,
    page_size: number = 3,
  ): Promise<User[]> {
    const user = await this.usersRepository.find({
      skip: (page - 1) * page_size,
      take: page_size,
      order: { id: 'DESC' },
    });
    return user;
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update(id, updateUserDto);
  }

  // if use remove the Promise will be Promise<User>
  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);

    // second method will return deleted user data
    // const user = await this.findOne(id);
    // return await this.usersRepository.remove(user);
  }
}
