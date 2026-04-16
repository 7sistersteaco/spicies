import { isAdmin } from '@/app/actions/admin';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthorized = await isAdmin();

  if (!isAuthorized) {
    return (
      <Section className="pt-16">
        <Container>
          <AdminLoginForm />
        </Container>
      </Section>
    );
  }

  return <>{children}</>;
}
