import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// TODO: Implement uploadFiles utility
const uploadFiles = () => {
  console.log('uploadFiles called');
};

export const ContextUploadMenu: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // uploadFiles(Array.from(e.target.files));
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => fileInputRef.current?.click()}>
            Add photos and files
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add from apps</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                {/* TODO: Implement app integrations */}
                <span>Coming soon...</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};