import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, TokenManageService, TokenSearchService } from '@/core/token';
import { TokenController } from '@/interface/modules/system/token/token.controller';
import { AuthModule } from '@/interface/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), AuthModule],
  providers: [TokenManageService, TokenSearchService],
  controllers: [TokenController],
  exports: [TokenSearchService],
})
export class TokenModule {}
