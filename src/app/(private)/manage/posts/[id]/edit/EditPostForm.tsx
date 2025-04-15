'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { updatePost } from '@/lib/actions/updatePost'
import 'highlight.js/styles/github.css' // コードハイライト用のスタイル
import Image from 'next/image'
import { useActionState, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import TextareaAutosize from 'react-textarea-autosize'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

type EditPostFormProps = {
  post: {
    id: string
    title: string
    content: string
    topImage?: string | null
    published: boolean
  }
}

type ActionState = {
  success: boolean
  errors: Record<string, string[]>
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [contentLength, setContentLength] = useState(post.content.length)
  const [imagePreview, setImagePreview] = useState(post.topImage)
  const [published, setPublished] = useState(post.published)
  const [preview, setPreview] = useState(false)

  // サーバーアクションの設定
  const [state, formAction] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      // サーバーに送信する前に安全に値を設定
      formData.set('postId', post.id)
      formData.set('oldImageUrl', post.topImage || '')
      return await updatePost(prevState, formData)
    },
    {
      success: false,
      errors: {},
    }
  )

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setContentLength(value.length)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== post.topImage) {
        // 画像のURLを解放する
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview, post.topImage])

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">記事を編集(Markdown対応)</h1>
      <form className="space-y-4" action={formAction}>
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="タイトルを入力してください"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {state.errors.title && (
            <p className="text-red-500 text-sm mt-1">{state.errors.title.join(', ')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="topImage">トップ画像</Label>
          <Input
            type="file"
            id="topImage"
            accept="image/*"
            name="topImage"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt={post.title}
                width={200}
                height={200}
                sizes="200px"
                className="w-[200px] h-auto"
                priority
              />
            </div>
          )}
          {state.errors.topImage && (
            <p className="text-red-500 text-sm mt-1">{state.errors.topImage.join(', ')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="content">内容(Markdown)</Label>
          <TextareaAutosize
            id="content"
            name="content"
            className="w-full border p-2"
            placeholder="Markdown形式で入力してください"
            minRows={8}
            value={content}
            onChange={handleContentChange}
          />
          {state.errors.content && (
            <p className="text-red-500 text-sm mt-1">{state.errors.content.join(', ')}</p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">文字数: {contentLength}</div>
        <div>
          <Button type="button" onClick={() => setPreview(!preview)}>
            {preview ? 'プレビューを閉じる' : 'プレビューを表示'}
          </Button>
        </div>
        {preview && (
          <div className="border p-4 bg-gray-50 prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        <RadioGroup
          value={published.toString()}
          name="published"
          onValueChange={(value) => setPublished(value === 'true')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="published-one" />
            <Label htmlFor="published-one" className="cursor-pointer">
              表示
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="published-two" />
            <Label htmlFor="published-two" className="cursor-pointer">
              非表示
            </Label>
          </div>
        </RadioGroup>

        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          更新する
        </Button>
      </form>
    </div>
  )
}
