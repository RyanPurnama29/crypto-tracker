import { PrismaClient } from '../generated/prisma';
import { ETF_DATA } from './data';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.etf.deleteMany();
  await prisma.etf.createMany({
    data: ETF_DATA,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seed data success');
    await prisma.$disconnect();
  });
