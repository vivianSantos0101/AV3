import "dotenv/config";
import { prisma } from '../src/db/prisma';

async function resetDatabase() {
  try {
    console.log("🔹 Conectando ao banco...");

    // Dropar database
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${process.env.DATABASE_NAME}`);
    console.log(`❌ Database ${process.env.DATABASE_NAME} droppada.`);

    // Criar database
    await prisma.$executeRawUnsafe(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
    console.log(`✅ Database ${process.env.DATABASE_NAME} criada.`);

  } catch (error) {
    console.error("Erro ao resetar database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();