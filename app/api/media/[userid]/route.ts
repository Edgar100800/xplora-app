import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { SmallMedia } from '@/types/media'
const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { userid: string } }) {
  
  if (!params.userid) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  } 
  
  try {
    const media: SmallMedia[] = await prisma.media.findMany({
      where: { user_id: params.userid },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}