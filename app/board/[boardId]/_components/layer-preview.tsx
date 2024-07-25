"use client"

import { LayerType } from "@/types/canvas"
import { useStorage } from "@liveblocks/react"
import { memo } from "react"
import { Rectangle } from "./rectangle"
import { Ellipse } from "./ellipse"
import { Text } from "./text"
import { Note } from "./note"
import { Path } from "./path"
import { colorToCss } from "@/lib/utils"


interface LayerPreviewProps {
  id: string
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void
  selectionColor?: string
}


export const LayerPreview = memo(
  ({ id, onLayerPointDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id))

    if (!layer) return null

    switch (layer.type) {
      case LayerType.Path:
        return (
          <Path  onPointerDown={(e) => onLayerPointDown(e, id)} x={layer.x} y={layer.y} fill={layer.fill ? colorToCss(layer.fill) : '#000'} stroke={selectionColor} points={layer.points} />
        )
      case LayerType.Note:
        return (
          <Note id={id} layer={layer} onPointerDown={onLayerPointDown} selectionColor={selectionColor} />
        )
      case LayerType.Text:
        return (
          <Text id={id} layer={layer} onPointerDown={onLayerPointDown} selectionColor={selectionColor} />
        )
      case LayerType.Ellipse:
        return (
          <Ellipse id={id} layer={layer} onPointerDown={onLayerPointDown} selectionColor={selectionColor} />
        )
      case LayerType.Rectangle:
        return (
          <Rectangle id={id} layer={layer} onPointerDown={onLayerPointDown} selectionColor={selectionColor} />
        )
      default:
        console.warn("Unknown layer type")
        return null
    }
  }
)

LayerPreview.displayName = "LayerPreview"