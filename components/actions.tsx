"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions: React.FC<ActionsProps> = (props) => {
  const { mutate, pending } = useApiMutation(api.board.remove);
  const { onOpen } = useRenameModal()

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${props.id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const onDelte = () => {
    mutate({ id: props.id })
      .then(() => toast.success("Board deleted"))
      .catch(() => toast.error("Failed to delete board"));
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          side={props.side}
          sideOffset={props.sideOffset}
          className="w-60 z-50 bg-white shadow-lg"
        >
          <DropdownMenuItem
            className="p-3 cursor-pointer flex items-center"
            onClick={onCopyLink}
          >
            <Link2 className="h-4 w-4 mr-2" />
            Copy bord link
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-3 cursor-pointer flex items-center"
            onClick={() => onOpen(props.id, props.title)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <ConfirmModal
            header="Delete board?"
            description="This will delete the bboard and all of its conetents"
            disabled={pending}
            onConfirm={onDelte}
          >
            <Button
              variant="ghost"
              className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </ConfirmModal>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
