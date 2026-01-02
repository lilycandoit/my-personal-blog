import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function changePassword() {
  const email = await new Promise<string>((resolve) => {
    rl.question('Enter admin email (default: admin@example.com): ', (answer) => {
      resolve(answer || 'admin@example.com');
    });
  });

  const newPassword = await new Promise<string>((resolve) => {
    rl.question('Enter new password: ', (answer) => {
      resolve(answer);
    });
  });

  if (!newPassword || newPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log('✅ Password updated successfully!');
  await prisma.$disconnect();
  rl.close();
}

changePassword().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
