import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { type JwtUser, UserService } from '@/core/user';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;

  @Inject()
  private jwtService: JwtService;

  async signup(email: string, password: string) {
    const user = await this.userService.getUser(email);
    if (user) {
      throw new ConflictException('当前邮箱已存在');
    }
    return this.userService.register(email, password);
  }

  async signIn(usernameOrEmail: string, password: string) {
    const user = await this.userService.getUser(usernameOrEmail);
    if (!user || !(await argon2.verify(user.password, String(password)))) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const payload: JwtUser = {
      userId: user.userId,
      nickName: user.nickName,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
