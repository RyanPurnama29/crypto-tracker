import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const transaction = await prisma.transaction.findMany();
    return new Response(JSON.stringify(transaction), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
