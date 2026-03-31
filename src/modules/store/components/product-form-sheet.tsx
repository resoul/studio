'use client';

import { useState } from 'react';
import { CircleX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, BadgeButton } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ProductFormImageUpload } from './product-form-image-upload';
import { ProductFormVariants } from './product-form-variants';

function ProductFormTagInput({ mode }: { mode: 'new' | 'edit' }) {
  const isEditMode = mode === 'edit';
  
  const [tags, setTags] = useState<string[]>(
    isEditMode ? ['Jordans', 'Limited Edition'] : []
  );
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5 mb-2.5">
        <Label className="text-xs leading-3">Tags</Label>
        <Input
          placeholder="Add tags (press Enter or comma)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            appearance="light"
            className="flex items-center gap-1"
          >
            {tag}
            <BadgeButton onClick={() => removeTag(tag)}>
              <CircleX className="size-3.5 text-muted-foreground" />
            </BadgeButton>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ProductFormSheet({
  mode,
  open,
  onOpenChange,
}: {
  mode: 'new' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isNewMode = mode === 'new';
  const isEditMode = mode === 'edit';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 lg:w-[1080px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">{isNewMode ? 'Create New Product' : 'Edit Product'}</SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow">
          <div className="flex justify-between gap-2 flex-wrap border-b border-border p-5">
            <Select defaultValue={isEditMode ? "published" : undefined} indicatorPosition="right">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={isNewMode ? "Select Status" : "Published"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2.5 text-xs text-gray-800 font-medium">
              Read about
              <Link to="#" className="text-primary">
                How to Create Product
              </Link>
              <Button variant="outline" className="text-dark" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="mono">{isNewMode ? 'Create' : 'Save'}</Button>
            </div>
          </div>

          {/* Scroll */}
          <ScrollArea
            className="flex flex-col h-[calc(100dvh-15.2rem)] mx-1.5"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex flex-wrap lg:flex-nowrap px-3.5 grow">
              <div className="grow lg:border-e border-border lg:pe-5 space-y-5 py-5">
                {/* Basic Info */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[38px] bg-accent/50">
                    <CardTitle className="text-2sm">Basic Info</CardTitle>
                    <CardToolbar>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="auto-update" className="text-xs">
                          Featured
                        </Label>
                        <Switch size="sm" id="auto-update" defaultChecked={isEditMode} />
                      </div>
                    </CardToolbar>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-col gap-2 mb-3">
                      <Label className="text-xs">Product Name</Label>
                      <Input placeholder="Product Name" />
                    </div>
                    <div className="grid grid-cols-2 gap-5 mb-2.5">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs">SKU</Label>
                        <Input placeholder="SKU" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs">Barcode</Label>
                        <Input placeholder="Barcode" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs">Product Description</Label>
                      <Textarea
                        className="min-h-[100px]"
                        placeholder="Product Description"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Category & Brand */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[38px] bg-accent/50">
                    <CardTitle className="text-2sm">Category & Brand</CardTitle>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3">
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs">Product Category</Label>
                      <Select
                        defaultValue={isEditMode ? "select-category" : undefined}
                        indicatorPosition="right"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="select-category">
                            Select Category
                          </SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="product-category">
                            Product Category
                          </SelectItem>
                          <SelectItem value="brand">Brand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs">Product Brand</Label>
                      <Select
                        defaultValue={isEditMode ? "select-brand" : undefined}
                        indicatorPosition="right"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="select-brand">
                            Select Brand
                          </SelectItem>
                          <SelectItem value="brand">Brand</SelectItem>
                          <SelectItem value="sony">Sony</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <ProductFormVariants mode={mode} />
              </div>

              <div className="w-full lg:w-[420px] shrink-0 lg:mt-5 space-y-5 lg:ps-5">
                <ProductFormImageUpload mode={mode} />

                <Separator className="w-full"></Separator>

                <ProductFormTagInput mode={mode} />
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="flex-row border-t not-only-of-type:justify-between items-center p-5 border-border gap-2">
          <Select defaultValue={isEditMode ? "published" : undefined} indicatorPosition="right">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={isNewMode ? "Select Status" : "Published"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="mono">{isNewMode ? 'Create' : 'Save'}</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
