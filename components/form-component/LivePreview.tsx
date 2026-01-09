'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface Field {
  tempId: string;
  type: string;
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  options?: { label: string; value: string }[];
  rules?: { type: string; value?: any; message?: string }[];
}

interface Section {
  tempId: string;
  title?: string;
  description?: string;
  fields: Field[];
}

interface FormData {
  name?: string;
  description?: string;
}

interface LivePreviewProps {
  formData: FormData;
  sections: Section[];
}

export default function LivePreview({ formData, sections }: LivePreviewProps) {
  // Create stable string representation for deep comparison
  const formStructureKey = JSON.stringify(
    sections.map(s => ({
      id: s.tempId,
      fields: s.fields.map(f => ({
        id: f.tempId,
        type: f.type,
        name: f.name || f.tempId,
      })),
    }))
  );

  const createFieldSchema = (field: Field): z.ZodTypeAny => {
    const isRequired = field.required || field.rules?.some(r => r.type === 'required');
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'password':
      case 'phone':
      case 'url':
        schema = z.string();
        break;
      case 'email':
        schema = z.string().email({ message: 'Invalid email address' });
        break;
      case 'number':
      case 'rating':
      case 'range':
        schema = z.coerce.number();
        break;
      case 'date':
      case 'datetime':
        schema = z.coerce.date();
        break;
      case 'time':
        schema = z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format');
        break;
      case 'select':
      case 'radio':
        schema = z.string();
        break;
      case 'multi_select':
      case 'checkbox':
        schema = z.array(z.string());
        break;
      case 'toggle':
        schema = z.boolean();
        break;
      case 'file':
      case 'image':
        schema = z.any().optional();
        break;
      case 'color':
        schema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color');
        break;
      case 'hidden':
        return z.any().optional();
      default:
        schema = z.string();
    }

    // String validations
    if (['text','textarea','password','email','url','phone'].includes(field.type)) {
      field.rules?.forEach(rule => {
        if (rule.type === 'min_length') {
          schema = (schema as z.ZodString).min(rule.value ?? 0);
        }
        if (rule.type === 'max_length') {
          schema = (schema as z.ZodString).max(rule.value ?? Infinity);
        }
        if (rule.type === 'regex' && rule.value) {
          schema = (schema as z.ZodString).regex(new RegExp(rule.value));
        }
      });
    }

    // Number validations
    if (['number','rating','range'].includes(field.type)) {
      field.rules?.forEach(rule => {
        if (rule.type === 'min') schema = (schema as z.ZodNumber).min(rule.value);
        if (rule.type === 'max') schema = (schema as z.ZodNumber).max(rule.value);
      });
    }

    // Required
    if (isRequired) {
      if (['multi_select', 'checkbox'].includes(field.type)) {
        schema = schema.refine(arr => Array.isArray(arr) && arr.length > 0, 'Required');
      } else if (['select','radio'].includes(field.type)) {
        schema = schema.refine(v => v && v !== '', 'Required');
      } else if (['file','image'].includes(field.type)) {
        schema = schema.refine(v => v && (v instanceof FileList ? v.length > 0 : true));
      } else {
        schema = schema.refine(v => v !== undefined && v !== null && v !== '', 'Required');
      }
    } else {
      schema = schema.optional().nullable();
    }

    return schema;
  };

  const buildSchema = () => {
    const shape: Record<string, any> = {};
    sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === 'hidden') return;
        const name = field.name || field.tempId;
        shape[name] = createFieldSchema(field);
      });
    });
    return z.object(shape);
  };

  const schema = buildSchema();

  const form = useForm<any>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: getSafeDefaultValues(sections), // ← important!
  });
  const { register, handleSubmit, control, formState: { errors }, watch, setValue, reset } = form;
  function getSafeDefaultValues(sections: Section[]) {
    const defaults: Record<string, any> = {};
  
    sections.forEach(section => {
      section.fields.forEach(field => {
        const name = field.name || field.tempId;
  
        // Give every input field an initial empty string
        if (['text', 'textarea', 'password', 'email', 'url', 'phone', 'number', 'date', 'time', 'datetime', 'color'].includes(field.type)) {
          defaults[name] = ''; // ← this prevents uncontrolled → controlled switch
        }
        else if (['select', 'radio'].includes(field.type)) {
          defaults[name] = '';
        }
        else if (['multi_select', 'checkbox'].includes(field.type)) {
          defaults[name] = [];
        }
        else if (field.type === 'toggle') {
          defaults[name] = false;
        }
        // file/image → leave undefined or null, they handle it differently
      });
    });
  
    return defaults;
  }
  // Reset form when structure changes (very important for preview)
  useEffect(() => {
    const defaults = getSafeDefaultValues(sections);
    reset(defaults, {
      keepDefaultValues: false,
      keepValues: false,
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
    });
  }, [formStructureKey, reset]);
  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name) return;
  
      const field = // find field by name (you already have logic to loop sections)
        sections
          .flatMap(s => s.fields)
          .find(f => (f.name || f.tempId) === name);
  
      if (!field) return;
  
      const current = values[name];
  
      // Single value field but value is array? Fix it
      if (['select', 'radio'].includes(field.type) && Array.isArray(current)) {
        setValue(name, current[0] ?? '', { shouldValidate: true, shouldDirty: true });
      }
  
      // Multi value field but value is scalar? Wrap in array
      if (['multi_select', 'checkbox'].includes(field.type) && !Array.isArray(current) && current != null) {
        setValue(name, [String(current)], { shouldValidate: true, shouldDirty: true });
      }
    });
  
    return () => subscription.unsubscribe();
  }, [watch, setValue, sections]);

  const onSubmit = (data: any) => {
    toast({
      title: "Form Submitted (Preview)",
      description: "This is just a simulation — no data was sent.",
    });
    console.log('Preview data:', data);
  };

  const renderField = (field: Field) => {
    const name = field.name || field.tempId;
    const error = errors[name];

    const isRequired = field.required || field.rules?.some(r => r.type === 'required');
    const labelContent = (
      <Label className="text-sm font-medium">
        {field.label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
    );

    switch (field.type) {
      case 'text':
        case 'email':
        case 'url':
        case 'password':
        case 'phone':
        case 'number':
        case 'date':
        case 'time':
        case 'datetime':
        case 'color': {
          const typeMap: Record<string, string> = {
            phone: 'tel',
            datetime: 'datetime-local',
            time: 'time',
            date: 'date',
            number: 'number',
            color: 'color',
          };
        
          return (
            <div className="space-y-2">
              {labelContent}
              <Input
                type={typeMap[field.type] || 'text'}
                placeholder={field.placeholder}
                {...register(name)}
                value={watch(name) ?? ''}           // ← defensive!
              />
              {error && <p className="text-sm text-red-500">{error.message as string}</p>}
            </div>
          );
        }
        
        case 'textarea':
          return (
            <div className="space-y-2">
              {labelContent}
              <Textarea
                {...register(name)}
                placeholder={field.placeholder}
                value={watch(name) ?? ''}           // ← defensive!
              />
              {error && <p className="text-sm text-red-500">{error.message as string}</p>}
            </div>
          );

      case 'select':
        return (
          <div className="space-y-2">
            {labelContent}
            <Controller
              name={name}
              control={control}
              render={({ field: rhfField }) => {
                // ── VERY IMPORTANT DEFENSIVE COERCION ──
                let safeValue: string = '';
      
                if (typeof rhfField.value === 'string') {
                  safeValue = rhfField.value;
                } else if (Array.isArray(rhfField.value)) {
                  safeValue = rhfField.value[0] ?? ''; // take first if array (common after multi→single change)
                } else if (rhfField.value != null) {
                  safeValue = String(rhfField.value); // coerce numbers/whatever
                }
      
                return (
                  <Select
                    onValueChange={rhfField.onChange}
                    value={safeValue}           // always string
                    disabled={rhfField.disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || 'Select...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {error && <p className="text-sm text-red-500">{error.message as string}</p>}
          </div>
        );

      case 'multi_select':
        return (
          <div className="space-y-2">
            {labelContent}
            <div className="space-y-3 mt-2">
              {field.options?.map(opt => {
                const checked = (watch(name) || []).includes(opt.value);
                return (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${name}-${opt.value}`}
                      checked={checked}
                      onCheckedChange={checked => {
                        const current = watch(name) || [];
                        setValue(name, checked 
                          ? [...current, opt.value]
                          : current.filter(v => v !== opt.value)
                        );
                      }}
                    />
                    <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
                  </div>
                );
              })}
            </div>
            {error && <p className="text-sm text-red-500">{error.message as string}</p>}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {labelContent}
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3 mt-2">
                  {field.options?.map(opt => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
                      <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {error && <p className="text-sm text-red-500">{error.message as string}</p>}
          </div>
        );

      case 'checkbox':
        // Similar to multi_select - using same logic
        return renderField({ ...field, type: 'multi_select' });

      case 'toggle':
        return (
          <div className="flex items-center justify-between py-4">
            {labelContent}
            <Switch
              checked={watch(name) || false}
              onCheckedChange={checked => setValue(name, checked)}
            />
          </div>
        );

          case 'file':
          case 'image':
            return (
              <div className="space-y-2">
                {labelContent}
          
                <Controller
                  name={name}
                  control={control}
                  render={({ field: rhfField }) => {
                    const inputId = `file-upload-${name}`;
          
                    const handleButtonClick = () => {
                      document.getElementById(inputId)?.click();
                    };
          
                    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        rhfField.onChange(files); // FileList is passed to react-hook-form
                      }
                    };
          
                    // Optional: show selected file name
                    const selectedFileName = rhfField.value?.[0]?.name;
          
                    return (
                      <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <p className="text-muted-foreground mb-4">
                          {field.type === 'image'
                            ? 'Drag & drop an image here or click to upload'
                            : 'Drag & drop a file here or click to select'}
                        </p>
          
                        <input
                          id={inputId}
                          type="file"
                          accept={field.type === 'image' ? 'image/*' : undefined}
                          className="hidden"
                          onChange={handleFileChange}
                          // multiple={true}   ← uncomment if you want to allow multiple files
                        />
          
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleButtonClick}
                          className="mt-2"
                        >
                          Choose {field.type === 'image' ? 'Image' : 'File'}
                        </Button>
          
                        {selectedFileName && (
                          <div className="mt-4 text-sm text-primary">
                            Selected: <span className="font-medium">{selectedFileName}</span>
                          </div>
                        )}
          
                        {rhfField.value && rhfField.value.length > 0 && field.type === 'image' && (
                          <div className="mt-4">
                            <img
                              src={URL.createObjectURL(rhfField.value[0])}
                              alt="Preview"
                              className="max-h-48 mx-auto rounded-md object-contain"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
          
                {errors[name] && (
                  <p className="text-sm text-destructive mt-1">
                    {errors[name]?.message as string}
                  </p>
                )}
              </div>
            );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
          <CardDescription>
            Test your form with real validation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center space-y-3 pb-8">
              <h1 className="text-3xl font-bold">
                {formData.name || 'Untitled Form'}
              </h1>
              {formData.description && (
                <p className="text-muted-foreground">{formData.description}</p>
              )}
            </div>

            {sections.map(section => (
              <div key={section.tempId} className="space-y-8">
                {(section.title || section.description) && (
                  <>
                    {section.title && <h2 className="text-2xl font-semibold">{section.title}</h2>}
                    {section.description && <p className="text-muted-foreground">{section.description}</p>}
                    <Separator className="my-6" />
                  </>
                )}

                <div className="space-y-6">
                  {section.fields.map(field => (
                    <div key={field.tempId}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-8">
              <Button type="submit" size="lg" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}