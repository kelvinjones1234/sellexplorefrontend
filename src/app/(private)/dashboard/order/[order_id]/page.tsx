"use client"


import React from "react";
import Main from "./components/Main";
import { useParams } from "next/navigation";

const OrderDetailPage = () => {
  const { order_id } = useParams();
  return (
    <div>
      <Main order_id={order_id} />
    </div>
  );
};

export default OrderDetailPage;
