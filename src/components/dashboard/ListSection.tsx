import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { List } from '@/types/dashboard'

interface ListSectionProps {
  lists: List[]
  selectedList: string | null
  onListSelect: (listId: string) => void
  onListCreated: () => void
  userId: string | undefined
}

export default function ListSection({ lists, selectedList, onListSelect, onListCreated, userId }: ListSectionProps) {
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const createList = async () => {
    if (newListName.trim() && userId && !isCreating) {
      setIsCreating(true)
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: newListName.trim(),
          description: newListDescription.trim()
        })
      })

      if (response.ok) {
        setNewListName('')
        setNewListDescription('')
        onListCreated()
        setIsDialogOpen(false)
      }
      setIsCreating(false)
    }
  }

  return (
    <div className="w-1/3 pr-4">
      <h2 className="text-2xl font-bold mb-4">Your Lists</h2>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-[#8C7A6B] hover:bg-[#6B5744]">Create New List</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New List</DialogTitle>
          </DialogHeader>
          <Input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List Name"
            className="mb-2"
          />
          <Textarea
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            placeholder="List Description"
            className="mb-2"
          />
          <Button onClick={createList} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create List'}
          </Button>
        </DialogContent>
      </Dialog>
      <ul className="space-y-2">
        {lists.map((list) => (
          <li
            key={list.id}
            className={`bg-white p-3 rounded shadow cursor-pointer ${selectedList === list.id ? 'border-2 border-[#8C7A6B]' : ''}`}
            onClick={() => onListSelect(list.id)}
          >
            {list.name}
          </li>
        ))}
      </ul>
    </div>
  )
}