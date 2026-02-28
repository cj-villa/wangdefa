import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, UserSignInDTO, UserSignUpDTO } from '@/core/user';
import { NoAuth } from '@/interface/guard';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @NoAuth()
  @Post('signup')
  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: UserSignUpDTO })
  @ApiOkResponse({
    description: '注册成功',
    schema: { type: 'object', additionalProperties: true },
  })
  signup(@Body() body: UserSignUpDTO) {
    return this.authService.signup(body.email, body.password);
  }

  @NoAuth()
  @Post('signIn')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: UserSignInDTO })
  @ApiOkResponse({
    description: '登录成功，返回 access_token',
    schema: {
      type: 'object',
      properties: { access_token: { type: 'string' } },
      required: ['access_token'],
    },
  })
  signIn(@Body() body: UserSignInDTO) {
    return this.authService.signIn(body.usernameOrEmail, body.password);
  }
}
