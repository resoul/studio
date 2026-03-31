'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router"; 
import { toAbsoluteUrl } from "@/lib/helpers";

export function Upload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="space-y-5">
      <div className="w-full h-[240px] bg-accent/70 border border-border rounded-lg flex items-center justify-center">
        <div className="relative flex items-center justify-center w-full h-full">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="max-w-full max-h-full object-contain" />
          ) : (
            <UserIcon className="size-[40px] text-muted-foreground/60" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="category-image-upload"
          />
          <label htmlFor="category-image-upload" className="absolute bottom-3 right-3">
            <Button size="sm" variant="outline" asChild>
              <span>Upload</span>
            </Button>
          </label>
        </div>
      </div>

      {/* Company */}
      <div className="">
        {[
          { label: "Company", value: "HorizonTech" },
          { label: "Email", value: "j.dejong@htech.com" },
          { label: "Phone No.", value: "+31 6 1234 5678" },
          { 
            label: "Country", 
            value: (
              <div className="flex items-center gap-1.5">
                <img
                  src={toAbsoluteUrl(`/media/brand-logos/netherlands.svg`)}
                  alt="Netherlands flag"
                  className="w-4 h-4"
                />
                <span>Netherlands</span>
              </div>
            )
          },
          { label: "Time Zone", value: "CET, Amsterdam" }
        ].map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-normal text-secondary-foreground/80">{item.label}</span>
              {item.label === "Email" ? (
                <Link
                  to={"#"} 
                  className="text-2sm font-normal text-foreground hover:text-primary"
                >
                  {item.value}
                </Link>
              ) : (
                <span className="text-2sm font-normal text-foreground">{item.value}</span>
              )}
            </div>
            {index < 4 && <Separator className="my-2.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}   