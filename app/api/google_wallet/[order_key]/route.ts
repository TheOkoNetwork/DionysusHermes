import { NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation'

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ order_key: string }>;
  },
): Promise<NextResponse<unknown>> {
    const { order_key } = await params;
    const olympus_google_wallet_url = `${process.env.OLYMPUS_URL}/google_wallet/${order_key}`;
    redirect(olympus_google_wallet_url);
}
