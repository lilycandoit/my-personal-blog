import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { getPosts } from '@/lib/posts';
import Link from 'next/link';
import { PenLine, FileText, LayoutGrid, Plus, Edit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [postCount, projectCount, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    getPosts({ limit: 5 })
  ]);

  const prompts = [
    "What's one small thing you learned today?",
    "If you could explain a complex topic to a child, what would it be?",
    "Describe a moment where code felt like art.",
    "What's a project you're dreaming of building?",
    "Write about a coding challenge that made you think differently."
  ];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div className="max-w-[900px] mx-auto">
      <header className="mb-12">
        <h1 className="m-0 text-[2.5rem] font-extrabold">Welcome back, Lily.</h1>
        <p className="text-muted-light dark:text-muted-dark text-lg mt-2">It's a good day to think and build.</p>
      </header>

      {/* Writing Prompt Card */}
      <div className="admin-card mb-12 bg-gradient-to-br from-[#f8faff] to-[#eef4fc] border border-secondary flex items-center gap-6 p-8">
        <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-primary shadow-[0_4px_12px_rgba(93,156,236,0.15)]">
          <PenLine size={24} />
        </div>
        <div className="flex-1">
          <h3 className="m-0 text-[0.9rem] text-primary uppercase tracking-wider">Daily Writing Prompt</h3>
          <p className="mt-1 mb-0 text-xl font-medium text-text-light dark:text-text-dark">&ldquo;{randomPrompt}&rdquo;</p>
        </div>
        <Link href="/admin/posts/new" className="primary flex items-center gap-2 py-3 px-6">
          <Plus size={18} /> Start Writing
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 mb-12">
        <Link href="/admin/posts" className="no-underline border-none">
          <div className="admin-card flex items-center gap-4 cursor-pointer transition-all duration-200">
            <div className="p-3 bg-primary/10 rounded-[10px] text-primary">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="m-0 text-[0.85rem] text-muted-light dark:text-muted-dark">Total Posts</h3>
              <p className="m-0 text-2xl font-bold">{postCount}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/projects" className="no-underline border-none">
          <div className="admin-card flex items-center gap-4 cursor-pointer transition-all duration-200">
            <div className="p-3 bg-secondary/10 rounded-[10px] text-secondary">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h3 className="m-0 text-[0.85rem] text-muted-light dark:text-muted-dark">Active Projects</h3>
              <p className="m-0 text-2xl font-bold">{projectCount}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <h2 className="m-0">Recent Posts</h2>
        <Link href="/posts" className="text-[0.9rem] text-primary border-none">View all &rarr;</Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {recentPosts.length === 0 ? (
            <div className="p-12 text-center text-muted-light dark:text-muted-dark">
              No thoughts shared yet.
              <br/>
              <Link href="/admin/posts/new" className="text-primary inline-block mt-4">Write your first post</Link>
            </div>
        ) : (
            <table className="w-full border-collapse">
            <thead className="bg-[#fcfdfe] border-b border-border-light dark:border-border-dark">
                <tr>
                <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">TITLE</th>
                <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">CATEGORY</th>
                <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">DATE</th>
                <th className="py-4 px-6 text-center text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {recentPosts.map(post => {
                  // Check if post was updated after creation
                  const wasEdited = new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();
                  const dateToShow = wasEdited ? new Date(post.updatedAt) : new Date(post.createdAt);
                  const formattedDate = formatDate(dateToShow, post.timezone, post.location, 'full');

                  return (
                    <tr key={post.id} className="admin-table-row border-b border-[#f8faff] transition-colors duration-200">
                      <td className="py-5 px-6 font-medium">
                        <Link href={`/posts/${post.slug}`} className="border-none">{post.title}</Link>
                      </td>
                      <td className="py-5 px-6">
                          <span className="tag">{post.category}</span>
                      </td>
                      <td className="py-5 px-6 text-[0.9rem] text-muted-light dark:text-muted-dark">
                        <div className="flex flex-col gap-1">
                          <span>{formattedDate}</span>
                          {wasEdited && (
                            <span className="text-xs text-primary">
                              (Updated)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="border-none inline-flex items-center gap-2 py-2 px-3 rounded-md bg-primary/10 text-primary text-[0.85rem] transition-all duration-200"
                        >
                          <Edit size={14} /> Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
}


