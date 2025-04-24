'use client';

import { useAccessibility } from '@/components/providers/accessibility-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

export function AccessibilitySettings() {
  const { fontSize, highContrast, reducedMotion, setFontSize, setHighContrast, setReducedMotion } = useAccessibility();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Settings</CardTitle>
        <CardDescription>Customize your experience to improve accessibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Text Size</h3>
          <RadioGroup value={fontSize} onValueChange={(value) => setFontSize(value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Large</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="x-large" id="x-large" />
              <Label htmlFor="x-large">Extra Large</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast</Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Increases contrast for better readability
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Minimizes animations and transitions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}