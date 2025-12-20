'use client';

import React from 'react';
import OwnerDashboard from '@/components/profile/OwnerDashboard';
import { FloatingNav } from '@/components/aceternity/floating-navbar';
import { globalNavItems } from '@/lib/navigation';

export default function ProfilePage() {
  return (
    <>
      <FloatingNav navItems={globalNavItems} showLoginButton={true} />
      <OwnerDashboard />
    </>
  );
}
