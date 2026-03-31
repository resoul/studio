'use client'; 
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';

// Language data
const languages = [
  { code: "en-us", name: "English USA", flag: "🇺🇸" },
  { code: "en-gb", name: "English UK", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", flag: "🇵🇭" },
];

export function Preferences() {
  const [automaticTimeZone, setAutomaticTimeZone] = useState(true);
  const [language, setLanguage] = useState('en-us');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleReset = () => {
    setDate(undefined);
  };

  return (
    <Card className="bg-accent/70 rounded-md shadow-none h-full flex flex-col"> 
      <CardContent className="p-0 flex flex-col h-full"> 
        <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">Preferences</h3>
        <div className="bg-background rounded-md m-1 mt-0 border border-input p-5 space-y-5 h-full">
          {/* Automatic time zone */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-sm font-medium tracking-[-0.13px] shrink-0">Automatic time zone</Label>
              <span className="text-xs font-normal text-muted-foreground leading-none">Adjusts time zone automatically</span>
            </div>
            <div className="basis-2/3">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="size-sm" 
                  size="sm"
                  checked={automaticTimeZone}
                  onCheckedChange={setAutomaticTimeZone}
                />
                <Label htmlFor="size-sm">GMT +01:00</Label>
              </div>     
            </div> 
          </div>
          <Separator />
    
          {/* Language */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-sm font-medium tracking-[-0.13px] shrink-0">Language</Label>
              <span className="text-xs font-normal text-muted-foreground leading-none">Default language for the store</span>
            </div>
            <div className="basis-2/3">
              <Select value={language} onValueChange={setLanguage} indicatorPosition="right">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span className="size-4">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Date format */}       
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-sm font-medium tracking-[-0.13px] shrink-0">Date format</Label>
              <span className="text-xs font-normal text-muted-foreground leading-none">Format used for displaying dates</span>
            </div>
            <div className="basis-2/3 relative">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Button type="button" variant="outline" mode="input" placeholder={!date} className="w-full">
                      <CalendarDays />
                      {date ? format(date, 'PPP') : <span>DD/MM/YYYY</span>}
                    </Button>
                    {date && (
                      <Button
                        type="button"
                        variant="dim"
                        size="sm"
                        className="absolute top-1/2 -end-0 -translate-y-1/2"
                        onClick={handleReset}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
                </PopoverContent>

                <ChevronDown className="absolute top-1/2 end-2.5 -translate-y-1/2 text-muted-foreground size-4"/>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}