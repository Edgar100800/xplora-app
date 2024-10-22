import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'


const prisma = new PrismaClient()

export async function POST(request: Request) {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { mediaId, file, title, description } = await request.json()
    const media = await prisma.media.findUnique({ where: { id: mediaId } })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Decode base64 file data
    const { name, type, base64Data } = file
    const buffer = Buffer.from(base64Data.split(',')[1], 'base64')

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}_${name}`
    const { data, error } = await supabase.storage
      .from('ihc-project-content-bucket')
      .upload(`images/${fileName}`, buffer, {
        contentType: type,
        upsert: false
      })

    if (error) {
      console.error('Supabase storage error:', error)
      throw new Error('Failed to upload image to storage')
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('ihc-project-content-bucket')
      .getPublicUrl(`images/${fileName}`)

    // Create image record in the database
    const image = await prisma.image.create({
      data: {  media_id: mediaId, url: publicUrl, title, description },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Error creating image:', error)
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 })
  }
}
