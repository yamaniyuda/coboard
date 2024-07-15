"use client";

import {
  DropdownMenuContent,
  DropdownMenuContentProps,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions: React.FC<ActionsProps> = (props) => {
  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${props.id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.preventDefault()}
          side={props.side}
          sideOffset={props.sideOffset}
          className="w-60 z-50 bg-white"
        >
          <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
            <Link2 className="h-4 w-4" />
            Copy bord link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
