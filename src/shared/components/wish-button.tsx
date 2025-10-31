"use client";

import { Heart } from "lucide-react";

interface WishlistButtonProps {
  isWished: boolean;
  onClick: (e?: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    button: "h-10 w-10",
    icon: "h-5 w-5",
  },
  md: {
    button: "h-12 w-12",
    icon: "h-6 w-6",
  },
  lg: {
    button: "h-14 w-14",
    icon: "h-7 w-7",
  },
};

export default function WishButton({
  isWished,
  onClick,
  size = "md",
}: WishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isWished}
      aria-label={isWished ? "찜 취소" : "찜하기"}
      className={`flex cursor-pointer items-center justify-center rounded-full border-1 border-gray-100 transition-colors duration-200 hover:bg-gray-50 ${sizeClasses[size].button}`}
    >
      <Heart
        className={`${sizeClasses[size].icon} transition-colors duration-200 ${
          isWished
            ? "fill-green-500 text-green-500"
            : "fill-transparent text-gray-400"
        }`}
      />
    </button>
  );
}
