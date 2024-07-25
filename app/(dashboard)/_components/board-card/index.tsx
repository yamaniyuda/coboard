"use client";

import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;

  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
}

export const BoardCard = (props: BoardCardProps) => {
  const { userId } = useAuth();
  const authorLabel = userId === props.authorId ? "You" : props.authorName;
  const createAtLabel = formatDistanceToNow(props.createdAt, {
    addSuffix: true,
  });

  const handleFavorite = useMutation(api.board.favorite)
  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.board.favorite)
  const { mutate: onUnFavorite, pending: PendingUnFavorite } = useApiMutation(api.board.unfavorite)


  const handeFavorite = useMutation(api.board.favorite)
  const handleUnfavorite = useMutation(api.board.unfavorite)


  const toggleFavorite = () => {
    if (props.isFavorite) handleUnfavorite({ id: props.id as Id<"boards"> }).catch(() => toast.error("Failed to  unfavorite"))
    else handeFavorite({ id: props.id as Id<"boards">, orgId: props.orgId  }).catch(() => toast.error("Failed to  favorite"))
  }


  return (
    <Link href={`/board/${props.id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image
            src={props.imageUrl}
            alt="Doodle"
            fill
            className="object-fill"
          />
          <Overlay />
          <Actions id={props.id} title={props.title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          isFavorite={props.isFavorite}
          title={props.title}
          authorLabel={authorLabel}
          createdAtLabel={createAtLabel}
          disabled={pendingFavorite || PendingUnFavorite}
          onClick={toggleFavorite}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="group aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
