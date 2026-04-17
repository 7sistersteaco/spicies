'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { signOutUser } from '@/app/actions/auth';

export default function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOutUser();
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLogout}
        title="Log Out"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        variant="primary"
      />
      
      <Button 
        variant="secondary" 
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto"
      >
        Log Out
      </Button>
    </>
  );
}
