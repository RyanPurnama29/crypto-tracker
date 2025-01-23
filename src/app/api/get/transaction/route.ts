import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';

export async function GET() {
  try {
    const transaction = await prisma.transaction.findMany();
    // return new Response(JSON.stringify(transaction), { status: 200, headers: { 'Content-Type': 'application/json' } });
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
    // return new Response(JSON.stringify({ error }), {
    //   status: 500,
    //   headers: { 'Content-Type': 'application/json' },
    // });
  }
}
