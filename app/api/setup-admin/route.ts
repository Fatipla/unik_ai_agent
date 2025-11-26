import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema-nextauth';
import { adminUsers } from '@/lib/db/schema-conversations';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Secret key for admin creation (change this!)
const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_SECRET || 'change-me-in-production';

export async function POST(req: Request) {
  try {
    const { email, password, name, setupKey } = await req.json();

    // Verify setup key
    if (setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    let userId: string;

    if (existingUser) {
      // User exists, just make them admin
      userId = existingUser.id;
    } else {
      // Create new user
      const passwordHash = await bcrypt.hash(password, 10);
      const [newUser] = await db.insert(users).values({
        name: name || 'Admin',
        email,
        passwordHash,
      }).returning();
      userId = newUser.id;
    }

    // Check if already admin
    const existingAdmin = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.userId, userId),
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'User is already an admin',
        userId,
      });
    }

    // Make user admin
    await db.insert(adminUsers).values({
      userId,
      role: 'super_admin',
      permissions: JSON.stringify(['full_access']),
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      userId,
      email,
    });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin' },
      { status: 500 }
    );
  }
}
