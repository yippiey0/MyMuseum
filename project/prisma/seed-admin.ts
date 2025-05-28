import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email:'',
      password,
      role: 'admin'
    }
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())