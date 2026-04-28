import { Test, TestingModule } from '@nestjs/testing';
import {
  INSIGHTS_REPOSITORY,
  InsightsRepository,
} from './application/ports/insights.repository';
import { InsightsService } from './insights.service';

type InsightsRepositoryMock = {
  readonly [K in keyof InsightsRepository]: jest.Mock;
};

describe('InsightsService', () => {
  let service: InsightsService;
  let insightsRepository: InsightsRepositoryMock;

  beforeEach(async () => {
    // given
    insightsRepository = {
      findLowStockInsights: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
        {
          provide: INSIGHTS_REPOSITORY,
          useValue: insightsRepository,
        },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
  });

  it('returns dto-compatible response from use case read model', async () => {
    // given
    insightsRepository.findLowStockInsights.mockResolvedValue({
      items: [
        {
          storeProductId: '8e29fcb5-a640-4bc8-bec1-c66a8bc4062f',
          storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
          storeName: 'Main Street Store',
          productId: '06459f12-d156-4410-8e85-28d7f4b6628b',
          productName: 'Wireless Mouse',
          sku: 'ELEC-MOUSE-001',
          categoryId: '9d4c1125-7c3a-4b8c-bf3d-d760eb4f17f6',
          categoryName: 'Electronics',
          quantity: 2,
          lowStockThreshold: 5,
        },
      ],
      byStore: [
        {
          storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
          storeName: 'Main Street Store',
          count: 1,
        },
      ],
      byCategory: [
        {
          categoryId: '9d4c1125-7c3a-4b8c-bf3d-d760eb4f17f6',
          categoryName: 'Electronics',
          count: 1,
        },
      ],
    });

    // when
    const result = await service.getLowStockInsights({
      storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
    });

    // then
    expect(insightsRepository.findLowStockInsights).toHaveBeenCalledWith({
      storeId: '953254cf-c262-4aa7-b1a6-a7534ec696ef',
      categoryId: undefined,
    });
    expect(result.summary.totalLowStock).toBe(1);
    expect(result.data).toHaveLength(1);
  });
});
