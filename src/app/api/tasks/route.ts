import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a new task
export async function POST(request: Request) {
  try {
    const { userId, listId, title, description, status, dueDate } = await request.json()
    const task = await prisma.task.create({
      data: { userId, listId, title, description, status, dueDate }
    })
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

// Get all tasks for a user or list
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const listId = searchParams.get('listId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(listId && { listId })
      }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error to fetch tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// Update a task
export async function PUT(request: Request) {
  try {
    const { id, title, description, status, dueDate } = await request.json()
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status, dueDate }
    })
    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// Delete a task
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
  }

  try {
    await prisma.task.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error to delete task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}