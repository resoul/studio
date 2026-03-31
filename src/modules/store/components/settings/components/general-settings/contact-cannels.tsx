'use client'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, InputAddon, InputGroup, InputWrapper } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { toAbsoluteUrl } from "@/lib/helpers";
import { CircleCheck, SquarePlus } from "lucide-react"; 

export function ContactChannels() { 
  
  return (
    <Card className="bg-accent/70 rounded-md shadow-none h-full flex flex-col"> 
      <CardContent className="p-0 flex flex-col h-full"> 
        <div className="flex items-center justify-between"> 
          <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">Contact Channels</h3>
          <Button variant="dim" mode="icon" className="me-1">
            <SquarePlus className="text-muted-foreground/70"/>
          </Button>
        </div>
        <div className="bg-background rounded-md m-1 mt-0 border border-input p-5 space-y-5 h-full">
          {/* What do you do? */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">What do you do?</Label>
              <span className="text-xs font-normal text-muted-foreground">Tags describing store products</span>
            </div>
            <div className="basis-2/3 space-y-3.5">
            <InputWrapper className="px-0 overflow-hidden">
                <InputAddon className="rounded-r-none border-s-0 border-e-border text-muted-foreground bg-muted/50">
                  <img 
                    src={toAbsoluteUrl('/media/brand-logos/github.svg')} 
                    alt="GitHub" 
                    className="size-4.5 me-1.5 -ms-1" 
                  />
                  github.com/
                </InputAddon>
                <Input 
                  type="text"  
                  value="KeenThemes" 
                />

                <Button size="sm" variant="dim" mode="icon" className="me-1">
                  <CircleCheck
                    className="fill-green-500 !text-background size-4.5"  
                  />
                </Button> 
              </InputWrapper> 

              <InputWrapper className="px-0 overflow-hidden">
                <InputAddon className="rounded-r-none border-s-0 border-e-border text-muted-foreground bg-muted/50">
                  <img 
                    src={toAbsoluteUrl('/media/brand-logos/linkedin.svg')} 
                    alt="LinkedIn" 
                    className="size-4.5 me-1.5 -ms-1" 
                  />
                  linked.com/
                </InputAddon>
                <Input 
                  type="text"  
                  value="KeenThemes" 
                />

                <Button size="sm" variant="dim" mode="icon" className="me-1">
                  <CircleCheck
                    className="fill-green-500 !text-background size-4.5"  
                  />
                </Button> 
              </InputWrapper>  

              <InputWrapper className="px-0 overflow-hidden">
                <InputAddon className="rounded-r-none border-s-0 border-e-border text-muted-foreground bg-muted/50">
                  <img 
                    src={toAbsoluteUrl('/media/brand-logos/figma.svg')} 
                    alt="Figma" 
                    className="size-4.5 me-1.5 -ms-1" 
                  />
                  figma.com/
                </InputAddon>
                <Input 
                  type="text"  
                  value="KeenThemes" 
                />

                <Button size="sm" variant="dim" mode="icon" className="me-1">
                  <CircleCheck
                    className="fill-green-500 !text-background size-4.5"  
                  />
                </Button> 
              </InputWrapper>  

              <InputGroup>
                <InputAddon className="rounded-r-none border-s-0 border-e-border text-muted-foreground bg-muted/50">
                  <img 
                    src={toAbsoluteUrl('/media/brand-logos/twitch-purple.svg')} 
                    alt="Twitch" 
                    className="size-4.5 me-1.5 -ms-1" 
                  />
                  twitch.tv/
                </InputAddon>
                <Input 
                  type="text" 
                  placeholder="Enter your social link"  
                />
              </InputGroup> 

              <InputGroup>
                <InputAddon className="rounded-r-none border-s-0 border-e-border text-muted-foreground bg-muted/50">
                  <img 
                    src={toAbsoluteUrl('/media/brand-logos/slack.svg')} 
                    alt="Slack" 
                    className="size-4.5 me-1.5 -ms-1" 
                  />
                  slack.com/
                </InputAddon>
                <Input 
                  type="text" 
                  placeholder="Enter your social link"  
                />
              </InputGroup> 
            </div> 
          </div>
        </div>
      </CardContent>
    </Card>
  );
}