'use client';

import { Statistics2 } from "./components/statistics2";
import { DetailsOrdersTable } from "../../tables/details-orders";

export function CustomerDetailsOrders() {
  return (
    <div className="space-y-5">
      <Statistics2 /> 
      <DetailsOrdersTable />
    </div>
  );
}