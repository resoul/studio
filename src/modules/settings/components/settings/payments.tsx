import { GeneralPaymentSettings } from "./components/payments/general-payment-settings";
import { TaxSettings } from "./components/payments/tax-settings";
import { InvoicesReceipts } from "./components/payments/invoices-receipts";

export function Payments() {
  return (
    <div className="space-y-5">
      <GeneralPaymentSettings />
      <TaxSettings />
      <InvoicesReceipts />
    </div>
  );
}