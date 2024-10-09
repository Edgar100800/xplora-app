import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a new list
export async function POST(request: Request) {
  try {
    const { userId, name, description } = await request.json()
    const list = await prisma.list.create({
      data: { userId, name, description }
    })
    return NextResponse.json(list, { status: 201 })
  } catch (error) {
    console.error('Error to create list:', error)
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 })
  }
}

// Get all lists for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const lists = await prisma.list.findMany({
      where: { userId }
    })
    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error to fetch lists:', error)
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 })
  }
}

// Update a list
export async function PUT(request: Request) {
  try {
    const { id, name, description } = await request.json()
    const updatedList = await prisma.list.update({
      where: { id },
      data: { name, description }
    })
    return NextResponse.json(updatedList)
  } catch (error) {
    console.error('Error to update list:', error)
    return NextResponse.json({ error: 'Failed to update list' }, { status: 500 })
  }
}

// Delete a list
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
  }

  try {
    await prisma.list.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'List deleted successfully' })
  } catch (error) {
    console.error('Error to delete list:', error)
    return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 })
  }
}