'use client'

import Color from 'color'
import type { HTMLAttributes } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from '@/components/ui/color-picker'

export type ColorPickerFieldProps = HTMLAttributes<HTMLDivElement> & {
  value?: string | null
  defaultValue?: string
  onChange?: (hex: string) => void
}

export function ColorPickerField({
  value,
  defaultValue = '#3b82f6',
  onChange,
  className,
  ...props
}: ColorPickerFieldProps) {
  return (
    <Card className="p-0">
      <CardContent className="p-2">
        <ColorPicker
          value={value || defaultValue}
          defaultValue={defaultValue}
          onChange={(rgba) => {
            const [r, g, b] = rgba
            const hex = Color.rgb(r, g, b).hex()
            onChange?.(hex)
          }}
          className={className}
          {...props}
        >
          <ColorPickerSelection className="h-32 rounded" />
          <ColorPickerHue className="rounded" />
          <ColorPickerAlpha className="rounded" />
          <div className="flex w-full min-w-0 items-center gap-2">
            <ColorPickerOutput />
            <ColorPickerFormat />
          </div>
        </ColorPicker>
      </CardContent>
    </Card>
  )
}
