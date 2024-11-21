import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return NextResponse.json({ message: 'Authenticated', user })
  } else {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  }
}