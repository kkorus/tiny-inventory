import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductEditPage } from './ProductEditPage';
import { TestProviders } from '../../test/test-utils';
import type { Category } from '../../api/types';

const fetchCategoriesMock = vi.fn();
const createProductMock = vi.fn();
const fetchProductMock = vi.fn();
const updateProductMock = vi.fn();

vi.mock('../../api/categories.api', () => ({
  fetchCategories: (...args: unknown[]) => fetchCategoriesMock(...args),
}));

vi.mock('../../api/products.api', () => ({
  createProduct: (...args: unknown[]) => createProductMock(...args),
  fetchProduct: (...args: unknown[]) => fetchProductMock(...args),
  updateProduct: (...args: unknown[]) => updateProductMock(...args),
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const categories: readonly Category[] = [
  {
    id: '0b3007dd-e5e8-42c2-9f3f-fbb4036be028',
    name: 'Electronics',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('ProductEditPage', () => {
  beforeEach(() => {
    fetchCategoriesMock.mockReset();
    createProductMock.mockReset();
    fetchProductMock.mockReset();
    updateProductMock.mockReset();
    navigateMock.mockReset();
    fetchCategoriesMock.mockResolvedValue(categories);
  });

  it('submits create payload from form', async () => {
    // given
    createProductMock.mockResolvedValue({
      id: 'p1',
      name: 'Wireless Mouse',
      sku: 'ELEC-MOUSE-001',
      categoryId: categories[0].id,
      category: { id: categories[0].id, name: categories[0].name },
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    // when
    render(
      <TestProviders initialEntries={['/products/new']}>
        <ProductEditPage mode="create" />
      </TestProviders>,
    );

    await userEvent.type(await screen.findByLabelText('Name'), 'Wireless Mouse');
    await userEvent.type(screen.getByLabelText('SKU'), 'ELEC-MOUSE-001');
    await userEvent.selectOptions(screen.getByLabelText('Category'), categories[0].id);
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    // then
    await waitFor(() => {
      expect(createProductMock).toHaveBeenCalledWith({
        name: 'Wireless Mouse',
        sku: 'ELEC-MOUSE-001',
        categoryId: categories[0].id,
      });
    });
  });
});
