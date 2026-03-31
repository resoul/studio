'use client';

import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

function CategoryImageUpload({ mode }: { mode: 'new' | 'edit' }) {
  const isNewMode = mode === 'new';
  const isEditMode = mode === 'edit';

  const [selectedImage, setSelectedImage] = useState<string | null>(
    isEditMode ? toAbsoluteUrl('/media/store/client/icons/light/running-shoes.svg') : null
  );

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

  // If selected image points to icons path, extract file name for light/dark rendering
  const iconFileName: string | null =
    selectedImage && selectedImage.includes('/icons/')
      ? (selectedImage.split('/').pop() as string)
      : null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="w-full h-[200px] bg-accent/50 border border-border rounded-lg flex items-center justify-center">
          {selectedImage ? (
            <div className="relative flex items-center justify-center w-full h-full">
              {iconFileName ? (
                <>
                  <img
                    src={toAbsoluteUrl(`/media/store/client/icons/light/${iconFileName}`)}
                    className="cursor-pointer h-[140px] object-contain dark:hidden"
                    alt="light-icon"
                  />
                  <img
                    src={toAbsoluteUrl(`/media/store/client/icons/dark/${iconFileName}`)}
                    className="cursor-pointer h-[140px] object-contain light:hidden"
                    alt="dark-icon"
                  />
                </>
              ) : (
                <img
                  src={selectedImage}
                  alt="Category"
                  className={
                    isEditMode
                      ? 'cursor-pointer h-[140px] object-contain'
                      : 'w-full h-full object-cover rounded-lg'
                  }
                />
              )}

              {isNewMode && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 size-6"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="size-3" />
                </Button>
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
                  <span>{isEditMode ? 'Change' : 'Upload'}</span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <ImageIcon className="size-[35px] text-muted-foreground" />
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
          )}
        </div>
      </div>
    </div>
  );
}

export function CategoryFormSheet({
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

  const [categoryName, setCategoryName] = useState(isEditMode ? 'Nike Air Max' : '');
  const [status, setStatus] = useState(isEditMode ? 'active' : '');
  const [description, setDescription] = useState(isEditMode ? 'Nice boots' : '');
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSave = () => {
    console.log(`${isNewMode ? 'Creating' : 'Saving'} category:`, {
      categoryName,
      status,
      description,
      isFeatured,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    console.log('Deleting category');
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 w-[500px] p-0 inset-5 border start-auto h-auto rounded-lg [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-4 px-6">
          <SheetTitle className="font-medium">
            {isNewMode ? 'Add Category' : 'Edit Category'}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow pt-5">
          <ScrollArea
            className="h-[calc(100dvh-14rem)] mx-1.5 px-3.5 grow"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="space-y-6">
              {/* Image Upload */}
              <CategoryImageUpload mode={mode} />

              {/* Category Name */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Category Name</Label>
                <Input
                  placeholder="Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Description</Label>
                <Textarea
                  placeholder="Category Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <Label htmlFor="featured" className="text-xs font-medium">
                  Featured
                </Label>
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-t p-5">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
            {isEditMode && (
              <Button variant="outline" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button variant="mono" onClick={handleSave}>
              {isNewMode ? 'Create' : 'Save'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
