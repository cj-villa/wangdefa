import { LoginDTO } from '@l/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/app/auth/service';
import { UnAuth } from '@/decorator/unAuth';

@Controller()
@UnAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('api/login')
  login(@Body() user: LoginDTO) {
    return this.authService.signIn(user.userName, user.password);
  }
}
