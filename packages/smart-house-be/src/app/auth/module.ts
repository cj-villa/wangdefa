import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModules } from '@/utils';

@Module(
  getModules(__dirname, {
    loop: true,
    mergeModule: {
      imports: [
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => {
            const { secret, expiresIn } = configService.get('auth');
            return { secret, expiresIn };
          },
          inject: [ConfigService],
        }),
      ],
    },
  })
)
export class AuthModule {}
