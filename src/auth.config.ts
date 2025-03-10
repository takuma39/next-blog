import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login', // サインインページのパスを指定
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user // ユーザーがログインしているかどうかをチェック
      const isOnDashboard =
        nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/manage') // ダッシュボードまたは管理ページにいるかどうかをチェック
      if (isOnDashboard) {
        if (isLoggedIn) return true // ログインしている場合はアクセスを許可
        return Response.redirect(new URL('/login', nextUrl)) // 未認証ユーザーをログインページにリダイレクト
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl)) // ログイン済みユーザーがログインページにアクセスした場合はダッシュボードにリダイレクト
      }
      return true // その他のページはそのままアクセスを許可
    },
  },
  providers: [], // プロバイダーを空の配列で追加（後で追加可能）
} satisfies NextAuthConfig
