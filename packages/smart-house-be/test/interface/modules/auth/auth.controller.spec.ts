import { createController } from '../../../helpers/controller-test-helpers';
import { AuthController } from '@/interface/modules/auth/auth.controller';

describe('AuthController', () => {
  const authService = {
    signup: jest.fn(),
    signIn: jest.fn(),
  };

  const controller = createController(AuthController, { authService });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signup should call auth service', async () => {
    authService.signup.mockResolvedValue({ id: 'u1' });
    await expect(controller.signup({ email: 'a@b.com', password: 'pwd' })).resolves.toEqual({
      id: 'u1',
    });
    expect(authService.signup).toHaveBeenCalledWith('a@b.com', 'pwd');
  });

  it('signIn should call auth service', async () => {
    authService.signIn.mockResolvedValue({ access_token: 'token' });
    await expect(
      controller.signIn({ usernameOrEmail: 'a@b.com', password: 'pwd' })
    ).resolves.toEqual({
      access_token: 'token',
    });
    expect(authService.signIn).toHaveBeenCalledWith('a@b.com', 'pwd');
  });

  it('should propagate service error', async () => {
    authService.signIn.mockRejectedValue(new Error('login failed'));
    await expect(
      controller.signIn({ usernameOrEmail: 'a@b.com', password: 'pwd' })
    ).rejects.toThrow('login failed');
  });
});
