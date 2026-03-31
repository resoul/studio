'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Link } from "react-router";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export function RecentOrders() {
  const orders = [
    {
      id: "ORD-001",
      product: "Air Max 270 React Eng...",
      tooltip: "Air Max 270 React Engineered",
      sku: "WM-8421",
      image: "1.png"
    },
    {
      id: "ORD-002", 
      product: "Trail Runner Z2",
      sku: "UC-3990",
      image: "2.png",
      amount: "$125.00"
    },
    {
      id: "ORD-003",
      product: "Urban Flex Knit Low...",
      tooltip: "Urban Flex Knit Low Top Shoes",
      sku: "KB-8820", 
      image: "3.png"
    }
  ];  

  return (
    <TooltipProvider>
      <Card className="bg-accent/70 rounded-md shadow-none"> 
        <CardContent className="p-0 flex flex-col h-full"> 
          <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">Recent Orders</h3>
          <div className="bg-background rounded-md m-1 mt-0 border border-input py-5 px-3.5 flex flex-col justify-between h-full">
            <div className="space-y-6 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center rounded-md bg-background border border-border size-[36px] shrink-0">
                    <div className="flex items-center justify-center bg-accent/50 rounded-md size-[30px]">
                      <ShoppingCart className="w-5 h-5 fill-indigo-600 text-indigo-600" />
                    </div>
                  </div> 
                  <span className="text-2xl leading-[22px] font-semibold">$472
                    <span className="text-2xl font-semibold text-secondary-foreground/30">.59</span>
                  </span>
                </div>
                <Badge variant="success" size="sm" appearance="light">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  14.73%  
                </Badge>
                <span className="text-xs font-normal text-secondary-foreground/70">vs AOV</span>
              </div> 
              
              { /*Progress Bars*/}
              <div className="flex items-center gap-1">
                <div className="flex flex-col gap-3 flex-1">
                  <Progress className="w-full h-1.5 bg-secondary-foreground/30 rounded-sm" />
                  <span className="text-2sm font-medium text-foreground">$259.03</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Progress className="w-[120px] h-1.5 bg-secondary-foreground/18 rounded-sm" />
                  <span className="text-2sm font-medium text-foreground">$125.00</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Progress  className="w-[76px] h-1.5 bg-secondary-foreground/10 rounded-sm" />
                  <span className="text-2sm font-medium text-foreground">$72.56</span>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div>
              {orders.map((order, index) => (
                <div key={order.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[40px] w-[50px] shadow-xs shrink-0">
                        <img
                          src={toAbsoluteUrl(
                            `/media/store/client/1200x1200/${order.image}`,
                          )}
                          className="cursor-pointer h-[40px]"
                          alt="image"
                        />
                      </Card>

                      <div className="flex flex-col gap-1">
                        {order.product.includes('…') ||
                        order.product.includes('...') ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                to="#"
                                onClick={() => {}}
                                className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                              >
                                {order.product}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{order.tooltip || order.product.replace(/[….]/g, '')}</p>
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
                      <Button variant="outline" size="sm">
                        View item
                      </Button>
                  </div>
                  {index < orders.length - 1 && <Separator className="my-3.5" />}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}