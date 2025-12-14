'use client';

import React from 'react';
import { useUIStore, uiSelectors } from '@/store/ui';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Layout, MessageSquare } from 'lucide-react';

export const Settings = () => {
  const aiChatConfig = useUIStore(uiSelectors.aiChatConfig);
  const setAIChatConfig = useUIStore((state) => state.setAIChatConfig);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-500" />
            AI Assistant Configuration
          </CardTitle>
          <CardDescription>
            Customize how the AI assistant appears and behaves in your learning roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Enable AI Assistant</Label>
              <p className="text-sm text-muted-foreground">
                Show the AI chat interface on the roadmap page.
              </p>
            </div>
            <Switch
              checked={aiChatConfig.enabled}
              onCheckedChange={(checked) => setAIChatConfig({ enabled: checked })}
            />
          </div>

          {/* Position Selection */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <Label className="text-base">Interface Position</Label>
              <p className="text-sm text-muted-foreground">
                Choose where the AI chat window should appear.
              </p>
            </div>
            <RadioGroup
              defaultValue={aiChatConfig.position}
              onValueChange={(value) => setAIChatConfig({ position: value as any })}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <div>
                <RadioGroupItem value="sidebar" id="sidebar" className="peer sr-only" />
                <Label
                  htmlFor="sidebar"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Layout className="mb-3 h-6 w-6" />
                  <span className="font-semibold">Sidebar</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">Fixed to the right side</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="bottom" id="bottom" className="peer sr-only" />
                <Label
                  htmlFor="bottom"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="mb-3 h-6 w-6 border-b-4 border-current w-full max-w-[24px]" />
                  <span className="font-semibold">Bottom Panel</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">Full width at the bottom</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="float" id="float" className="peer sr-only" />
                <Label
                  htmlFor="float"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <MessageSquare className="mb-3 h-6 w-6" />
                  <span className="font-semibold">Floating</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">Floating window</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
