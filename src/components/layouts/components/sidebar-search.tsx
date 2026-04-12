import { Input, InputWrapper } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SidebarSearch() {
  const handleInputChange = () => {};

  return (
    <div className="flex px-5 pt-2.5 shrink-0">
      <InputWrapper className="relative">
        <Input type="search" placeholder="Search" onChange={handleInputChange} />
        <Badge className="absolute end-3 gap-1" variant="outline" size="sm">⌘ K</Badge>
      </InputWrapper>
    </div>
  );
}
