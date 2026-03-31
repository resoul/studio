'use client';

import { Card } from "@/components/ui/card";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";

export function CardPayment() {
  const [selectedMethods, setSelectedMethods] = useState(['visa', 'ideal']);

  const paymentMethods = [
    {
      id: 'visa',
      name: 'Visa',
      description: 'Credit/Debit Cards',
      logo: 'visa.svg'
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      description: 'Credit/Debit Cards',
      logo: 'mastercard.svg'
    },
    {
      id: 'amex',
      name: 'American Express',
      description: 'Credit/Debit Cards',
      logo: 'american-express.svg'
    },
    {
      id: 'sepa',
      name: 'SEPA',
      description: 'EU Bank Transfer',
      logo: 'sepa.svg'
    },
    {
      id: 'ideal',
      name: 'Ideal',
      description: 'Dutch Payment Method',
      logo: 'ideal.svg'
    }
  ];

  const toggleMethod = (methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {paymentMethods.map((method) => (
         <Card
           key={method.id}
           className={`p-2 rounded-md cursor-pointer ${
             selectedMethods.includes(method.id) 
               ? 'border-muted-foreground/40'  
               : ''
           }`}
           onClick={() => toggleMethod(method.id)}
         >
          <div className="flex items-center justify-between mb-3">
            <Card className="flex items-center justify-center rounded-md size-[36px] shadow-xs shrink-0">
              <div className="flex items-center justify-center bg-accent/70 rounded-md size-[30px]">
                <img
                  src={toAbsoluteUrl(
                    `/media/brand-logos/${method.logo}`,
                  )} 
                  alt="image"
                  className="size-6 rounded-md"
                />
              </div>
            </Card>
            <div className="size-6 flex items-center justify-center">
              {selectedMethods.includes(method.id) ? (
                <CircleCheck
                  className="fill-green-500 !text-background size-6"
                />
              ) : (
                <Circle className="size-5 text-muted-foreground/50"/>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-2sm text-foreground">
              {method.name}
            </h3>
            <span className="text-xs text-muted-foreground font-normal">
              {method.description}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}