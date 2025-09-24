import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists, skipping seed');
    return;
  }

  // Créer le compte admin par défaut
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@company.local';
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'TempAdmin123!';

  const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);

  const adminUser = await prisma.user.create({
    data: {
      email: defaultAdminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      mustChangePassword: true,
    },
  });

  console.log('✅ Default admin user created:');
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Role: ${adminUser.role}`);
  console.log(`   Must change password: ${adminUser.mustChangePassword}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change the default password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });