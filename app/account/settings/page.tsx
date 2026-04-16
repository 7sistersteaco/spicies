import { redirect } from 'next/navigation';
import { getAccountDashboardData } from '@/app/actions/account';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import SettingsForm from './SettingsForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | 7 Sisters Tea & Co.',
  description: 'Manage your account settings.'
};

export default async function SettingsPage() {
  const data = await getAccountDashboardData();

  if (!data.ok || !data.user || !data.customer) {
    redirect('/login');
  }

  return (
    <Section className="pt-24 pb-20 min-h-screen">
      <Container size="shrunken">
        <SettingsForm 
          customer={{
            full_name: data.customer.full_name || '',
            phone: data.customer.phone || '',
            email: data.user.email || ''
          }} 
        />
      </Container>
    </Section>
  );
}
