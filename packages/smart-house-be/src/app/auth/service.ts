import { LoginDTO } from '@l/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModelService } from '@/app/user/service';
import { md5 } from '@/utils';

@Injectable()
export class AuthService {
  constructor(private userModelService: UserModelService, private jwtService: JwtService) {}

  async signIn(userName: LoginDTO['userName'], pass: LoginDTO['password']) {
    const [user] = await this.userModelService.getMetaData({ userName });
    if (user?.password !== md5(pass)) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, userName: user.userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
