import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, TokenManageService, TokenSearchService } from '@/core/token';
import { AuthModule } from '@/interface/modules/auth/auth.module';
import { TokenController } from '@/interface/modules/system/token/token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), AuthModule],
  providers: [TokenManageService, TokenSearchService],
  controllers: [TokenController],
  exports: [TokenSearchService],
})
export class TokenModule {}
