"use client";

import { memo, useEffect } from "react";
import { Cursor } from "./cursor";
import { shallow, useOthersConnectionIds, useOthersMapped } from "@liveblocks/react/suspense";
import { Path } from "./path";
import { colorToCss } from "@/lib/utils";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionid) => {
        return <Cursor key={connectionid} connectionid={connectionid} />;
      })}
    </>
  );
};

const Drafs = () => {
  const others = useOthersMapped((other) => ({
    pencilDraf: other.presence.pencilDraf,
    penColor: other.presence.penColor
  }), shallow)

  return others.map(([key, other]) => {
    if (other.pencilDraf) {
      return (
        <Path
          key={key}
          x={0}
          y={0}
          points={other.pencilDraf}
          fill={other.penColor ? colorToCss(other.penColor) : '#000'}
        />
      )
    }
  })
}

export const CursorsPresence = memo(() => {
  return (
    <>
      <Drafs />
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";
