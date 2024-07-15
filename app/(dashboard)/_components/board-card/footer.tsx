import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface FooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Footer: React.FC<FooterProps> = (props) => {
  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">
        {props.title}
      </p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {props.authorLabel}, {props.createdAtLabel}
      </p>
      <button
        disabled={props.disabled}
        onClick={props.onClick}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
          props.disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star
          className={cn(
            "h-4 w-4",
            props.isFavorite && "fill-blue-600 text-blue-600"
          )}
        />
      </button>
    </div>
  );
};
