import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen, Brain, Send, StopCircle, Zap, Cpu, Paperclip, X, Plus, ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploadZone from "./ui/FileUploadZone";
import { usePrefsStore } from "@/store/usePrefs";
import { ContextUploadMenu } from "./chat/ContextUploadMenu";
import { MicButton } from "./chat/MicButton";

// Updated InputFormProps
interface InputFormProps {
  onSubmit: (inputValue: string, writeupType: string, model: string, files: File[]) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
}) => {
  const [internalInputValue, setInternalInputValue] = useState("");
  const [writeupType, setWriteupType] = useState("general");
  const { model } = usePrefsStore();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim() && files.length === 0) return;
    onSubmit(internalInputValue, writeupType, model, files);
    setInternalInputValue("");
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const isSubmitDisabled = !internalInputValue.trim() || isLoading;

  return (
    <form
      onSubmit={handleInternalSubmit}
      className="flex flex-col gap-2 p-3 pb-4"
    >
      <div className="relative flex items-center">
        <div className="absolute left-2">
          <ContextUploadMenu />
        </div>
        <Textarea
          value={internalInputValue}
          onChange={(e) => setInternalInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How can I help you today?"
          className="w-full rounded-full border bg-neutral-700 px-12 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
        />
        <div className="absolute right-10">
            <MicButton onTranscript={setInternalInputValue} />
        </div>
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 rounded-full bg-black text-white p-2 h-9 w-9 hover:bg-neutral-800 active:scale-95 transition"
          disabled={isSubmitDisabled}
        >
          {isLoading ? (
            <StopCircle className="h-6 w-6 text-red-500" onClick={onCancel} />
          ) : (
            <ArrowUp className="h-6 w-6" />
          )}
        </Button>
      </div>
      <div className="flex items-center justify-start gap-4 px-2">
        <Select value={writeupType} onValueChange={setWriteupType}>
          <SelectTrigger className="w-[180px] bg-neutral-700 border-none">
            <SelectValue placeholder="Write-up Type" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-700 text-neutral-100">
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="essay">Essay</SelectItem>
            <SelectItem value="report">Report</SelectItem>
            <SelectItem value="case_study">Case Study</SelectItem>
            <SelectItem value="case_scenario">Case Scenario</SelectItem>
            <SelectItem value="dissertation">Dissertation</SelectItem>
            <SelectItem value="reflection">Reflection</SelectItem>
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="presentation">Presentation</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};
