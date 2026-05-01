import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { LowStockInsightsResponse } from '../../api/types';
import { LowStockReportPage } from './LowStockReportPage';
import { TestProviders } from '../../test/test-utils';

const fetchLowStockInsightsMock = vi.fn();
const fetchStoresMock = vi.fn();
const fetchCategoriesMock = vi.fn();

vi.mock('../../api/insights.api', () => ({
  fetchLowStockInsights: (...args: unknown[]) => fetchLowStockInsightsMock(...args),
}));

vi.mock('../../api/stores.api', () => ({
  fetchStores: (...args: unknown[]) => fetchStoresMock(...args),
}));

vi.mock('../../api/categories.api', () => ({
  fetchCategories: (...args: unknown[]) => fetchCategoriesMock(...args),
}));

describe('LowStockReportPage', () => {
  beforeEach(() => {
    fetchLowStockInsightsMock.mockReset();
    fetchStoresMock.mockReset();
    fetchCategoriesMock.mockReset();

    fetchStoresMock.mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, limit: 100, hasNext: false },
    });
    fetchCategoriesMock.mockResolvedValue([]);
  });

  it('shows empty details message when insights data is empty', async () => {
    // given
    const insights: LowStockInsightsResponse = {
      data: [],
      summary: {
        totalLowStock: 0,
        byStore: [],
        byCategory: [],
      },
    };
    fetchLowStockInsightsMock.mockResolvedValue(insights);

    // when
    render(
      <TestProviders>
        <LowStockReportPage />
      </TestProviders>,
    );

    // then
    expect(await screen.findByText('No low-stock lines')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows detail row when insights returns lines', async () => {
    // given
    const insights: LowStockInsightsResponse = {
      data: [
        {
          storeProductId: 'a0000000-0000-4000-8000-000000000001',
          storeId: 'b0000000-0000-4000-8000-000000000002',
          storeName: 'Main',
          productId: 'c0000000-0000-4000-8000-000000000003',
          productName: 'Pen',
          sku: 'OFF-PEN',
          categoryId: 'd0000000-0000-4000-8000-000000000004',
          categoryName: 'Office',
          quantity: 1,
          lowStockThreshold: 5,
        },
      ],
      summary: {
        totalLowStock: 1,
        byStore: [
          {
            storeId: 'b0000000-0000-4000-8000-000000000002',
            storeName: 'Main',
            count: 1,
          },
        ],
        byCategory: [
          {
            categoryId: 'd0000000-0000-4000-8000-000000000004',
            categoryName: 'Office',
            count: 1,
          },
        ],
      },
    };
    fetchLowStockInsightsMock.mockResolvedValue(insights);

    // when
    render(
      <TestProviders>
        <LowStockReportPage />
      </TestProviders>,
    );

    // then
    await waitFor(() => {
      expect(screen.getByText('Pen')).toBeInTheDocument();
    });
    expect(screen.getByText('OFF-PEN')).toBeInTheDocument();
  });
});
