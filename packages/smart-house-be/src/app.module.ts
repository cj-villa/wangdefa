import { Module } from '@nestjs/common';
import { UserModule } from '@/interface/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [],
})
export class AppModule {
}
