"use client"

import { colorToCss } from "@/lib/utils"
import { Color } from "@/types/canvas"

interface ColorPickerProps {
  onChange: (color: Color) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  return  (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r  border-neutral-200">
      <ColorButton color={{ b: 35, g: 82, r: 243 }} onClick={onChange} />
      <ColorButton color={{ b: 177, g: 249, r: 255 }} onClick={onChange} />
      <ColorButton color={{ b: 99, g: 202, r: 68 }} onClick={onChange} />
      <ColorButton color={{ b: 237, g: 142, r: 39 }} onClick={onChange} />
      <ColorButton color={{ b: 245, g: 105, r: 155 }} onClick={onChange} />
      <ColorButton color={{ b: 42, g: 142, r: 252 }} onClick={onChange} />
      <ColorButton color={{ b: 42, g: 142, r: 252 }} onClick={onChange} />
      <ColorButton color={{ b: 255, g: 255, r: 255 }} onClick={onChange} />
    </div>
  )
}


interface ColorButtonProps {
  onClick: (color: Color) => void
  color: Color
}


const ColorButton: React.FC<ColorButtonProps> = ({ color, onClick }) => {
  return (
    <button className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition" onClick={() => onClick(color)}>
      <div className="h-8  w-8 rounded-md border border-neutral-300" style={{ background: colorToCss(color) }}>

      </div>
    </button>
  )
}