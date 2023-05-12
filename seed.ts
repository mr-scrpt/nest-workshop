// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

const postList = [
  {
    title: 'Prisma Adds Support for MongoDB',
    body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
    description:
      "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
    published: false,
  },
  {
    title: "What's new in Prisma? (Q1/22)",
    body: 'Our engineers have been working hard, issuing new releases with many improvements...',
    description:
      'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
    published: true,
  },
];

const userList = [
  {
    id: '1',
    name: 'Super',
    email: 'test@gmail.com',
    password: '123456',
  },
];

type Entity = {
  [key: string]: any;
};

async function execute<T extends Entity, K extends keyof T>(
  list: Array<T>,
  entity: string,
  where: K,
) {
  for await (const item of list) {
    const result = await prisma[entity].upsert({
      where: { [where]: item[where] },
      update: {},
      create: {
        ...item,
      },
    });

    console.dir({ result });
  }
}

async function main() {
  await execute(postList, 'article', 'title');
  await execute(userList, 'user', 'id');
}
// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
