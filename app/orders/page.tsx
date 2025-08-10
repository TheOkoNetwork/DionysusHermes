"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { title } from "@/components/primitives";

interface Order {
  order_key: string;
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  description: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetch("/api/request/customerOrderList")
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();

            throw new Error(
              `Failed to fetch orders. Status: ${res.status} ${res.statusText}. Response: ${errorText}`,
            );
          }

          return res.json();
        })
        .then((data) => {
          setOrders(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [session]);

  const handleRowClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };


  if (status === "unauthenticated") {
    localStorage.setItem("redirectTo", "/orders");
    window.location.href = "/signin";

    return <div>Please sign in to view your orders.</div>;
  }

  
  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error}</div>;
  }

 
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className={title()}>Orders</h1>

      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          {/* <TableColumn>Date</TableColumn> */}
          <TableColumn>Description</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              onClick={() => handleRowClick(order.id)}
            >
              <TableCell>{order.id}</TableCell>
              {/* <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell> */}
              <TableCell>{order.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
