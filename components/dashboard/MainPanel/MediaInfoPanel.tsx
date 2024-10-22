import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

function MediaInfoPanel({ name, mediaid }: { name: string; mediaid: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleEdit = async () => {
    try {
      const response = await fetch('/api/media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: mediaid, name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update media');
      }

      const updatedMedia = await response.json();
      console.log("Media updated:", updatedMedia);
      setIsEditOpen(false);
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: mediaid }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      const result = await response.json();
      console.log("Media deleted:", result);
      setIsDeleteOpen(false);
      // Remove the mediaId from the query params
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('mediaId');
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({}, '', newUrl);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  return (
    <div>
      <div className="mt-4 flex flex-row justify-between">
        <div>
          <h1 className="text-2xl font-bold">Name: {name}</h1>
          <h3 className="text-md font-light mb-4">Item ID: {mediaid}</h3>
        </div>
        <div>
          <Button onClick={() => setIsEditOpen(true)} className="mr-2">
            <FaEdit className="mr-1" /> Edit
          </Button>
          <Button onClick={() => setIsDeleteOpen(true)} variant="destructive">
            <FaTrash className="mr-1" /> Delete
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {/* <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
            <DialogDescription>
              Enter a new name for the item.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New name"
          />
          <DialogFooter>
            <Button onClick={handleEdit}>Save</Button>
            <Button onClick={() => setIsEditOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDelete} variant="destructive">
              Yes, Delete
            </Button>
            <Button onClick={() => setIsDeleteOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MediaInfoPanel;
