import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    console.log(JSON.stringify(users));
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {id, full_name, email, avatar_url } = await request.json();

    const user = await prisma.user.create({
      data: { 
        id,
        full_name,
        email, 
        avatar_url,
        // Note: We're not storing the password in the database as per the schema
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// ... existing code ...