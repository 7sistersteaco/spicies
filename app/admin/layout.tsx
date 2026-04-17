import { isAdmin } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthorized = await isAdmin();
  
  if (!isAuthorized) {
    redirect('/login?reason=admin_required');
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-ink font-body selection:bg-accent selection:text-ink">
      {/* Sidebar - Desktop */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <AdminTopbar userEmail={user?.email} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
