'use client';

import { Tag, TagPosition, TagField } from '@/lib/types/qr.types';

type CompactFieldProps = {
  label: string;
  children: React.ReactNode;
};

function CompactField({ label, children }: CompactFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-gray-1000">{label}</label>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────
//               Complete Props Interface
// ────────────────────────────────────────────────
interface QREditorProps {
  activeTab: 'settings' | 'tags' | 'style';
  tags: Tag[];
  qrSize: number;
  backgroundColor: string;
  textColor: string;

  // Style-related props
  dotStyle?: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  cornerStyle?: 'square' | 'extra-rounded' | 'dot';
  eyeColor?: string;
  gradientOnDots?: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
  logoUrl?: string;
  logoPadding?: number;

  // Handlers
  onUpdateTag: (id: string, updates: Partial<Tag>) => void;
  onAddTag: () => void;
  onRemoveTag: (id: string) => void;
  onUpdateQRSize: (size: number) => void;
  onUpdateBackgroundColor: (color: string) => void;
  onUpdateTextColor: (color: string) => void;

  // Style handlers
  onUpdateDotStyle?: (style: string) => void;
  onUpdateCornerStyle?: (style: string) => void;
  onUpdateEyeColor?: (color: string) => void;
  onUpdateGradient?: (enabled: boolean, color1: string, color2: string) => void;
  onUpdateLogo?: (url: string) => void;
}

// ────────────────────────────────────────────────
//               Static Options
// ────────────────────────────────────────────────
const FIELD_OPTIONS: { value: TagField; label: string }[] = [
  { value: 'productName', label: 'Product Name' },
  { value: 'sku', label: 'SKU' },
  { value: 'category', label: 'Category' },
  { value: 'price', label: 'Price' },
  { value: 'productId', label: 'Product ID' },
  { value: 'url', label: 'URL' },
  { value: 'custom', label: 'Custom Text' },
];

const POSITION_OPTIONS: { value: TagPosition; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

const FONT_FAMILY_OPTIONS = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
];

// ────────────────────────────────────────────────
//                 Main Component
// ────────────────────────────────────────────────
export default function QREditor({
  activeTab,
  tags,
  qrSize,
  backgroundColor,
  textColor,
  dotStyle = 'square',
  cornerStyle = 'square',
  eyeColor,
  gradientOnDots = false,
  gradientColor1 = '#4f46e5',
  gradientColor2 = '#ec4899',
  logoUrl = '',
  onUpdateTag,
  onAddTag,
  onRemoveTag,
  onUpdateQRSize,
  onUpdateBackgroundColor,
  onUpdateTextColor,
  onUpdateDotStyle,
  onUpdateCornerStyle,
  onUpdateEyeColor,
  onUpdateGradient,
  onUpdateLogo,
}: QREditorProps) {
  return (
    <div className="space-y-6">
      {/* ── SETTINGS TAB ── */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <h3 className="text-base font-semibold text-gray-800">QR Code Settings</h3>

          {/* QR Size */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">QR Size</label>
              <span className="text-xs text-gray-500">{qrSize}px</span>
            </div>
            <input
              type="range"
              min="100"
              max="300"
              value={qrSize}
              onChange={(e) => onUpdateQRSize(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-xs font-medium text-gray-600">Background</p>
                <p className="text-xs font-mono text-gray-500">{backgroundColor}</p>
              </div>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onUpdateBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-xs font-medium text-gray-600">QR Color</p>
                <p className="text-xs font-mono text-gray-500">{textColor}</p>
              </div>
              <input
                type="color"
                value={textColor}
                onChange={(e) => onUpdateTextColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAGS TAB ── */}
      {activeTab === 'tags' && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Tags / Labels</h3>
            <button
              onClick={onAddTag}
              className="h-8 px-3 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700"
            >
              + Add Tag
            </button>
          </div>

          {tags.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">No tags added yet</div>
          ) : (
            <div className="space-y-3">
              {tags.map((tag) => (
                <div key={tag.id} className="rounded-md border px-3 py-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={tag.enabled}
                        onChange={(e) => onUpdateTag(tag.id, { enabled: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                      Enable tag
                    </label>

                    <button
                      onClick={() => onRemoveTag(tag.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  {tag.enabled && (
                    <div className="mt-3 border-t border-gray-200 pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <CompactField label="Field">
                          <select
                            value={tag.field}
                            onChange={(e) =>
                              onUpdateTag(tag.id, { field: e.target.value as TagField })
                            }
                            className="compact-input w-full"
                          >
                            {FIELD_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </CompactField>

                        <CompactField label="Position">
                          <select
                            value={tag.position}
                            onChange={(e) =>
                              onUpdateTag(tag.id, { position: e.target.value as TagPosition })
                            }
                            className="compact-input w-full"
                          >
                            {POSITION_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </CompactField>
                      </div>

                      <CompactField label="Value">
                        <input
                          type="text"
                          value={tag.value ?? ''}
                          onChange={(e) => onUpdateTag(tag.id, { value: e.target.value })}
                          placeholder="Custom or dynamic"
                          className="compact-input w-full"
                        />
                      </CompactField>

                      <div className="grid grid-cols-3 gap-3">
                        <CompactField label="Size">
                          <input
                            type="number"
                            min={8}
                            max={32}
                            value={tag.fontSize ?? 12}
                            onChange={(e) =>
                              onUpdateTag(tag.id, { fontSize: Number(e.target.value) })
                            }
                            className="compact-input w-full"
                          />
                        </CompactField>

                        <CompactField label="Weight">
                          <select
                            value={tag.fontWeight ?? 'normal'}
                            onChange={(e) =>
                              onUpdateTag(tag.id, {
                                fontWeight: e.target.value as 'normal' | 'bold',
                              })
                            }
                            className="compact-input w-full"
                          >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                          </select>
                        </CompactField>

                        <CompactField label="Font">
                          <select
                            value={tag.fontFamily || 'Arial, sans-serif'}
                            onChange={(e) =>
                              onUpdateTag(tag.id, { fontFamily: e.target.value })
                            }
                            className="compact-input w-full"
                          >
                            {FONT_FAMILY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </CompactField>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STYLE TAB ── */}
      {activeTab === 'style' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
          <h3 className="text-base font-semibold text-gray-800">QR Style & Appearance</h3>

          <CompactField label="Dot Style">
            <select
              value={dotStyle}
              onChange={(e) => onUpdateDotStyle?.(e.target.value)}
              className="compact-input w-full"
            >
              <option value="square">Square (default)</option>
              <option value="dots">Dots</option>
              <option value="rounded">Rounded</option>
              <option value="extra-rounded">Extra Rounded</option>
              <option value="classy">Classy</option>
              <option value="classy-rounded">Classy Rounded</option>
            </select>
          </CompactField>

          <CompactField label="Corner Style">
            <select
              value={cornerStyle}
              onChange={(e) => onUpdateCornerStyle?.(e.target.value)}
              className="compact-input w-full"
            >
              <option value="square">Square</option>
              <option value="extra-rounded">Extra Rounded</option>
              <option value="dot">Dot</option>
            </select>
          </CompactField>

          <div className="grid grid-cols-2 gap-4">
            <CompactField label="Main QR Color">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-xs font-mono text-gray-500">{textColor}</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => onUpdateTextColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border"
                />
              </div>
            </CompactField>

            <CompactField label="Eye / Marker Color">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-xs font-mono text-gray-500">
                  {eyeColor || textColor}
                </span>
                <input
                  type="color"
                  value={eyeColor || textColor}
                  onChange={(e) => onUpdateEyeColor?.(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border"
                />
              </div>
            </CompactField>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={gradientOnDots}
                onChange={(e) =>
                  onUpdateGradient?.(
                    e.target.checked,
                    gradientColor1,
                    gradientColor2
                  )
                }
                className="h-4 w-4 text-indigo-600 rounded"
              />
              Use Gradient on Dots
            </label>

            {gradientOnDots && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <CompactField label="Color 1">
                  <input
                    type="color"
                    value={gradientColor1}
                    onChange={(e) =>
                      onUpdateGradient?.(true, e.target.value, gradientColor2)
                    }
                    className="w-full h-9 rounded border"
                  />
                </CompactField>

                <CompactField label="Color 2">
                  <input
                    type="color"
                    value={gradientColor2}
                    onChange={(e) =>
                      onUpdateGradient?.(true, gradientColor1, e.target.value)
                    }
                    className="w-full h-9 rounded border"
                  />
                </CompactField>
              </div>
            )}
          </div>

          <CompactField label="Center Logo">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => onUpdateLogo?.(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="compact-input w-full"
              />
              <p className="text-xs text-gray-500">
                Or upload image (add file input + upload logic later)
              </p>
            </div>
          </CompactField>

          <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            More coming soon: background image, border radius, pattern overlay, frame text...
          </div>
        </div>
      )}
    </div>
  );
}