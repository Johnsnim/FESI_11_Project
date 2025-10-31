import { Heart } from "lucide-react";

interface RatingHeartsProps {
  score: number;
  size?: number;
}

export default function RatingHearts({ score, size = 20 }: RatingHeartsProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < score;
        return (
          <Heart
            key={i}
            size={size}
            className={`${
              isFilled
                ? "fill-green-500 text-green-500"
                : "fill-[#eeeeee] text-[#eeeeee]"
            }`}
          />
        );
      })}
    </div>
  );
}
