'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUser } from '@/lib/actions/createUser'
import { useActionState, useState } from 'react'
import { registerSchema } from '@/validations/user'

export default function RegisterForm() {
  const [state, formAction] = useActionState(createUser, {
    success: false,
    errors: {},
  })

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const result = registerSchema.safeParse({ [name]: value })

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path.includes(name))
      setClientErrors((prev) => ({
        ...prev,
        [name]: fieldError ? fieldError.message : '',
      }))
    }
    return
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザー登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input id="name" type="text" name="name" required onBlur={handleBlur} />
            {(state.errors.name || clientErrors.name) && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.name?.join(', ') || clientErrors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" name="email" required onBlur={handleBlur} />
            {(state.errors.email || clientErrors.email) && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.email?.join(', ') || clientErrors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" type="password" name="password" required onBlur={handleBlur} />
            {(state.errors.password || clientErrors.password) && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.password?.join(', ') || clientErrors.password}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード(確認)</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              onBlur={handleBlur}
            />
            {(state.errors.confirmPassword || clientErrors.confirmPassword) && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.confirmPassword?.join(', ') || clientErrors.confirmPassword}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            登録
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
