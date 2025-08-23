'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';
import * as React from 'react';

interface MultiSelectItem {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: MultiSelectItem[];
    selected: MultiSelectItem[];
    onChange: (selected: MultiSelectItem[]) => void;
}

export function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    const filteredOptions = options.filter(
        (option) => option.label.toLowerCase().includes(inputValue.toLowerCase()) && !selected.some((s) => s.label === option.label),
    );

    const handleSelect = (item: MultiSelectItem) => {
        onChange([...selected, item]);
        setInputValue('');
    };

    const handleAddCustom = () => {
        if (inputValue.trim() === '') return;
        const newItem = { value: inputValue, label: inputValue };
        onChange([...selected, newItem]);
        setInputValue('');
    };

    const handleClear = () => {
        onChange([]);
        setInputValue('');
    };

    console.log('Selected items:', selected);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="flex gap-2">
                <Button variant="outline" className="w-full justify-between">
                    {selected.length > 0 ? selected.map((s) => s.label).join(', ') : 'Select...'}
                </Button>
            </PopoverTrigger>
            {selected.length > 0 && (
                <div className="px-2 py-2">
                    <Button variant="ghost" size="sm" className="w-full" onClick={handleClear}>
                        Clear tags
                    </Button>
                </div>
            )}
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search..." value={inputValue} onValueChange={setInputValue} />

                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        {filteredOptions.map((option) => (
                            <CommandItem key={option.value} onSelect={() => handleSelect(option)}>
                                <Check className={cn('mr-2 h-4 w-4', selected.some((s) => s.label === option.label) ? 'opacity-100' : 'opacity-0')} />
                                {option.label}
                            </CommandItem>
                        ))}
                        {inputValue && !options.some((o) => o.label === inputValue) && (
                            <CommandItem onSelect={handleAddCustom}>
                                <Plus className="mr-2 h-4 w-4" /> Add "{inputValue}"
                            </CommandItem>
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
