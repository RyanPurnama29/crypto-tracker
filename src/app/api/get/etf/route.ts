import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';

export async function GET() {
  try {
    const etf = await prisma.etf.findMany();
    // return new Response(JSON.stringify(etf), { status: 200, headers: { 'Content-Type': 'application/json' } });
    return NextResponse.json(etf);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
    // return new Response(JSON.stringify({ error }), {
    //   status: 500,
    //   headers: { 'Content-Type': 'application/json' },
    // });
  }
}
