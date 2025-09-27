
import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Coordinator = {
  name: string;
  email: string;
  phone: string;
  role?: string;
};

const coordinators: Coordinator[] = [
  {
    name: "Joel Suarez",
    email: "JSuarez@hamad.qa",
    phone: "66025955",
    role: "Coordinator"
  },
  {
    name: "Majid Chouikhi",
    email: "mchouikhi@hamad.qa",
    phone: "70220703",
    role: "Coordinator"
  },
  {
    name: "Mohammed Ali Bandaying",
    email: "MBandaying@hamad.qa",
    phone: "33892612",
    role: "Coordinator"
  },
  {
    name: "Ali Abouilaaz",
    email: "AAbouilaaz@hamad.qa",
    phone: "66615069",
    role: "Coordinator"
  },
  {
    name: "Ronald Magbalot Jr",
    email: "RMagbalot@hamad.qa",
    phone: "66615069",
    role: "Developer"
  }
];

const CoordinatorCard: React.FC<{ coordinator: Coordinator }> = ({ coordinator }) => {
  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <User size={16} className="text-primary mr-2" />
            <p className="font-medium">{coordinator.name}</p>
            {coordinator.role && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {coordinator.role}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <Mail size={16} className="text-muted-foreground mr-2" />
            <a 
              href={`mailto:${coordinator.email}`} 
              className="text-sm text-primary hover:underline"
            >
              {coordinator.email}
            </a>
          </div>
          <div className="flex items-center">
            <Phone size={16} className="text-muted-foreground mr-2" />
            <a 
              href={`tel:${coordinator.phone}`} 
              className="text-sm text-primary hover:underline"
            >
              {coordinator.phone}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CoordinatorsDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Program Coordinators</DialogTitle>
          <DialogDescription>
            Contact information for program coordinators and support staff
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <div className="mt-4">
          {coordinators.map((coordinator, index) => (
            <CoordinatorCard key={index} coordinator={coordinator} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
