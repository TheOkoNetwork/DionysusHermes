import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest, {
  params,
}: {
  params: Promise<{  order_key: string }>
}): Promise<NextResponse<unknown>> {
  try {
    const { order_key } = await params;

    // Fetch PDF from your storage/service
    const olympus_pdf_url = `${process.env.OLYMPUS_URL}/pdf/tickets/${order_key}`;

    console.log("Fetching PDF from:", olympus_pdf_url);
    const response = await fetch(olympus_pdf_url);

    if (!response.ok) {
      throw new Error("PDF not found");
    }

    // Get PDF buffer
    const pdfBuffer = await response.arrayBuffer();

    // Return PDF response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="order-${order_key}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF fetch error:", error);

    return new NextResponse("Error fetching PDF", { status: 500 });
  }
}
