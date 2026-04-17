import { getContactMessages } from '@/app/actions/contact';
import AdminMessageList from './AdminMessageList';

export const metadata = {
  title: 'Admin | Inbox',
  description: 'Manage customer contact messages.'
};

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-cream">Inbox</h1>
        <p className="text-sm text-cream/50 mt-1">Customer inquiries from the contact form.</p>
      </div>

      <AdminMessageList messages={messages} />
    </div>
  );
}
