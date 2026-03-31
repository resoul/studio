'use client';

import { useState } from 'react';
import { GripVertical, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from '@/components/ui/sortable';

interface OptionValue {
  id: string;
  value: string;
}

interface OptionCard {
  id: string;
  name: string;
  isOpen: boolean;
  values: OptionValue[];
}

export function ManageVariantsSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [optionCards, setOptionCards] = useState<OptionCard[]>([
    {
      id: 'colors',
      name: 'Colors',
      isOpen: true,
      values: [
        { id: 'color-1', value: 'White' },
        { id: 'color-2', value: 'Black' },
        { id: 'color-3', value: 'Grey' },
        { id: 'color-4', value: 'Green' },
      ],
    },
    {
      id: 'size',
      name: 'Size',
      isOpen: false,
      values: [
        { id: 'size-1', value: 'XS' },
        { id: 'size-2', value: 'S' },
        { id: 'size-3', value: 'M' },
        { id: 'size-4', value: 'L' },
        { id: 'size-5', value: 'XL' },
      ],
    },
    {
      id: 'style',
      name: 'Style',
      isOpen: false,
      values: [
        { id: 'style-1', value: 'Casual' },
        { id: 'style-2', value: 'Formal' },
        { id: 'style-3', value: 'Sport' },
        { id: 'style-4', value: 'Vintage' },
      ],
    },
    {
      id: 'material',
      name: 'Material',
      isOpen: false,
      values: [
        { id: 'material-1', value: 'Cotton' },
        { id: 'material-2', value: 'Polyester' },
        { id: 'material-3', value: 'Wool' },
        { id: 'material-4', value: 'Leather' },
      ],
    },
  ]);

  const toggleCard = (cardId: string) => {
    setOptionCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isOpen: !card.isOpen } : card,
      ),
    );
  };

  const reorderCards = (oldIndex: number, newIndex: number) => {
    setOptionCards((prev) => {
      const newCards = [...prev];
      const [movedCard] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedCard);
      return newCards;
    });
  };

  const addValue = (cardId: string, value: string) => {
    if (value.trim()) {
      setOptionCards((prev) =>
        prev.map((card) => {
          if (card.id === cardId) {
            const newValue: OptionValue = {
              id: `${cardId}-${Date.now()}`,
              value: value.trim(),
            };
            return { ...card, values: [...card.values, newValue] };
          }
          return card;
        }),
      );
    }
  };

  const updateCardName = (cardId: string, newName: string) => {
    setOptionCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, name: newName } : card,
      ),
    );
  };

  const updateValue = (cardId: string, valueId: string, newValue: string) => {
    setOptionCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            values: card.values.map((v) =>
              v.id === valueId ? { ...v, value: newValue } : v,
            ),
          };
        }
        return card;
      }),
    );
  };

  const removeValue = (cardId: string, valueId: string) => {
    setOptionCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            values: card.values.filter((v) => v.id !== valueId),
          };
        }
        return card;
      }),
    );
  };

  const removeCard = (cardId: string) => {
    setOptionCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const addNewOption = () => {
    const newOptionCard: OptionCard = {
      id: `option-${Date.now()}`,
      name: 'New Option',
      isOpen: true,
      values: [],
    };
    setOptionCards((prev) => [...prev, newOptionCard]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="lg:w-[640px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <style>{`
          [data-slot="sortable-item"] {
            box-shadow: none !important;
          }
          .z-50 {
            box-shadow: none !important;
          }
        `}</style>
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">Manage Variants</SheetTitle>
        </SheetHeader>

        <SheetBody className="grow p-0">
          <div className="flex justify-between gap-2 flex-wrap border-b border-border p-5 pt-1">
            <Select defaultValue="active" indicatorPosition="right">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2.5 text-xs text-secondary-foreground font-medium">
              Read about
              <Link to="#" className="text-primary">
                How to Manage Variants
              </Link>
              <Button variant="outline">Cancel</Button>
              <Button variant="mono">Save</Button>
            </div>
          </div>

          {/* Scroll */}
          <ScrollArea className="h-[calc(100dvh-16.5rem)] ps-5 pe-4 me-1 pb-0">
            <div className="flex flex-wrap lg:flex-nowrap">
              <div className="grow space-y-5 mt-5.5">
                <Sortable
                  value={optionCards}
                  onValueChange={setOptionCards}
                  getItemValue={(card) => card.id}
                  strategy="vertical"
                  className="space-y-5"
                  onMove={({ activeIndex, overIndex }) =>
                    reorderCards(activeIndex, overIndex)
                  }
                >
                  {optionCards.map((card) => (
                    <SortableItem key={card.id} value={card.id}>
                      <Collapsible
                        open={card.isOpen}
                        onOpenChange={() => toggleCard(card.id)}
                      >
                        <Card className="rounded-md">
                          <CardHeader className="min-h-[38px] bg-accent/50">
                            <CardTitle className="text-2sm flex items-center">
                              <SortableItemHandle className="-ms-3.5">
                                <Button variant="dim" mode="icon">
                                  <GripVertical className="size-4" />
                                </Button>
                              </SortableItemHandle>
                              <span>{card.name}</span>
                            </CardTitle>
                            <CardToolbar>
                              <div className="flex items-center -me-2.5">
                                <Button
                                  className="-me-1"
                                  variant="dim"
                                  mode="icon"
                                  onClick={() => removeCard(card.id)}
                                >
                                  <Trash2 />
                                </Button>
                                <CollapsibleTrigger asChild>
                                  <Button variant="dim" mode="icon">
                                    {card.isOpen ? (
                                      <Minus className="size-4" />
                                    ) : (
                                      <Plus className="size-4" />
                                    )}
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                            </CardToolbar>
                          </CardHeader>

                          <CollapsibleContent>
                            <CardContent className="pt-4">
                              <div className="flex flex-col gap-2 mb-5">
                                <Label className="text-xs">Option Name</Label>
                                <Input
                                  value={card.name}
                                  onChange={(e) =>
                                    updateCardName(card.id, e.target.value)
                                  }
                                />
                              </div>

                              <div className="mb-5">
                                <Label className="text-xs">Option Value</Label>
                                <Sortable
                                  value={card.values}
                                  onValueChange={(newValues) => {
                                    setOptionCards((prev) =>
                                      prev.map((c) =>
                                        c.id === card.id
                                          ? { ...c, values: newValues }
                                          : c,
                                      ),
                                    );
                                  }}
                                  getItemValue={(value) => value.id}
                                  strategy="vertical"
                                  className="space-y-2.5 ps-3.5 pt-1.5"
                                >
                                  {card.values.map((value) => (
                                    <SortableItem
                                      key={value.id}
                                      value={value.id}
                                      className="shadow-none"
                                    >
                                      <div className="flex items-center mt-1">
                                        <SortableItemHandle className="-ms-[13px]">
                                          <Button variant="dim" mode="icon">
                                            <GripVertical className="size-4.5" />
                                          </Button>
                                        </SortableItemHandle>
                                        <Input
                                          value={value.value}
                                          onChange={(e) =>
                                            updateValue(
                                              card.id,
                                              value.id,
                                              e.target.value,
                                            )
                                          }
                                        />
                                        <Button
                                          className="-me-2.5 ms-0.5"
                                          variant="dim"
                                          mode="icon"
                                          onClick={() =>
                                            removeValue(card.id, value.id)
                                          }
                                        >
                                          <Trash2 className="size-4" />
                                        </Button>
                                      </div>
                                    </SortableItem>
                                  ))}
                                </Sortable>
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label className="text-xs">Add New Value</Label>
                                <Input
                                  placeholder="Type Value Name and press Enter"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const target =
                                        e.target as HTMLInputElement;
                                      addValue(card.id, target.value);
                                      target.value = '';
                                    }
                                  }}
                                />
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    </SortableItem>
                  ))}
                </Sortable>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={addNewOption}>
              Add New Option
            </Button>
          </ScrollArea>          
        </SheetBody>

        <SheetFooter className="flex-row border-t not-only-of-type:justify-between items-center p-5 border-border gap-2">
          <Select defaultValue="active" indicatorPosition="right">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="outline">Cancel</Button>
            <Button variant="mono">Save</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
