import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProductListPage } from './ProductListPage';
import { TestProviders } from '../../test/test-utils';
import type { PaginatedResponse, Product } from '../../api/types';

const fetchProductsMock = vi.fn();
const deleteProductMock = vi.fn();

vi.mock('../../api/products.api', () => ({
  fetchProducts: (...args: unknown[]) => fetchProductsMock(...args),
  deleteProduct: (...args: unknown[]) => deleteProductMock(...args),
}));

function buildProductsResponse(
  products: readonly Product[],
): PaginatedResponse<Product> {
  return {
    data: products,
    meta: {
      total: products.length,
      page: 1,
      limit: 20,
      hasNext: false,
    },
  };
}

describe('ProductListPage', () => {
  beforeEach(() => {
    fetchProductsMock.mockReset();
    deleteProductMock.mockReset();
  });

  it('shows empty state when products list is empty', async () => {
    // given
    fetchProductsMock.mockResolvedValue(buildProductsResponse([]));
    // when
    render(
      <TestProviders>
        <ProductListPage />
      </TestProviders>,
    );
    // then
    expect(await screen.findByText('No products yet')).toBeInTheDocument();
  });

  it('shows error state when API request fails', async () => {
    // given
    fetchProductsMock.mockRejectedValue(new Error('Network error'));
    // when
    render(
      <TestProviders>
        <ProductListPage />
      </TestProviders>,
    );
    // then
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
