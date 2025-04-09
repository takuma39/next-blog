import { PrismaClient } from '@prisma/client'
import * as bycrpt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // クリーンアップ
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword1 = await bycrpt.hash('password', 12)
  const hashedPassword2 = await bycrpt.hash('password', 12)

  // ダミー画像URL
  const dummyImages = [
    'https://picsum.photos/seed/post1/600/400',
    'https://picsum.photos/seed/post2/600/400',
    'https://picsum.photos/seed/post3/600/400',
    'https://picsum.photos/seed/post4/600/400',
  ]

  // ユーザー1作成
  const user1 = await prisma.user.create({
    data: {
      email: 'test1@test.com',
      name: 'Test User 1',
      password: hashedPassword1,
      posts: {
        create: [
          {
            title: 'ユーザー1の最初の投稿',
            content: 'これはユーザー1の最初の投稿です。',
            topImage: dummyImages[0],
            published: true,
          },
          {
            title: 'ユーザー1の2番目の投稿',
            content: 'これはユーザー1の2番目の投稿です。',
            topImage: dummyImages[1],
            published: true,
          },
        ],
      },
    },
  })

  // ユーザー2作成
  const user2 = await prisma.user.create({
    data: {
      email: 'test2@test.com',
      name: 'Test User 2',
      password: hashedPassword2,
      posts: {
        create: [
          {
            title: 'ユーザー2の最初の投稿',
            content: 'これはユーザー2の最初の投稿です。',
            topImage: dummyImages[2],
            published: true,
          },
          {
            title: 'ユーザー2の2番目の投稿',
            content: 'これはユーザー2の2番目の投稿です。',
            topImage: dummyImages[3],
            published: true,
          },
        ],
      },
    },
  })

  console.log({ user1, user2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
