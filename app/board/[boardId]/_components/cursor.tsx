"use client"

import { connectionIdToCoor } from "@/lib/utils"
import { useOther } from "@liveblocks/react"
import { MousePointer2 } from "lucide-react"
import { memo } from "react"

interface CursorProps {
  connectionid: number
}

export const Cursor = memo((props: CursorProps) => {
  const info = useOther(props.connectionid, (user) => user?.info)
  const cursor = useOther(props.connectionid, (user) => user.presence.cursor)


  const name = info?.name || "Teammate"

  if (!cursor) {
    return null
  }

  const { x, y } = cursor

  return (
    <>
      <foreignObject style={{ transform: `translateX(${x}px) translateY(${y}px)` }} height={50} width='100' className="relative drop-shadow-md">
        <MousePointer2
          className="h-5 w-5"
          style={{
            fill: connectionIdToCoor(props.connectionid),
            color: connectionIdToCoor(props.connectionid)
          }}
        />
        <div className="absolute left-5 px-1.5 w-100 py-0.5 rounded-md text-xs text-white font-semibold" style={{ backgroundColor: connectionIdToCoor(props.connectionid) }}>
          {name}
        </div>
      </foreignObject>
    </>
  )
})

Cursor.displayName = "Cursor"