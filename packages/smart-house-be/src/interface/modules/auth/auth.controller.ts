import { AuthService, UserSignInDTO, UserSignUpDTO } from '@/core/user';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { NoAuth } from '@/interface/guard';

@Controller('/api/auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @NoAuth()
  @Post('signup')
  signup(@Body() body: UserSignUpDTO) {
    return this.authService.signup(body.email, body.password);
  }

  @NoAuth()
  @Post('signIn')
  signIn(@Body() body: UserSignInDTO) {
    return this.authService.signIn(body.usernameOrEmail, body.password);
  }
}
