import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, usage } from '@/lib/db/schema-nextauth';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dhe fjalëkalimi janë të detyrueshëm' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ky email është tashmë në përdorim' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db.insert(users).values({
      name: name || null,
      email,
      passwordHash,
    }).returning();

    // Create usage record for the new user
    await db.insert(usage).values({
      userId: newUser.id,
      promptsMonth: 0,
      promptsDay: 0,
    });

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Dicka shkoi keq. Ju lutem provoni përserë.' },
      { status: 500 }
    );
  }
}
