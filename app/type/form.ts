export interface FieldRule {
    type: string;
    value?: number | string;
    message?: string;
  }
  
  export interface FieldOptions {
    [key: string]: any;
    choices?: string[];
    multiple?: boolean;
    min?: number;
    max?: number;
    step?: number;
    max_size?: number;
    allowed_types?: string[];
    placeholder?: string;
  }
  
  export interface Field {
    id: string;
    label: string;
    key: string;
    type:
      | 'text'
      | 'textarea'
      | 'email'
      | 'number'
      | 'phone'
      | 'date'
      | 'select'
      | 'multi_select'
      | 'radio'
      | 'checkbox'
      | 'file'
      | 'image'
      | 'rating'
      | 'range';
    options: FieldOptions;
    rules: FieldRule[];
    is_required: boolean;
    is_active: boolean;
    order: number;
    form_section_id: number | null;
  }