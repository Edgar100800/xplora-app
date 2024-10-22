'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

import { createClient } from "@/utils/supabase/client";

const ButtonNewMedia = () => {
  const [name, setName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userid = user?.id;
    
    try {
      const response = await fetch(`/api/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, user_id: userid }),
      });

      if (!response.ok) {
        throw new Error('Failed to create media');
      }

      const data = await response.json();
      console.log('Media created:', data);

      // Close the dialog
      setIsDialogOpen(false);

      // Refresh the window with the new mediaId in the query
      router.push(`?mediaId=${data.id}&newmedia=true`);
    } catch (error) {
      console.error('Error creating media:', error);
    }
  };

  return (
    <div className="p-4 border-b">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Media</DialogTitle>
            <DialogDescription>
              Add a new item to your dashboard here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter media name"
              required
            />
            <Button type="submit" className="mt-2 w-full">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ButtonNewMedia;
