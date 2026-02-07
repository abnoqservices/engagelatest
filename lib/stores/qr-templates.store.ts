'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QRTemplate, DEFAULT_TEMPLATES } from '@/lib/types/qr.types';

interface TemplatesState {
  templates: QRTemplate[];
  selectedTemplate: QRTemplate;
  addTemplate: (template: QRTemplate) => void;
  updateTemplate: (id: string, updates: Partial<QRTemplate>) => void;
  removeTemplate: (id: string) => void;
  setSelectedTemplate: (template: QRTemplate) => void;
}

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set, get) => ({
      // Initial state: defaults + any persisted custom ones will be merged automatically
      templates: DEFAULT_TEMPLATES,
      selectedTemplate: DEFAULT_TEMPLATES[0],

      addTemplate: (newTemplate) => {
        set((state) => {
          // Prevent duplicate ids
          if (state.templates.some((t) => t.id === newTemplate.id)) return state;

          return {
            templates: [...state.templates, newTemplate],
            selectedTemplate: newTemplate, // auto-select new one (optional)
          };
        });
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
          // If currently selected → update preview too
          selectedTemplate:
            state.selectedTemplate.id === id
              ? { ...state.selectedTemplate, ...updates }
              : state.selectedTemplate,
        }));
      },

      removeTemplate: (id) => {
        set((state) => {
          const remaining = state.templates.filter((t) => t.id !== id);
          return {
            templates: remaining.length > 0 ? remaining : DEFAULT_TEMPLATES,
            selectedTemplate:
              state.selectedTemplate.id === id
                ? remaining[0] ?? DEFAULT_TEMPLATES[0]
                : state.selectedTemplate,
          };
        });
      },

      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
    }),
    {
      name: 'qr-custom-templates',           // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist custom templates (not defaults)
        templates: state.templates.filter(
          (t) => !DEFAULT_TEMPLATES.some((d) => d.id === t.id)
        ),
      }),
      // Important: merge persisted custom templates with defaults on load
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;

        return {
          ...currentState,
          templates: [
            ...DEFAULT_TEMPLATES,
            ...(persistedState.templates || []),
          ],
          // Keep selected if it still exists, otherwise fallback
          selectedTemplate:
            currentState.templates.find(
              (t) => t.id === currentState.selectedTemplate.id
            ) || DEFAULT_TEMPLATES[0],
        };
      },
    }
  )
);