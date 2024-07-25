"use client"

import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { Icon, LucideIcon } from "lucide-react" 

interface ToolButtonProps {
  label: string
  icon: LucideIcon
  onClick: () => void
  isActive?: boolean
  isDisabled?: boolean
}


export const ToolButton: React.FC<ToolButtonProps> = ({icon: Icon, ...props}) => {
  return (
    <Hint label={props.label} side="right" sideOffset={14}>
      <Button disabled={props.isDisabled} onClick={props.onClick} size="icon" variant={props.isActive ? "boardActive" : "board"}>
        <Icon />
      </Button>
    </Hint>
  )
}