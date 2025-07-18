"use client";

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ParamPanel = ({ onParamsChange }) => {
  const [params, setParams] = useState({
    generateSlides: false,
    arweaveProof: false,
    privateUpload: false,
    joinCircle: '',
    citationStyle: 'harvard',
  });

  const handleChange = (key, value) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange(newParams);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-bold">Advanced Options</h3>
      <div className="flex items-center justify-between">
        <Label htmlFor="generate-slides">Generate Slides</Label>
        <Switch
          id="generate-slides"
          checked={params.generateSlides}
          onCheckedChange={(checked) => handleChange('generateSlides', checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="arweave-proof">Arweave Proof</Label>
        <Switch
          id="arweave-proof"
          checked={params.arweaveProof}
          onCheckedChange={(checked) => handleChange('arweaveProof', checked)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="private-upload">Private Upload</Label>
        <Switch
          id="private-upload"
          checked={params.privateUpload}
          onCheckedChange={(checked) => handleChange('privateUpload', checked)}
        />
      </div>
      <div>
        <Label htmlFor="join-circle">Join Study Circle</Label>
        <Input 
          id="join-circle"
          placeholder="Enter Circle ID to join"
          value={params.joinCircle}
          onChange={(e) => handleChange('joinCircle', e.target.value)}
        />
      </div>
      <div>
        <Label>Citation Style</Label>
        <Select value={params.citationStyle} onValueChange={(value) => handleChange('citationStyle', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="harvard">Harvard</SelectItem>
            <SelectItem value="apa">APA</SelectItem>
            <SelectItem value="vancouver">Vancouver</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};