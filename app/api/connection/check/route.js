import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { ip_address, port } = await request.json();

    if (!ip_address || !port) {
      return NextResponse.json({ error: 'IP address and port are required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_ZK_API_URL}/connection/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip_address, port }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ status: 'Connection failed', error: errorData.error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: 'Connection failed', error: 'Internal server error' }, { status: 500 });
  }
}