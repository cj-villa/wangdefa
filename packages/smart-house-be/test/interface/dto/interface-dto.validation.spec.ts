import { getErrorProperties, validateDto } from '../../helpers/dto-validation';
import { DeleteDto } from '@/core/common/application/dto/delete.dto';
import { TrackFinancialCleanDto } from '@/core/financial/application/dto/track-financial-clean.dto';
import { TrackFinancialCreateDto } from '@/core/financial/application/dto/track-financial-create.dto';
import { TrackFinancialTransactionCreateDto } from '@/core/financial/application/dto/track-financial-transaction-create.dto';
import { TrackFinancialTransactionUpdateDto } from '@/core/financial/application/dto/track-financial-transaction-update.dto';
import { FinancialTransactionType } from '@/core/financial/application/enum/financial-transaction-type';
import { SystemConfigUpdateDto } from '@/core/system/interface/dto/system-config-update.dto';
import { CreateTokenDto } from '@/core/token/application/dto/create-token.dto';
import { TokenDeleteDto } from '@/core/token/application/dto/token-delete.dto';
import { UserSignInDTO } from '@/core/user/application/dto/user.signin';
import { UserSignUpDTO } from '@/core/user/application/dto/user.signup';

describe('Interface DTO validation', () => {
  it('valid payload should pass for key DTOs', async () => {
    await expect(
      validateDto(UserSignUpDTO, { email: 'user@example.com', password: 'P@ssw0rd!' })
    ).resolves.toHaveLength(0);
    await expect(
      validateDto(UserSignInDTO, { usernameOrEmail: 'user', password: 'pwd' })
    ).resolves.toHaveLength(0);
    await expect(validateDto(DeleteDto, { id: 'id-1' })).resolves.toHaveLength(0);
    await expect(
      validateDto(TrackFinancialCreateDto, { name: 'A', code: 'ZH001' })
    ).resolves.toHaveLength(0);
    await expect(
      validateDto(TrackFinancialCleanDto, { code: 'ZH001', from: 1 })
    ).resolves.toHaveLength(0);
    await expect(validateDto(CreateTokenDto, { name: 'ci-token' })).resolves.toHaveLength(0);
    await expect(validateDto(TokenDeleteDto, { id: 't1' })).resolves.toHaveLength(0);
    await expect(
      validateDto(SystemConfigUpdateDto, { key: 'db', data: { mysql: false } })
    ).resolves.toHaveLength(0);
  });

  it('invalid payload should fail with field-level errors', async () => {
    const invalidSignUp = await validateDto(UserSignUpDTO, { email: 'invalid', password: '' });
    expect(getErrorProperties(invalidSignUp)).toEqual(
      expect.arrayContaining(['email', 'password'])
    );

    const invalidCreate = await validateDto(TrackFinancialTransactionCreateDto, {
      financialId: '',
      transactionType: 'INVALID',
      amount: 'abc',
      transactionDate: 'bad',
      ensureDate: 'bad',
    });
    expect(getErrorProperties(invalidCreate)).toEqual(
      expect.arrayContaining([
        'financialId',
        'transactionType',
        'amount',
        'transactionDate',
        'ensureDate',
      ])
    );

    const invalidUpdate = await validateDto(TrackFinancialTransactionUpdateDto, {
      transactionType: 'UNKNOWN',
      amount: 'oops',
      transactionDate: 'bad',
    });
    expect(getErrorProperties(invalidUpdate)).toEqual(
      expect.arrayContaining(['transactionType', 'amount', 'transactionDate'])
    );
  });

  it('enum value should pass for transaction DTO', async () => {
    await expect(
      validateDto(TrackFinancialTransactionCreateDto, {
        financialId: 'f1',
        transactionType: FinancialTransactionType.BUY,
        amount: '100.00',
        transactionDate: '2024-01-01T00:00:00.000Z',
        ensureDate: '2024-01-02T00:00:00.000Z',
      })
    ).resolves.toHaveLength(0);
  });
});
