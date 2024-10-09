import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Task } from '@/types/dashboard'

interface TaskSectionProps {
  tasks: Task[]
  selectedList: string | null
  onTaskCreated: () => void
  userId: string | undefined
}

export default function TaskSection({ tasks, selectedList, onTaskCreated, userId }: TaskSectionProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskStatus, setNewTaskStatus] = useState('TODO')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  const createTask = async () => {
    if (newTaskTitle.trim() && selectedList && userId) {
      const formattedDueDate = newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          listId: selectedList,
          title: newTaskTitle.trim(),
          description: newTaskDescription.trim(),
          status: newTaskStatus,
          dueDate: formattedDueDate
        })
      })

      if (response.ok) {
        setNewTaskTitle('')
        setNewTaskDescription('')
        setNewTaskStatus('TODO')
        setNewTaskDueDate('')
        onTaskCreated()
      }
    }
  }

  return (
    <div className="w-2/3 pl-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      {selectedList && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4 bg-[#8C7A6B] hover:bg-[#6B5744]">Create New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Task</DialogTitle>
            </DialogHeader>
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task Title"
              className="mb-2"
            />
            <Textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task Description"
              className="mb-2"
            />
            <select
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <Input
              type="datetime-local"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="mb-2"
            />
            <Button onClick={createTask}>Create Task</Button>
          </DialogContent>
        </Dialog>
      )}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-3 rounded shadow">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Due Date: {task.dueDate}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}