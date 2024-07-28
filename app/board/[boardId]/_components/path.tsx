import { colorToCss, getSvgPathFromStroke } from "@/lib/utils"
import getStroke from "perfect-freehand"

interface PathProps {
  x: number
  y: number
  onPointerDown?: (e: React.PointerEvent) => void
  fill: string
  points: number[][]
  stroke?: string
}


export const Path: React.FC<PathProps> = ({ onPointerDown, fill, points, x, y, stroke }) => {
  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, { 
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5
        })
      )}
      style={{
        transform: `translate(
          ${x}px,
          ${y}px
        )`
      }}
      fill={fill ? fill : '#000'}
      x={0}
      y={0}
    />
  )
}