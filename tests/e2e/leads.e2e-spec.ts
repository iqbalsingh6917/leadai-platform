import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../apps/api/src/modules/auth/auth.module';
import { LeadsModule } from '../../apps/api/src/modules/leads/leads.module';
import { ActivityModule } from '../../apps/api/src/modules/activity/activity.module';

describe('Leads (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdLeadId: string;

  const testUser = {
    firstName: 'Leads',
    lastName: 'Tester',
    email: `leads_e2e_${Date.now()}@leadai-test.com`,
    password: 'Password123!',
    companyName: 'LeadAI Test Corp',
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
        ActivityModule,
        LeadsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();

    // Register + login to obtain token
    await request(app.getHttpServer()).post('/api/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/leads', () => {
    it('should create a lead', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'Amit',
          lastName: 'Sharma',
          email: 'amit.sharma@example.com',
          phone: '+919876543210',
          company: 'Sharma Enterprises',
          source: 'website',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.firstName).toBe('Amit');
      createdLeadId = res.body.id;
    });

    it('should reject creating lead without required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'incomplete@test.com' })
        .expect(400);
    });

    it('should reject unauthenticated request', async () => {
      await request(app.getHttpServer())
        .post('/api/leads')
        .send({ firstName: 'Test', lastName: 'Lead', source: 'website' })
        .expect(401);
    });
  });

  describe('GET /api/leads', () => {
    it('should return paginated leads', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support search filter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/leads?search=Amit')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.some((l: any) => l.firstName === 'Amit')).toBe(true);
    });

    it('should support source filter', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/leads?source=website')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      res.body.data.forEach((l: any) => expect(l.source).toBe('website'));
    });
  });

  describe('GET /api/leads/:id', () => {
    it('should return a single lead by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.id).toBe(createdLeadId);
    });

    it('should return 404 for non-existent lead', async () => {
      await request(app.getHttpServer())
        .get('/api/leads/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/leads/:id', () => {
    it('should update a lead', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'contacted', notes: 'Called and left message' })
        .expect(200);

      expect(res.body.status).toBe('contacted');
    });
  });

  describe('DELETE /api/leads/:id', () => {
    it('should delete a lead', async () => {
      await request(app.getHttpServer())
        .delete(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 after deletion', async () => {
      await request(app.getHttpServer())
        .get(`/api/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
