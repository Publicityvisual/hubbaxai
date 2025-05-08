'use client';

import { User } from 'next-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileHeader } from '@/components/profile-header';
import { ProfilePasswordChange } from '@/components/profile-password-change';
import { ProfilePersonaManager } from '@/components/profile-persona-manager';
import { ProfileSettings } from '@/components/profile-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDialog({ user, isOpen, onClose }: ProfileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ProfileHeader />
          
          <Tabs defaultValue="account" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="personas">Personas</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="apikeys">API Keys</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-6">
              <ProfilePasswordChange />
            </TabsContent>
            
            <TabsContent value="personas" className="mt-6">
              <ProfilePersonaManager />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="apikeys" className="mt-6">
              <div className="p-6 border rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-4">API Key Management</h3>
                <p className="text-muted-foreground">
                  This feature is coming soon. You'll be able to manage API keys for programmatic access.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 