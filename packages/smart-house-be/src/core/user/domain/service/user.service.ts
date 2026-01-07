import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/core/user';
import { Repository } from 'typeorm';
import argon2 from 'argon2';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private usersRepository: Repository<User>;

  getUser(usernameOrEmail: string) {
    return this.usersRepository.findOneBy([
      { username: usernameOrEmail },
      { email: usernameOrEmail },
    ]);
  }

  getUserById(userId: string) {
    return this.usersRepository.findOneBy([{ userId }]);
  }

  async register(email: string, password: string) {
    const username = email.split('@')[0];
    const user = this.usersRepository.create({
      email,
      username: username,
      nickName: username,
      password: await argon2.hash(String(password)),
    });
    return this.usersRepository.save(user);
  }
}
