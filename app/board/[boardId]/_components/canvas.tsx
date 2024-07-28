"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canvas"
import { useCanRedo, useCanUndo, useHistory, useMutation } from "@liveblocks/react"
import { CursorsPresence } from "./cursours-presence"
import { colorToCss, connectionIdToCoor, findIntersectionLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils"
import { useOthersMapped, useSelf, useStorage } from '@liveblocks/react/suspense'
import { nanoid } from "nanoid"
import { LiveObject } from "@liveblocks/client"
import { LayerPreview } from "./layer-preview"
import { SelectionBox } from "./selection-box"
import { SelectionTools } from "./selection-tools"
import { Path } from "./path"
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce"
import { useDeleteLayers } from "@/hooks/use-delete-layers"

const MAX_LAYERS = 100


interface CanvasProps {
  boardId: string
}


export const Canvas: React.FC<CanvasProps> = ({ boardId }) => {
  const layerIds = useStorage((root) => root.layerIds)

  const pencilDraf = useSelf(me => me.presence.pencilDraf)
  const [lastusedColor, setLastUsedColor] = useState<Color>({ b: 0, g: 0, r: 0 })
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  })



  useDisableScrollBounce()
  const history = useHistory()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()


  const selections = useOthersMapped((other) => other.presence.selection)
  const layerIdsColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {}

    for (const user of selections) {
      const [connectionId, selection] = user
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToCoor(connectionId)
      }
    }
    return layerIdsToColorSelection
  }, [selections])




  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleMouseWheel, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleMouseWheel);
    };
  }, [])



  const handleKeyDown = (event: any) => {
    if (
      event.ctrlKey &&
      (
        event.which === 61 ||
        event.which === 107 ||
        event.which === 173 ||
        event.which === 109 ||
        event.which === 187 ||
        event.which === 189
      )
    ) event.preventDefault();
  };


  /**
  * handleMouseWheel
  * This function will prevent default for handling wheen in window and when
  * press ctrl key
  * @param {WheelEvent} event
  */
  const handleMouseWheel = (event: WheelEvent) => {
    if (event.ctrlKey) event.preventDefault();
  };



  /**
  * insertLayer
  * @param {layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note} layerType
  * @param {Point} position
  * @returns {void}
  */
  const insertLayer = useMutation(
    ({ storage, setMyPresence }, layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, position: Point) => {
      const liveLayers = storage.get("layers")
      if (liveLayers.size >= MAX_LAYERS) {
        return
      }

      const liveLayersIds = storage.get('layerIds')
      const layerId = nanoid()
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastusedColor
      })

      liveLayersIds.push(layerId)
      liveLayers.set(layerId, layer)

      setMyPresence({ selection: [layerId] }, { addToHistory: true  })
      setCanvasState({ mode: CanvasMode.None })
    }, [lastusedColor]
  )




  const onWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) e.preventDefault()
    setCamera((camera) => ({
      x: camera.x - (e.shiftKey ? e.deltaY : e.deltaX),
      y: camera.y - (e.shiftKey ? e.deltaX : e.deltaY)
    }))
  }, [])




  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return
      }

      const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point)
      const liveLayers = storage.get('layers')
      const layer =liveLayers.get(self.presence.selection[0])
      
      if (layer) {
        layer.update(bounds)
      }
    }, [canvasState]
  )



  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraf } = self.presence

      if (
        e.buttons !== 1 ||
        pencilDraf === null
      ) return

      setMyPresence({
        cursor: point,
        pencilDraf:
          pencilDraf.length === 1 &&
          pencilDraf[0][0] === point.x &&
          pencilDraf[0][1] === point.y
            ? [...pencilDraf, ...pencilDraf]
            : [...pencilDraf, [point.x, point.y, e.pressure]]
      })
    }, [canvasState.mode]
  )



  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point ) => {
      const layres = storage.get('layers').toImmutable()
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current })

      const ids = findIntersectionLayersWithRectangle(layerIds, layres, origin, current)
      setMyPresence({ selection: ids as any })
    }, [layerIds]
  )



  const starMultiSelection = useCallback(
    (current: Point, origin: Point) => {
      if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
        setCanvasState({ mode: CanvasMode.SelectionNet, origin, current })
      } 
    }, []
  )



  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y
      }

      const liveLayers = storage.get('layers')

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id)
        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          })
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point })
    }, [canvasState]
  ) 


  const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e?.preventDefault()
    const current = pointerEventToCanvasPoint(e, camera)
    if (canvasState.mode === CanvasMode.Pressing) starMultiSelection(current, canvasState.origin)
    else if (canvasState.mode === CanvasMode.SelectionNet) updateSelectionNet(current, canvasState.origin)
    else if (canvasState.mode === CanvasMode.Translating) translateSelectedLayers(current)
    else if (canvasState.mode === CanvasMode.Resizing) resizeSelectedLayer(current)
    else if (canvasState.mode === CanvasMode.Pencil) continueDrawing(current, e)

    setMyPresence({ cursor: current })
  }, [camera, canvasState, resizeSelectedLayer, translateSelectedLayers, continueDrawing])



  const onPointerLeave = useMutation(
    ({ setMyPresence }) => {
      setMyPresence({ cursor: null })
    }, []
  )


  const unselectedLayers = useMutation(
    ({ self, setMyPresence }) => {
      if (self.presence.selection.length > 0) {
        setMyPresence({ selection: [] }, { addToHistory: true })
      }
    }, []
  )


  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get('layers')
      const { pencilDraf } = self.presence

      if (pencilDraf == null || pencilDraf.length < 2 || liveLayers.size >= MAX_LAYERS) {
        setMyPresence({ pencilDraf: null })
        return 
      }

      const id = nanoid()
      liveLayers.set(
        id,
        new LiveObject(penPointsToPathLayer(pencilDraf, lastusedColor))
      )

      const liveLayersIds = storage.get('layerIds')
      liveLayersIds.push(id)
      setMyPresence({ pencilDraf: null })
      setCanvasState({ mode: CanvasMode.Pencil })
    }, [lastusedColor]
  )
  


  const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
    history.pause()
    setCanvasState({
      mode: CanvasMode.Resizing,
      initialBounds,
      corner
    })
  }, [history])



  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
        return
      }
      history.pause()
      e.stopPropagation()
      const point = pointerEventToCanvasPoint(e, camera)

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true })
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point })
    }, [setCanvasState, camera, history, canvasState.mode]
  )



  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, e: React.PointerEvent) => {
      setMyPresence({
        pencilDraf: [[ point.x, point.y, e.pressure ]],
        penColor: lastusedColor
      })

      continueDrawing(point, e)
    }, []
  )



  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera)
      if (canvasState.mode === CanvasMode.Inserting) {
        return
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e)
        return
      }

      setCanvasState({ mode: CanvasMode.Pressing, origin: point })
    }, [camera, canvasState.mode, setCanvasState, startDrawing]
  )



  const onPointerUp = useMutation(
    ({}, e) => {
      const pointer = pointerEventToCanvasPoint(e, camera)
      
      if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
        unselectedLayers()
        setCanvasState({ mode: CanvasMode.None })
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath()
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, pointer)
      } else {
        setCanvasState({ mode: CanvasMode.None })
      }

      history.resume()
    }, [camera, canvasState, history, insertLayer, unselectedLayers, insertPath]
  )



  const deleteLayer = useDeleteLayers()



  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Backspace':
          if (canvasState.mode === CanvasMode.SelectionNet) {
            deleteLayer()
          }
          break
        case 'z': {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) history.redo()
            else history.undo()
          }
          break
        } 
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [deleteLayer, history])


  return (
    <main  className="h-full w-full relative bg-neutra l-100 touch-none" >
      <Info  boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />
      <svg onPointerUp={onPointerUp} onPointerDown={onPointerDown} onPointerLeave={onPointerLeave} onWheel={onWheel} onPointerMove={onPointerMove} className="h-[100vh] w-[100vw]">
        <defs>
          <pattern id="dot-pattern" patternUnits="userSpaceOnUse" width="32" height="32">
            <image href="/dot.png" width="32" height="32" />
          </pattern>
        </defs>
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#dot-pattern)" />
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointDown={onLayerPointerDown}
              selectionColor={layerIdsColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1"
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
          <CursorsPresence />
          {
            pencilDraf != null && pencilDraf.length > 0 && (
              <Path
                points={pencilDraf}
                fill={colorToCss(lastusedColor)}
                x={0}
                y={0}
              /> 
            )
          }
        </g>
      </svg>

    </main>
  )
}
