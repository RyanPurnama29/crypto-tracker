import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const etf = await prisma.etf.findMany();
    return new Response(JSON.stringify(etf), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
