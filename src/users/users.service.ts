import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databasePrisma: DatabaseService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  public async findOneUser(id: number) {
    const user = await this.databasePrisma.users.findUnique({
      where: { id },
      include: { employee: true },
    });
    try {
      if (user) {
        return user;
      } else {
        throw new NotFoundException('your data no found');
      }
    } catch (error) {
      return { message: error };
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
