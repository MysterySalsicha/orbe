import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('❌ Falha ao conectar com o banco de dados:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
