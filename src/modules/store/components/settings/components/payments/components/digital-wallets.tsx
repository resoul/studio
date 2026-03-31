'use client';

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toAbsoluteUrl } from "@/lib/helpers";
import { useState } from "react";

export function DigitalWallets() {
  const [wallets, setWallets] = useState({
    applePay: true,
    googlePay: false,
    paypal: false
  });

  const toggleWallet = (wallet: keyof typeof wallets) => {
    setWallets(prev => ({
      ...prev,
      [wallet]: !prev[wallet]
    }));
  };

  const walletMethods = [
    {
      id: 'applePay',
      name: 'Apple Pay',
      description: 'Payments via Apple\'s wallet',
      logo: 'apple-pay.svg',
      enabled: wallets.applePay
    },
    {
      id: 'googlePay',
      name: 'Google Pay',
      description: 'Checkout with Google\'s wallet',
      logo: 'google-pay.svg',
      enabled: wallets.googlePay
    },
    {
      id: 'paypal',
      name: 'Paypal',
      description: 'Pay securely with PayPal',
      logo: 'paypal-1.svg',
      enabled: wallets.paypal
    }
  ];

  return (
    <div className="space-y-0.5">
      {walletMethods.map((wallet) => (
         <Card 
           key={wallet.id} 
           className={`py-3 px-4 border-none shadow-none cursor-pointer ${
             wallet.id === 'applePay' ? 'rounded-b-none' :
             wallet.id === 'googlePay' ? 'rounded-none' :
             wallet.id === 'paypal' ? 'rounded-t-none' : 'rounded-lg'
           } ${
             wallet.enabled ? 'bg-secondary' : 'bg-accent/50'
           }`}
           onClick={() => toggleWallet(wallet.id as keyof typeof wallets)}
         >
          <div className="flex items-center gap-3.5">
            <Switch
              checked={wallet.enabled}
              size="sm"
            />
            <div className="flex items-center gap-3.5">
              <Card className="flex items-center justify-center rounded-md size-[36px] shadow-xs shrink-0">
                <div className="flex items-center justify-center bg-accent/70 rounded-md size-[30px]">
                  <img
                    src={toAbsoluteUrl(
                      `/media/brand-logos/${wallet.logo}`,
                    )} 
                    alt="image"
                    className="size-6 rounded-md"
                  />
                </div>
              </Card>
              <div>
                <h3 className="font-medium text-2sm text-foreground">
                  {wallet.name}
                </h3>
                <p className="text-xs text-muted-foreground font-normal">
                  {wallet.description}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}