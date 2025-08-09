"use client";
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { QRCodeSVG } from "qrcode.react";
import { useSwipeable } from "react-swipeable"; // Keep useSwipeable
import { useTheme } from "next-themes";
import { isIOS, isMacOs } from "react-device-detect";

interface Order {
  orderStatus: string;
  order_key: string; // Added order_key
  tickets: Ticket[];
}

interface Ticket {
  key: string;
  id: string;
  barcode: string;
  productName: string;
  scanStatus: string;
  ticketProduct?: string;
  ticketType?: string;
}

export default function Page() {
  const { order_id } = useParams();
  console.log(`Using order_id: ${order_id}`)
  const [order, setOrder] = useState<Order | null>(null);
  const { theme } = useTheme(); // Get current theme
  const [loading, setLoading] = useState(true);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (order && currentTicketIndex < order.tickets.length - 1) {
        setCurrentTicketIndex(currentTicketIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentTicketIndex > 0) {
        setCurrentTicketIndex(currentTicketIndex - 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/request/customerOrderView/${order_id}`,
        );

        if (response.ok) {
          const data = await response.json();

          if (data && data.id) {
            setOrder(data);
          } else {
            setOrder(null); // Order not found
          }
        } else {
          console.error("Error fetching order:", response.statusText);
          setOrder(null); // Handle error case
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null); // Handle error case
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_id]);

  const currentTicket = order?.tickets[currentTicketIndex];

  const showGoogleWalletButton = !isIOS && !isMacOs;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 hero-ui">
      {loading && (
        <div className="flex justify-center items-center flex-grow">
          <Spinner color="primary" label="Loading Order..." />
        </div>
      )}

      {!loading && !order && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
          <p>The order with ID {order_id} could not be found.</p>
          <Button as={Link} className="mt-4" color="primary" href="/orders">
            Back to Orders
          </Button>
        </div>
      )}

      {!loading && order && (
        <div className="w-full max-w-md" {...handlers}>
          <h1 className="text-2xl font-bold text-center mb-4">
            Order #{order_id}
          </h1>
          {showGoogleWalletButton && order.order_key && (
            <div className="flex justify-center mb-4">
              <Link
                className="inline-block"
                href={`/api/google_wallet/${order.order_key}`}
              >
                <img
                  alt="Add to Google Wallet"
                  className="w-auto h-10"
                  src={
                    theme === "dark"
                      ? "/img/google_wallet/single/dark.svg"
                      : "/img/google_wallet/single/light.svg"
                  }
                />
              </Link>
            </div>
          )}
          {order.order_key && (
            <div className="flex justify-center mb-4">
              <Button
                as={Link}
                color="primary"
                href={`/api/ticket_pdf/${order.order_key}`}
              >
                Download PDF
              </Button>
            </div>
          )}

          {/* <div className="text-center mb-4">
              <Chip color={order.orderStatus === "PAID" ? "success" : "warning"} variant="flat">
 {order.orderStatus}
              </Chip>
            </div> */}
          <div className="bg-content1 p-6 rounded-lg shadow-md flex flex-col items-center">
            {currentTicket && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Ticket #{currentTicket.id}
                </p>
                <h2 className="text-xl font-semibold mb-2">
                  {currentTicket.productName}
                </h2>
                {currentTicket.ticketProduct && (
                  <p className="text-sm text-gray-600">
                    Product: {currentTicket.ticketProduct}
                  </p>
                )}
                {currentTicket.ticketType && (
                  <p className="text-sm text-gray-600">
                    Class: {currentTicket.ticketType}
                  </p>
                )}

                {/* <div className="mb-4">
                   <Chip color={currentTicket.scanStatus === "NOT_SCANNED" ? "default" : "danger"} variant="flat">
                     {currentTicket.scanStatus === "NOT_SCANNED" ? "Valid" : "Scanned"}
                   </Chip>
                 </div> */}

                <div className="mb-4">
                  <QRCodeSVG size={256} value={currentTicket.barcode} />
                </div>

                {showGoogleWalletButton && (
                  <div className="mb-4">
                    <Link
                      className="inline-block"
                      href={`/api/google_wallet/${order.order_key}/${currentTicket.id}`}
                    >
                      <img
                        alt="Add to Google Wallet"
                        className="w-auto h-10"
                        src={
                          theme === "dark"
                            ? "/img/google_wallet/single/dark.svg"
                            : "/img/google_wallet/single/light.svg"
                        }
                      />
                    </Link>
                  </div>
                )}

                <p className="text-sm text-gray-600 text-center">
                  Swipe left/right to view other tickets.
                </p>
              </>
            )}
          </div>
          {order.tickets.length > 1 && (
            <div className="flex justify-between mt-4 text-sm">
              <span>
                Ticket {currentTicketIndex + 1} of {order.tickets.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
