import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { mediaid: string } }) {

  if (!params.mediaid) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  try {
    const media = await prisma.media.findUnique({
      where: { id: params.mediaid },
      include: { images: true},
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
