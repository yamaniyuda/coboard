import { useQuery } from "convex/react";
import { EmptyBoards } from "./empty-boards";
import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-search";
import { api } from "@/convex/_generated/api";
import { BoardCard } from "./board-card";
import { NewBoardButton } from "./new-board-buutton";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}


const BoardList: React.FC<BoardListProps> = ({ orgId, query }) => {
  const data = useQuery(api.boards.get, { orgId, ...query });

  if (data === undefined)
    return (
      <div>
        <h1 className="text-3xl">
          {query.favorites ? "Favorite boards" : "Team boards"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-d:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8  pb-10">
          <NewBoardButton orgId={orgId} disabled />
          <BoardCard.Skeleton />``
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) return <EmptyFavorites />;

  if (!data?.length) return <EmptyBoards />;

  return (
    <div>
      <h1 className="text-3xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-d:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8  pb-10">
        <NewBoardButton orgId={orgId} />
        {data?.map((board: any) => (
          <BoardCard
            key={board._id}
            authorId={board.authorId}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export { BoardList };
