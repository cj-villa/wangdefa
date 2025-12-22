import {
  ConsoleLogger,
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import {
  SubscriptionDecryptionCommand,
  type SubscriptionDecryptionRequestQueryDto,
  SubscriptionDecryptionVO,
} from '@/core/wechat';
import { KvService } from '@/infrastructure/consul';

const logger = new ConsoleLogger('DecryptionDecorate');

const getDecryptionVO = (request: Request<{}, {}, any, SubscriptionDecryptionRequestQueryDto>) => {
  const token = KvService.get('token', ['subscription', 'token']);
  const encodingAESKey = KvService.get('token', ['subscription', 'encodingAESKey']);
  return new SubscriptionDecryptionVO(
    SubscriptionDecryptionCommand.fromDto(request.body.xml, request.query, token, encodingAESKey)
  );
};

export const DecryptQuery = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const decryptionVO = getDecryptionVO(request);
  const legal = decryptionVO.verify();
  logger.debug(`decryptionVO.verify: ${legal}`);
  if (!legal) {
    throw new UnauthorizedException();
  }
  return request.query;
});

export const DecryptBody = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const decryptionVO = getDecryptionVO(request);
  const legal = decryptionVO.verify();
  logger.debug(`decryptionVO.verify: ${legal}`);
  if (!legal) {
    throw new UnauthorizedException();
  }
  return decryptionVO.payload;
});
