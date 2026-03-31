'use client';

import { useState } from 'react';
import {
  CheckCircle,
  ClipboardPenLine,
  DollarSign,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Variant {
  id: string;
  size: string;
  color: string;
  onHand: string;
  price: string;
  available: string;
}

export function ProductFormVariants({ mode }: { mode: 'new' | 'edit' }) {
  const isEditMode = mode === 'edit';
  
  const [variants, setVariants] = useState<Variant[]>(
    isEditMode ? [
      {
        id: '1',
        size: '40',
        color: 'White',
        price: '96.00',
        available: 'Yes',
        onHand: '24',
      },
      {
        id: '2',
        size: '39',
        color: 'White',
        price: '96.00',
        available: 'Yes',
        onHand: '18',
      },
      {
        id: '3',
        size: '42',
        color: 'Black',
        price: '96.00',
        available: 'Yes',
        onHand: '12',
      },
      {
        id: '4',
        size: '41',
        color: 'White',
        price: '96.00',
        available: 'No',
        onHand: '30',
      },
      {
        id: '5',
        size: '44',
        color: 'Red',
        price: '96.00',
        available: 'Yes',
        onHand: '27',
      },
      {
        id: '6',
        size: '43',
        color: 'Black',
        price: '96.00',
        available: 'No',
        onHand: '15',
      },
    ] : []
  );
  const [activeTab, setActiveTab] = useState('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVariant, setNewVariant] = useState<Omit<Variant, 'id'>>({
    size: '',
    color: '',
    onHand: '',
    price: '',
    available: 'Yes',
  });

  const sizeOptions = ['39', '40', '41', '42', '43', '44', '45'];
  const colorOptions = ['White', 'Black', 'Red', 'Blue', 'Green'];
  const availableOptions = ['Yes', 'No'];

  const resetForm = () => {
    setNewVariant({
      size: '',
      color: '',
      onHand: '',
      price: '',
      available: 'Yes',
    });
    setEditingId(null);
  };

  const handleAddVariant = () => {
    if (
      newVariant.size &&
      newVariant.color &&
      newVariant.onHand &&
      newVariant.price
    ) {
      if (editingId) {
        // Update existing variant
        setVariants((prev) =>
          prev.map((v) => (v.id === editingId ? { ...v, ...newVariant } : v)),
        );

        toast.custom(
          (t) => (
            <Alert
              variant="mono"
              icon="success"
              onClose={() => toast.dismiss(t)}
            >
              <AlertIcon>
                <CheckCircle />
              </AlertIcon>
              <AlertTitle>Variant updated successfully</AlertTitle>
            </Alert>
          ),
          {
            duration: 5000,
          },
        );

        setEditingId(null);
      } else {
        // Add new variant
        const variant: Variant = {
          id: Date.now().toString(),
          ...newVariant,
        };
        setVariants([...variants, variant]);

        toast.custom(
          (t) => (
            <Alert
              variant="mono"
              icon="success"
              onClose={() => toast.dismiss(t)}
            >
              <AlertIcon>
                <CheckCircle />
              </AlertIcon>
              <AlertTitle>Variant added successfully</AlertTitle>
            </Alert>
          ),
          {
            duration: 5000,
          },
        );
      }

      resetForm();
      setActiveTab('list');
    }
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));

    toast.custom(
      (t) => (
        <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <CheckCircle />
          </AlertIcon>
          <AlertTitle>Variant deleted successfully</AlertTitle>
        </Alert>
      ),
      {
        duration: 5000,
      },
    );
  };

  const handleEditVariant = (id: string) => {
    const variant = variants.find((v) => v.id === id);
    if (variant) {
      setNewVariant({
        size: variant.size,
        color: variant.color,
        onHand: variant.onHand,
        price: variant.price,
        available: variant.available,
      });
      setEditingId(id);
      setActiveTab('form');
    }
  };

  return (
    <div className="space-y-5">
      {/* Variants */}
      <Card className="rounded-md">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full p-0"
        >
          <CardHeader className="min-h-[40px] bg-accent/50">
            <CardTitle className="text-sm">Variants</CardTitle>
            <TabsList
              size="xs"
              className="flex gap-3.5 border-none"
              variant="line"
            >
              <TabsTrigger
                value="list"
                className="flex-1 pb-3 -mb-1.5 data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-foreground border-b-[1px] hover:text-inherit"
              >
                Variants
              </TabsTrigger>
              <TabsTrigger
                value="form"
                className="flex-1 pb-3 -mb-1.5 gap-3 data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-foreground border-b-[1px] hover:text-inherit"
              >
                {editingId ? 'Edit Variant' : 'Add New'}
              </TabsTrigger>
              <Settings className="size-4 -me-px text-muted-foreground" />
            </TabsList>
          </CardHeader>

          <CardContent className="p-0 m-0">
            <TabsContent value="list" className="p-0 m-0 flex flex-col">
              {variants.length === 0 ? (
                <div className="p-10">
                  <h3 className="text-foreground font-medium leading-7">
                    No variants to display
                  </h3>
                  <span className="text-xs font-normal text-secondary-foreground">
                    Set up different options for this product
                  </span>
                  <div className="mt-3.5">
                    <Button
                      size="sm"
                      variant="mono"
                      onClick={() => setActiveTab('form')}
                    >
                      <Plus className="mr-2" />
                      Add Variant
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="text-secondary-foreground font-normal border-border/60 text-2sm">
                      <TableHead className="min-w-[80px] w-[100px] h-8.5 border-e border-border/60 ps-5">
                        Size
                      </TableHead>
                      <TableHead className="min-w-[80px] w-[100px] h-8.5 border-e border-border/60">
                        Color
                      </TableHead>
                      <TableHead className="min-w-[80px] w-[100px] h-8.5 border-e border-border/60">
                        Price
                      </TableHead>
                      <TableHead className="min-w-[80px] w-[100px] h-8.5 border-e border-border/60 ps-5">
                        Available
                      </TableHead>
                      <TableHead className="min-w-[90px] w-[100px] h-8.5 border-e border-border">
                        On Hand
                      </TableHead>
                      <TableHead className="w-[100px] h-8.5">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variants.map((variant, index) => (
                      <TableRow
                        key={variant.id}
                        className={`text-secondary-foreground font-normal border-0 text-2sm ${index % 2 === 0 ? 'bg-accent/50' : ''}`}
                      >
                        <TableCell className="py-1 border-e border-border/60 ps-5">
                          EU {variant.size}
                        </TableCell>
                        <TableCell className="py-1 border-e border-border/60">
                          {variant.color}
                        </TableCell>
                        <TableCell className="py-1 border-e border-border/60">
                          ${variant.price}
                        </TableCell>
                        <TableCell className="py-1 border-e border-border/60">
                          <span className="px-2 py-1 rounded-full text-xs">
                            {variant.available}
                          </span>
                        </TableCell>
                        <TableCell className="py-1 border-e border-border/60">
                          {variant.onHand}
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVariant(variant.id)}
                            >
                              <ClipboardPenLine className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVariant(variant.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="form" className="m-0 space-y-4">
              <div className="p-5 space-y-4">
                <div className="flex flex-row items-center gap-5">
                  <div className="flex flex-col gap-2 basis-2/5">
                    <Label className="text-xs">Size</Label>
                    <Select
                      value={newVariant.size}
                      indicatorPosition="right"
                      onValueChange={(value) =>
                        setNewVariant({ ...newVariant, size: value })
                      }
                    >
                      <SelectTrigger className="text-start">
                        <SelectValue placeholder="Select Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 basis-2/5">
                    <Label className="text-xs">Color</Label>
                    <Select
                      value={newVariant.color}
                      indicatorPosition="right"
                      onValueChange={(value) =>
                        setNewVariant({ ...newVariant, color: value })
                      }
                    >
                      <SelectTrigger className="text-start">
                        <SelectValue placeholder="Select Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 basis-1/5">
                    <Label className="text-xs">On Hand</Label>
                    <Input
                      placeholder="Qty"
                      value={newVariant.onHand}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, onHand: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2 basis-2/5">
                    <Label className="text-xs">Price</Label>
                    <InputWrapper>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newVariant.price}
                        onChange={(e) =>
                          setNewVariant({
                            ...newVariant,
                            price: e.target.value,
                          })
                        }
                      />
                      <DollarSign className="size-3" />
                    </InputWrapper>
                  </div>

                  <div className="flex flex-col gap-2 basis-1/4">
                    <Label className="text-xs">Available</Label>
                    <Select
                      value={newVariant.available}
                      indicatorPosition="right"
                      onValueChange={(value) =>
                        setNewVariant({ ...newVariant, available: value })
                      }
                    >
                      <SelectTrigger className="text-start">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    {editingId ? 'Cancel' : 'Clear'}
                  </Button>
                  <Button variant="mono" onClick={handleAddVariant}>
                    {editingId ? 'Update Variant' : 'Add Variant'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
