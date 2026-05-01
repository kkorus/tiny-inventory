import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { createValidationPipe } from './../src/modules/common/factories/validation-pipe.factory';

type ValidationFieldError = Readonly<{
  field: string;
  messages: string[];
}>;

type NotFoundBody = Readonly<{
  statusCode: number;
  message: string;
}>;

type StoreResponseBody = Readonly<{
  id: string;
  name: string;
  address: string;
}>;

type StoresListBody = Readonly<{
  data: readonly StoreResponseBody[];
  meta: Readonly<{
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  }>;
}>;

function expectValidationFailedBody(body: unknown): void {
  expect(typeof body).toBe('object');
  expect(body).not.toBeNull();
  const record = body as Record<string, unknown>;
  expect(record.message).toBe('Validation failed');
  expect(Array.isArray(record.errors)).toBe(true);
  const errors = record.errors as readonly ValidationFieldError[];
  expect(errors.length).toBeGreaterThan(0);
  expect(typeof errors[0]?.field).toBe('string');
  expect(Array.isArray(errors[0]?.messages)).toBe(true);
}

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  describe('Health', () => {
    it('GET /api/health returns ok', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            status: 'ok',
            service: 'tiny-inventory-api',
          });
        });
    });
  });

  describe('Stores API', () => {
    it('POST /api/stores rejects empty body with field-level validation errors', () => {
      // given
      // when
      return (
        request(app.getHttpServer())
          .post('/api/stores')
          .send({})
          // then
          .expect(400)
          .expect((res) => {
            expectValidationFailedBody(res.body);
          })
      );
    });

    it('GET /api/stores/:id rejects non-UUID path param', () => {
      // given
      // when
      return (
        request(app.getHttpServer())
          .get('/api/stores/not-a-uuid')
          // then
          .expect(400)
      );
    });

    it('GET /api/stores/:id returns 404 when store does not exist', () => {
      // given
      const id = randomUUID();
      // when
      return (
        request(app.getHttpServer())
          .get(`/api/stores/${id}`)
          // then
          .expect(404)
          .expect((res) => {
            const body = res.body as NotFoundBody;
            expect(body).toMatchObject({ statusCode: 404 });
            expect(body.message).toContain('was not found');
          })
      );
    });

    it('POST /api/stores creates a store and GET /api/stores lists it', async () => {
      // given
      const name = `E2E Store ${randomUUID().slice(0, 8)}`;
      const address = '1 Test Lane';
      // when
      const createRes = await request(app.getHttpServer())
        .post('/api/stores')
        .send({ name, address })
        .expect(201);
      // then
      const createBody = createRes.body as StoreResponseBody;
      expect(createBody).toMatchObject({ name, address });
      expect(typeof createBody.id).toBe('string');

      const listRes = await request(app.getHttpServer())
        .get('/api/stores')
        .expect(200);
      const listBody = listRes.body as StoresListBody;
      expect(listBody.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: createBody.id,
            name,
            address,
          }),
        ]),
      );
      expect(typeof listBody.meta.total).toBe('number');
      expect(typeof listBody.meta.page).toBe('number');
      expect(typeof listBody.meta.limit).toBe('number');
      expect(typeof listBody.meta.hasNext).toBe('boolean');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
