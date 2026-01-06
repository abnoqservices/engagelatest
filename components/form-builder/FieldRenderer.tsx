// src/components/form-builder/FieldRenderer.tsx
"use client";

import React from "react";
import { Field } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff, Star, Upload } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn cn helper

interface FieldRendererProps {
  field: Field;
  mode: "builder" | "preview";
}

export default function FieldRenderer({ field, mode }: FieldRendererProps) {
  const formContext = useFormContext();
  const isDisabled = mode === "builder";

  const setValue = formContext?.setValue;
  const watch = formContext?.watch;

  const commonProps = {
    disabled: isDisabled,
    placeholder: field.options?.placeholder || "",
  };

  const renderLabel = () => (
    <Label htmlFor={field.key}>
      {field.label} {field.is_required && <span className="text-red-500">*</span>}
    </Label>
  );

  // Safe value access - only in preview mode
  const value = mode === "preview" && watch ? watch(field.key) : undefined;

  // Reusable Password Input component
  const PasswordInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, disabled, ...props }, ref) => {
      const [showPassword, setShowPassword] = React.useState(false);

      return (
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-label="Hide password" />
            ) : (
              <Eye className="h-4 w-4" aria-label="Show password" />
            )}
          </Button>
        </div>
      );
    }
  );
  PasswordInput.displayName = "PasswordInput";

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "phone":
    case "date":
    case "time":
    case "password":
      const inputType = field.type === "password" ? "password" : field.type;

      return (
        <div className="space-y-1">
          {renderLabel()}
          {field.type === "password" ? (
            <PasswordInput id={field.key} placeholder={commonProps.placeholder} disabled={isDisabled} />
          ) : (
            <Input type={inputType} id={field.key} {...commonProps} />
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-1">
          {renderLabel()}
          <Textarea id={field.key} {...commonProps} />
        </div>
      );

    case "select":
      return (
        <div className="space-y-1">
          {renderLabel()}
          <Select disabled={isDisabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.choices?.map((choice: string, i: number) => (
                <SelectItem key={i} value={choice}>
                  {choice}
                </SelectItem>
              )) ?? <SelectItem value="">No options</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      );

    case "multi_select": {
      const selected =
        mode === "preview" && watch
          ? (watch(field.key) as string[] | undefined) ?? []
          : [];

      const choices = field.options?.choices ?? [];

      const options = choices.map((choice: string) => ({
        label: choice,
        value: choice,
      }));

      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <MultiSelect
            options={options}
            value={selected}
            onValueChange={
              mode === "preview" && setValue
                ? (vals: string[]) => setValue(field.key, vals, { shouldValidate: true })
                : undefined
            }
            placeholder={field.options?.placeholder || "Select one or more..."}
            disabled={isDisabled}
          />
        </div>
      );
    }

    case "checkbox":
      return (
        <div className="space-y-1">
          {renderLabel()}
          {field.options?.choices?.map((choice: string, i: number) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox id={`${field.key}-${i}`} disabled={isDisabled} />
              <Label htmlFor={`${field.key}-${i}`}>{choice}</Label>
            </div>
          )) ?? <div className="text-sm text-muted-foreground">No options</div>}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-1">
          {renderLabel()}
          <RadioGroup disabled={isDisabled}>
            {field.options?.choices?.map((choice: string, i: number) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`${field.key}-${i}`} />
                <Label htmlFor={`${field.key}-${i}`}>{choice}</Label>
              </div>
            )) ?? <div className="text-sm text-muted-foreground">No options</div>}
          </RadioGroup>
        </div>
      );

    case "rating": {
      const currentValue = mode === "preview" && watch ? Number(watch(field.key) ?? 0) : 0;
      const maxStars = field.options?.max ?? 5;
      const starSize = field.options?.size ?? 28; // in pixels

      const handleRatingChange = (newRating: number) => {
        if (mode === "preview" && setValue) {
          setValue(field.key, newRating, { shouldValidate: true });
        }
      };

      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxStars }).map((_, index) => {
              const starValue = index + 1;
              const isActive = currentValue >= starValue;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleRatingChange(starValue)}
                  className={cn(
                    "focus:outline-none transition-all",
                    isDisabled ? "cursor-not-allowed opacity-70" : "hover:scale-110"
                  )}
                >
                  <Star
                    className={cn(
                      "transition-colors",
                      isActive ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    )}
                    size={starSize}
                    strokeWidth={isActive ? 0 : 1.5}
                  />
                </button>
              );
            })}

            {mode === "preview" && currentValue > 0 && (
              <span className="ml-3 text-sm text-muted-foreground">
                {currentValue} / {maxStars}
              </span>
            )}
          </div>
        </div>
      );
    }

    case "range":
      return (
        <div className="space-y-1">
          {renderLabel()}
          <Slider
            defaultValue={[field.options?.min || 0]}
            min={field.options?.min || 0}
            max={field.options?.max || 100}
            step={field.options?.step || 1}
            disabled={isDisabled}
          />
        </div>
      );

    case "file":
    case "image": {
      const isImage = field.type === "image";
      const accept = isImage
        ? "image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        : field.options?.allowed_types?.map((ext: string) => `.${ext}`).join(",") ||
          "application/pdf,.doc,.docx,.txt";

      const maxSizeBytes = (field.options?.max_size ?? 2048) * 1024;

      const currentFile = value as File | undefined;

      return (
        <div className="space-y-2">
          {renderLabel()}

          {mode === "preview" && setValue ? (
            <FileDropzone
              onFilesChange={(files) => {
                if (files?.length) {
                  setValue(field.key, files[0], { shouldValidate: true });
                }
              }}
              accept={accept}
              maxFiles={1}
              maxSize={maxSizeBytes}
            />
          ) : (
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/40 pointer-events-none">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                {isImage ? "Image upload" : "File upload"} (preview in form mode)
              </p>
            </div>
          )}

          {currentFile && mode === "preview" && (
            <div className="mt-3 text-sm">
              {isImage && currentFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(currentFile)}
                  alt="Preview"
                  className="max-h-40 object-contain rounded border bg-black/5"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{currentFile.name}</span>
                  <span className="text-muted-foreground">
                    ({(currentFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Max size: {field.options?.max_size ?? 2048} KB •{" "}
            {isImage ? "Images only" : "Documents allowed"}
          </p>
        </div>
      );
    }

    default:
      return <div className="text-destructive">Unsupported field type: {field.type}</div>;
  }
}