"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const FlagTextarea = ({ value, onChange }) => {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Flagged Text Snippets</Label>
      <Textarea
        id="message"
        placeholder="Paste each highlighted text snippet on a new line."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
      />
      <p className="text-sm text-muted-foreground">
        Each line will be treated as a separate flagged item.
      </p>
    </div>
  );
};