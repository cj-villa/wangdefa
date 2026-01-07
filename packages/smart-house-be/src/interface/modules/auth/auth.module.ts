import { Module } from '@nestjs/common';
import { UserService, AuthService, User } from '@/core/user';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/shared/constant/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@/interface/modules/auth/auth.controller';

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
