import { prisma } from '../src/lib/prisma';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function changeEmail() {
  const currentEmail = await new Promise<string>((resolve) => {
    rl.question('Enter current admin email (default: admin@example.com): ', (answer) => {
      resolve(answer || 'admin@example.com');
    });
  });

  const newEmail = await new Promise<string>((resolve) => {
    rl.question('Enter new admin email: ', (answer) => {
      resolve(answer);
    });
  });

  if (!newEmail || !newEmail.includes('@')) {
    console.error('❌ Invalid email address');
    process.exit(1);
  }

  // Check if new email already exists
  const existing = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (existing) {
    console.error('❌ Email already exists in database');
    process.exit(1);
  }

  // Update email
  await prisma.user.update({
    where: { email: currentEmail },
    data: { email: newEmail },
  });

  console.log(`✅ Email updated successfully!`);
  console.log(`   Old: ${currentEmail}`);
  console.log(`   New: ${newEmail}`);
  await prisma.$disconnect();
  rl.close();
}

changeEmail().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
