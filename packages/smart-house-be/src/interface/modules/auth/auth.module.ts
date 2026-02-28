import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService, AuthService, User } from '@/core/user';
import { AuthController } from '@/interface/modules/auth/auth.controller';
import { jwtConstants } from '@/shared/constant/auth';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7 day' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, AuthService],
  controllers: [AuthController],
  exports: [UserService],
})
export class AuthModule {}
