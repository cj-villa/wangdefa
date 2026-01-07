import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { type Request } from 'express';
import {
  SubscriptionSecureCommand,
  type SubscriptionDecryptionRequestQueryDto,
  SubscriptionDecryptionVO,
  type SubscriptionDecryptionRequestBodyDto,
} from '@/core/wechat';
import { KvService } from '@/infrastructure/consul';
import { createLogger } from '@/shared/logger';

const logger = createLogger('DecryptionDecorate');

const getDecryptionVO = (
  request: Request<
    {},
    {},
    { xml: SubscriptionDecryptionRequestBodyDto },
    SubscriptionDecryptionRequestQueryDto
  >
) => {
  const token = KvService.get('token', ['subscription', 'token']);
  const encodingAESKey = KvService.get('token', ['subscription', 'encodingAESKey']);
  const body = request.body.xml;
  const query = request.query;
  return new SubscriptionDecryptionVO(
    new SubscriptionSecureCommand(
      token,
      query.timestamp,
      query.nonce,
      query.signature,
      body.Encrypt,
      query.encrypt_type,
      query.msg_signature,
      encodingAESKey
    )
  );
};

export const DecryptQuery = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const decryptionVO = getDecryptionVO(request);
  const legal = decryptionVO.verify();
  logger.debug(`decryptionVO.verify: ${legal}`);
  if (!legal) {
    throw new ForbiddenException();
  }
  return request.query;
});

export const DecryptBody = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const decryptionVO = getDecryptionVO(request);
  const legal = decryptionVO.verify();
  logger.debug(`decryptionVO.verify: ${legal}`);
  if (!legal) {
    throw new ForbiddenException();
  }
  return decryptionVO.getPayload();
});
