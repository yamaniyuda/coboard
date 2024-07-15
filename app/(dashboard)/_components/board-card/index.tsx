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
          disabled={false}
          onClick={() => {}}
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
