'use client';

import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsSheet } from '../../components/settings-sheet';
import { useState } from 'react';


export function SettingsModal() {
    const [settingsSheetOpen, setSettingsSheetOpen] = useState(true);

    // Debug log
    console.log('SettingsSheet open state:', settingsSheetOpen);

    // Handle settings sheet open
    const handleSettingsSheetOpen = () => {
        setSettingsSheetOpen(true);
    };

    // Handle edit click
    const handleEditClick = () => {
        console.log('Edit clicked');
    };

    return (
        <div className="container-fluid space-y-5 lg:space-y-9">
            <div className="flex items-center flex-wrap gap-2 justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold text-foreground">Settings - General Settings</h1>
                    <span className="text-sm text-muted-foreground">
            1,234 Products found. 89% are in stock
          </span>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="mono" onClick={handleSettingsSheetOpen}>
                        <Settings/>
                        Open Settings
                    </Button>
                </div>
            </div>

            {settingsSheetOpen && (
                <SettingsSheet
                    open={settingsSheetOpen}
                    onOpenChange={setSettingsSheetOpen}
                    onEditClick={handleEditClick}
                />
            )}
        </div>
    );
}
