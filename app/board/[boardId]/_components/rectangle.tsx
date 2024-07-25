import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
  id: string
  layer: RectangleLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectionColor?: string
}

export const Rectangle: React.FC<RectangleProps> = ({ id, layer, onPointerDown, selectionColor }) => {
  const { fill, height, type, width, x, y } = layer

  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`
      }}
      y={0}
      x={0}
      height={height}
      width={width}
      strokeWidth={2}
      fill={fill ? colorToCss(fill) : '#000'}
      stroke={selectionColor || 'transparant'}
    />
  )
}
