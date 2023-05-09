import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const articleShape = expect.objectContaining({
    id: expect.any(Number),
    title: expect.any(String),
    description: expect.any(String),
    body: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    published: expect.any(Boolean),
  });
  const articleData = [
    {
      id: 1001,
      title: 'Article 1',
      description: 'Description 1',
      body: 'Body very long body 1',
      published: true,
    },
    {
      id: 1002,
      title: 'Article 2',
      description: 'Description 2',
      body: 'Body very long body 2',
      published: false,
    },
  ];
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.article.createMany({ data: articleData });
  });

  describe('GET /articles', () => {
    it('check status 200', async () => {
      const { status } = await request(app.getHttpServer()).get('/article');
      expect(status).toBe(200);
    });

    it('check structure shape', async () => {
      const { body } = await request(app.getHttpServer()).get('/article');

      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
    });

    it('check response array leng', async () => {
      const { body } = await request(app.getHttpServer()).get('/article');
      expect(body).toHaveLength(2);
    });

    it('check first element id equal', async () => {
      const { body } = await request(app.getHttpServer()).get('/article');

      expect(body[0].id).toEqual(articleData[0].id);
    });
    it('check first element is published', async () => {
      const { body } = await request(app.getHttpServer()).get('/article');

      expect(body[0].id).toEqual(articleData[0].id);
      expect(body[0].published).toBeTruthy();
    });
  });

  describe('GET /articles/{id}', () => {
    it('check status 200', async () => {
      const { status } = await request(app.getHttpServer()).get(
        `/article/${articleData[0].id}`,
      );
      expect(status).toBe(200);
    });

    it('check structure shape', async () => {
      const { body } = await request(app.getHttpServer()).get(
        `/article/${articleData[0].id}`,
      );
      expect(body).toStrictEqual(articleShape);
    });

    it('check response single object', async () => {
      const { body } = await request(app.getHttpServer()).get(
        `/article/${articleData[0].id}`,
      );
      expect(body).toBeInstanceOf(Object);
    });

    it('check first element id equal', async () => {
      const { body } = await request(app.getHttpServer()).get(
        `/article/${articleData[0].id}`,
      );

      expect(body.id).toEqual(articleData[0].id);
    });
    it('check first element is published', async () => {
      const { body } = await request(app.getHttpServer()).get(
        `/article/${articleData[0].id}`,
      );

      expect(body.id).toEqual(articleData[0].id);
      expect(body.published).toBeTruthy();
    });
  });

  describe('POST /articles/', () => {
    it('create article success', async () => {
      const beforeCount = await prisma.article.count();
      const { status } = await request(app.getHttpServer())
        .post(`/article`)
        .send({
          title: 'title long title',
          description: 'description3ddddddddd',
          body: 'body3a long text to body',
          published: false,
        });
      const afterCount = await prisma.article.count();

      expect(status).toBe(201);
      expect(afterCount - beforeCount).toBe(1);
    });

    it('fails to create article without title', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/article')
        .send({
          description: 'description4 long text to body',
          body: 'body4 long text to body ddddddd',
          published: true,
        });

      expect(status).toBe(400);
    });
    // it('check structure shape', async () => {
    //   const { body } = await request(app.getHttpServer()).get(
    //     `/article/${articleData[0].id}`,
    //   );
    //   expect(body).toStrictEqual(articleShape);
    // });

    // it('check response single object', async () => {
    //   const { body } = await request(app.getHttpServer()).get(
    //     `/article/${articleData[0].id}`,
    //   );
    //   expect(body).toBeInstanceOf(Object);
    // });

    // it('check first element id equal', async () => {
    //   const { body } = await request(app.getHttpServer()).get(
    //     `/article/${articleData[0].id}`,
    //   );

    //   expect(body.id).toEqual(articleData[0].id);
    // });
    // it('check first element is published', async () => {
    //   const { body } = await request(app.getHttpServer()).get(
    //     `/article/${articleData[0].id}`,
    //   );

    //   expect(body.id).toEqual(articleData[0].id);
    //   expect(body.published).toBeTruthy();
    // });
  });
});
