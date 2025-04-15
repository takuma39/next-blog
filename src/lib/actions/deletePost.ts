'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function deletePost(postId: string): Promise<void> {
  await prisma.post.delete({
    where: { id: postId },
  })

  redirect('/dashboard')
}
