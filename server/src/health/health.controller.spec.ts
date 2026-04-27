import { Test, TestingModule } from '@nestjs/testing';
import { HealthController, HealthResponseDto } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    // given
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();
    controller = module.get<HealthController>(HealthController);
  });

  it('returns ok and service name', () => {
    // when
    const result: HealthResponseDto = controller.getHealth();
    // then
    expect(result).toEqual({ status: 'ok', service: 'tiny-inventory-api' });
  });
});
