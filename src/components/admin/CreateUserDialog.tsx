
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useCreateUser } from '@/hooks/admin/useCreateUser';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ open, onClose, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('student');
  
  const { createUser, isCreating } = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !role) {
      toast.error('All fields are required');
      return;
    }

    try {
      await createUser({
        fullName,
        email,
        password,
        role
      });
      
      // Reset form
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('student');
      
      onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>User Role</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="coordinator" id="coordinator" />
                <Label htmlFor="coordinator">Coordinator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Administrator</Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
