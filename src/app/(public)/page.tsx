import { getPosts, searchPosts } from '@/lib/post'
import PostCard from '@/components/post/PostCard'
import { Post } from '@/types/post'

type SearchParams = {
  search?: string
}

export default async function PostPage({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.search || ''

  const posts = query ? ((await searchPosts(query)) as Post[]) : ((await getPosts()) as Post[])
  return (
    <div className="container mx-auto px-4 py-8">
      {posts.length === 0 ? (
      <p className="text-center text-gray-500">記事が見つかりませんでした</p>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
        <PostCard key={post.id} post={post} />
        ))}
      </div>
      )}
    </div>
  )
}
