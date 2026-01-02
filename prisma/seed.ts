import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@example.com';
  const password = 'password123'; // Change this!

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
    },
  });

  // Create example Content
  const post = await prisma.post.upsert({
      where: { slug: 'welcome-to-my-space' },
      update: {},
      create: {
          title: 'Welcome to my generic thinking space',
          slug: 'welcome-to-my-space',
          category: 'Life',
          content: '<p>This is the first post in my new database-backed blog. It feels <strong>clean</strong> and <em>calm</em>.</p>',
      }
  });

  const project = await prisma.project.upsert({
      where: { slug: 'personal-blog-v2' },
      update: {},
      create: {
          name: 'Personal Blog V2',
          slug: 'personal-blog-v2',
          description: '<p>A Next.js App Router blog with SQLite and Admin Dashboard.</p>',
          stack: 'Next.js, Prisma, SQLite',
          status: 'completed',
          learnings: 'Authentication and DB integration is powerful.',
      }
  });

  console.log({ user, post, project });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
