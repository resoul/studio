/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Link } from "react-router";
import { Rating } from "@/components/ui/rating";
import { Separator } from "@/components/ui/separator";

const cardData = [
  {
    date: "29 Aug, 25",
    orders: [
      {
        product: "Air Max 270 React Eng...",
        tooltip: "Air Max 270 React Engineered",
        sku: "WM-8421",
        image: "11.png",
        rating: 4,
        text: "These shoes exceeded my expectations. The design is modern, they feel incredibly comfortable during long walks, and the materials seem durable. Delivery was quicker than expected. Definitely worth the price, highly recommended purchase."
      }
    ]
  },
  {
    date: "03 July, 25",
    orders: [
      {
        product: "Trail Runner Z2",
        tooltip: "",
        sku: "UC-3990", 
        image: "1.png",
        rating: 5,
        text: "I've been using these trail runners for daily jogs, and they perform exceptionally. Excellent grip on various terrains, breathable fabric, and lightweight feel. The cushioning absorbs impact well. Arrived sooner than expected."
      }
    ]
  },
  {
    date: "17 May, 25",
    orders: [
      {
        product: "Urban Flex Knit Low…",
        tooltip: "Urban Flex Knit Low Top Shoes",
        sku: "KB-8820",
        image: "2.png",
        rating: 5,
        text: "Super comfortable sneakers with a stylish look. They fit perfectly, and the knit material keeps my feet cool throughout the day. Great for casual wear or light workouts. Shipping was smooth and on time."
      }
    ]
  },
  {
    date: "28 Dec, 23",
    orders: [
      {
        product: "Blaze Street Classic",
        tooltip: "",
        sku: "LS-1033",
        image: "15.png",
        rating: 2,
        text: "The style is nice, but they feel stiff and took time to break in. Quality is decent, yet I expected more comfort for the price."
      }
    ]
  },
  {
    date: "15 Mar, 25",
    orders: [
      {
        product: "Nike Air Force 1...",
        tooltip: "Nike Air Force 1 Low White",
        sku: "NK-2055",
        image: "13.png",
        rating: 4,
        text: "Classic design that never goes out of style. The white leather is clean and easy to maintain. Comfortable for all-day wear, though they run a bit narrow. Great value for a timeless sneaker."
      }
    ]
  },
  {
    date: "02 Feb, 25",
    orders: [
      {
        product: "Adidas Stan Smith...",
        tooltip: "Adidas Stan Smith Original White",
        sku: "AD-7890",
        image: "15.png",
        rating: 3,
        text: "Simple and elegant design. The leather quality is good, but they took longer to break in than expected. Comfortable once worn in, perfect for casual occasions."
      }
    ]
  }
];

export function CardDate() {  
  return (
    <div className="grid xl:grid-cols-2 gap-5">
      <TooltipProvider>
        {cardData.map((card, cardIndex) => (
          <Card key={cardIndex} className="bg-accent/70 rounded-md shadow-none h-full"> 
            <CardContent className="p-0 h-full flex flex-col"> 
              <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">{card.date}</h3>
              <div className="bg-background h-full rounded-md m-1 mt-0 border border-input p-5 px-3.5">
                {card.orders.map((order, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[40px] w-[50px] shadow-none shrink-0">
                          <img
                            src={toAbsoluteUrl(`/media/store/client/1200x1200/${order.image}`)}
                            className="cursor-pointer h-[40px]"
                            alt="image"
                          />
                        </Card>

                        <div className="flex flex-col gap-1">
                          {order.product.includes('…') || order.product.includes('...') ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  to="#"
                                  className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                                >
                                  {order.product}
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{(order as any).tooltip || order.product.replace(/[….]/g, '')}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Link
                              to="#"
                              className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                            >
                              {order.product}
                            </Link>
                          )}

                          <span className="inline-flex items-center gap-0.5">
                            <span className="text-xs text-muted-foreground uppercase">
                              SKU:
                            </span>{' '}
                            <span className="text-xs font-medium text-secondary-foreground">
                              {order.sku}
                            </span>
                          </span>
                        </div>
                      </div>
                      <Rating rating={order.rating} />
                    </div> 
                    <Separator className="my-3.5"/>

                    <p className="text-2sm text-foreground font-normal leading-5">
                      {order.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </TooltipProvider>
    </div>  
  );
}