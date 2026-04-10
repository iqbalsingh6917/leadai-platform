import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../apps/api/src/modules/auth/auth.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `e2e_${Date.now()}@leadai-test.com`,
    password: 'Password123!',
    companyName: 'LeadAI E2E Corp',
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST ?? 'localhost',
          port: parseInt(process.env.DB_PORT ?? '5432', 10),
          username: process.env.DB_USERNAME ?? 'leadai',
          password: process.env.DB_PASSWORD ?? 'leadai_dev',
          database: process.env.DB_NAME ?? 'leadai_test',
          entities: [__dirname + '/../../apps/api/src/**/*.entity{.ts,.js}'],
          synchronize: true,
          dropSchema: true,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
      accessToken = res.body.access_token;
    });

    it('should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('should reject registration with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, email: 'not-an-email' })
        .expect(400);
    });

    it('should reject registration with short password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, email: 'another@test.com', password: '12' })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
      expect(typeof res.body.access_token).toBe('string');
    });

    it('should reject login with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);
    });

    it('should reject login with non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nobody@nowhere.com', password: 'anything' })
        .expect(401);
    });
  });
});
