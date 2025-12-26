'use server'

import { getDb } from '@/lib/db'
import { hashPassword, verifyPassword, createSession, deleteSession } from '@/lib/auth'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

export async function signup(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = SignupSchema.safeParse({ email, password })
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const db = getDb()
    if (!db) return { message: 'Database error' }

    try {
        const hashedPassword = await hashPassword(password)

        const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
        const info = stmt.run(email, hashedPassword)

        await createSession(info.lastInsertRowid as number)
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { message: 'Email already exists' }
        }
        return { message: 'Failed to create account' }
    }

    redirect('/')
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = LoginSchema.safeParse({ email, password })
    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const db = getDb()
    if (!db) return { message: 'Database error' }

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any

        if (!user || !(await verifyPassword(password, user.password_hash))) {
             return { message: 'Invalid credentials' }
        }

        await createSession(user.id)
    } catch (error) {
        return { message: 'Login failed' }
    }

    redirect('/')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}
