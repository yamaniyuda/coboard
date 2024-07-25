import { Room } from "@/components/room";
import { Canvas } from "./_components/canvas";
import { Loading } from "./_components/loading";
import { Metadata, Viewport } from "next";

interface BoardCardProps {
  params: {
    boardId: string;
  };
}

export const metadata: Metadata = {
  title: "White Board",
  description: "White Board",
};

export const viewport: Viewport = {
  initialScale: 1.0,
  maximumScale: 1.0,
  width: 'device-width',
  userScalable: false,
}

const BoardIdPage: React.FC<BoardCardProps> = ({ params }) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};

export default BoardIdPage;
