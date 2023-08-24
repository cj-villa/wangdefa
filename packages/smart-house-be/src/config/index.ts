import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

export const Configs = ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
});
