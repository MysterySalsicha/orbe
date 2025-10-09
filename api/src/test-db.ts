import * as dotenv from 'dotenv';
import { prisma } from './clients';

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
