import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { UserModule } from '@/interface/modules/user/user.module';
import { configLoad } from '@/infrastructure/config';
import { ConsulModule } from '@/infrastructure/consul';
import { consulConfig } from '@/infrastructure/config/consul.config';
import { ExceptionProvider } from '@/infrastructure/exception';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: configLoad,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ConsulModule.forRootAsync({
      isGlobal: true,
      useFactory: (consulCfg: ConfigType<typeof consulConfig>) => ({
        host: consulCfg.host,
      }),
      inject: [consulConfig.KEY],
    }),
    UserModule,
  ],
  providers: [...ExceptionProvider],
})
export class AppModule {}
