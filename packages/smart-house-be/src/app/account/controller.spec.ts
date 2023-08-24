import { Test } from '@nestjs/testing';
import { AccountController } from './controller';
import { AccountService } from './service';

describe('CatsController', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    }).compile();
    accountController = moduleRef.get<AccountController>(AccountController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];

      expect(accountController.test()).toBe('test');
    });
  });
});
