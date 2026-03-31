'use client';

import { Statistics4 } from "./components/statistics4";
import { DetailsInvoiceTable } from "../../tables/details-invoice";

export function CustomerDetailsInvoice() {
  return (
    <div className="space-y-5">
      <Statistics4 /> 
      <DetailsInvoiceTable />
    </div>
  );
}