'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input, InputAddon, InputGroup } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Country data for phone number input
const countries = [
  { code: "US", name: "United States", dialCode: "+1", flag: "/media/flags/usa.svg" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "/media/flags/united-kingdom.svg" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "/media/flags/canada.svg" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "/media/flags/australia.svg" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "/media/flags/germany.svg" },
  { code: "FR", name: "France", dialCode: "+33", flag: "/media/flags/france.svg" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "/media/flags/italy.svg" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "/media/flags/spain.svg" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "/media/flags/netherlands.svg" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "/media/flags/belgium.svg" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "/media/flags/switzerland.svg" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "/media/flags/austria.svg" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "/media/flags/sweden.svg" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "/media/flags/norway.svg" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "/media/flags/denmark.svg" },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "/media/flags/finland.svg" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "/media/flags/poland.svg" },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "/media/flags/czech-republic.svg" },
  { code: "HU", name: "Hungary", dialCode: "+36", flag: "/media/flags/hungary.svg" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "/media/flags/portugal.svg" },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "/media/flags/greece.svg" },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "/media/flags/turkey.svg" },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "/media/flags/russia.svg" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "/media/flags/japan.svg" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "/media/flags/south-korea.svg" },
  { code: "CN", name: "China", dialCode: "+86", flag: "/media/flags/china.svg" },
  { code: "IN", name: "India", dialCode: "+91", flag: "/media/flags/india.svg" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "/media/flags/singapore.svg" },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "/media/flags/hong-kong.svg" },
  { code: "TW", name: "Taiwan", dialCode: "+886", flag: "/media/flags/taiwan.svg" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "/media/flags/malaysia.svg" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "/media/flags/thailand.svg" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "/media/flags/philippines.svg" },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "/media/flags/indonesia.svg" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "/media/flags/vietnam.svg" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "/media/flags/brazil.svg" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "/media/flags/mexico.svg" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "/media/flags/argentina.svg" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "/media/flags/chile.svg" },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "/media/flags/colombia.svg" },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "/media/flags/peru.svg" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "/media/flags/south-africa.svg" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "/media/flags/egypt.svg" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "/media/flags/nigeria.svg" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "/media/flags/kenya.svg" },
  { code: "IL", name: "Israel", dialCode: "+972", flag: "/media/flags/israel.svg" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "/media/flags/united-arab-emirates.svg" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "/media/flags/saudi-arabia.svg" },
];

// Phone Number Input Component
function PhoneNumberInput({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void; 
}) {
  // Find country by full phone number
  const findCountryByPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber.startsWith("+")) return null;
    
    // Sort countries by dial code length (longest first) to match more specific codes first
    const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
    
    return sortedCountries.find((country) => phoneNumber.startsWith(country.dialCode));
  };

  // Get current country based on phone number
  const currentCountry = findCountryByPhoneNumber(value) || countries[8]; // Default to Netherlands

  // Handle phone number input change
  const handlePhoneChange = (inputValue: string) => {
    // Remove any non-digit characters except + at the start
    const cleanValue = inputValue.replace(/[^\d+]/g, "");
    onChange(cleanValue);
  };

  return (
    <div className="flex items-center w-full">
      {/* Flag Display */}
      <div className="flex items-center justify-center w-9 h-8.5 rounded-s-md border border-r-0 border-input shadow-xs shadow-black/5">
        <img 
          src={toAbsoluteUrl(currentCountry.flag)} 
          alt={`${currentCountry.name} flag`}
          className="size-4 object-cover rounded-full"
        />
      </div>

      {/* Phone Number Input */}
      <Input
        type="tel"
        placeholder="+1"
        value={value}
        onChange={(e) => handlePhoneChange(e.target.value)}
        className="rounded-l-none flex-1"
      />
    </div>
  );
}

export function Basics() {
  const [companyName, setCompanyName] = useState("Bob's Shoes Store|");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("+33");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="bg-accent/70 rounded-md shadow-none h-full flex flex-col"> 
      <CardContent className="p-0 flex flex-col h-full"> 
        <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">Basics</h3>
        <div className="bg-background rounded-md m-1 mt-0 border border-input p-5 space-y-5 h-full">
          {/* Company Name */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Company Name</Label>
              <span className="text-xs font-normal text-muted-foreground">Store logo or brand icon</span>
            </div>
            <Input
              placeholder="Bob’s Shoes Store|"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="basis-2/3"
            />
          </div>

          <Separator />

          {/* Profile Image */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Profile Image</Label>
              <span className="text-xs font-normal text-muted-foreground">Store logo or brand icon</span>
            </div>
            <div className="basis-2/3"> 
              <div className="flex items-center gap-2.5">
                <div className="w-[60px] h-[60px] border border-border/50 rounded-lg flex items-center justify-center">
                  <img 
                    src={selectedImage || toAbsoluteUrl('/media/avatars/300-1.png')} 
                    alt="Profile" 
                    className="rounded-lg size-[60px] object-contain" 
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image-upload"
                />
                <label htmlFor="profile-image-upload" className="ml-2.5">
                  <Button size="sm" variant="outline" asChild>
                    <span>Upload</span>
                  </Button>
                </label>
                <Button variant="ghost" size="sm">Delete</Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* CompaStore URL */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Store URL</Label>
              <span className="text-xs font-normal text-muted-foreground">Link to your online store</span>
            </div>
            <InputGroup className="basis-2/3">
              <InputAddon>https://</InputAddon>
              <Input type="reui" placeholder="reui.io" />
            </InputGroup> 
          </div>

          <Separator />

          {/* Store Phone */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Store Phone</Label>
              <span className="text-xs font-normal text-muted-foreground">Customer service phone number</span>
            </div>
            <div className="basis-2/3"> 
            <PhoneNumberInput
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            </div>
          </div>

          <Separator />

          {/* Contact Email */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 lg:basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Contact Email</Label>
              <span className="text-xs font-normal text-muted-foreground">Email for customer inquiries</span>
            </div>
            <Input
              placeholder="Contact Email"  
              className="basis-2/3"
              type="email"
            />
          </div>

          <Separator />

           {/* What do you do? */}
           <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">What do you do?</Label>
              <span className="text-xs font-normal text-muted-foreground">Tags describing store products</span>
            </div>
            <Input
              placeholder="Start typing tags"  
              className="basis-2/3"
              type="text"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}