import { HttpStatus } from '@nestjs/common';
import { FallbackController } from '@/interface/modules/fallback/fallback.controller';

describe('FallbackController', () => {
  const controller = new FallbackController();

  it('should return 404 response', () => {
    const end = jest.fn();
    const status = jest.fn().mockReturnValue({ end });
    controller.handle({ status } as unknown as never);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(end).toHaveBeenCalled();
  });
});
