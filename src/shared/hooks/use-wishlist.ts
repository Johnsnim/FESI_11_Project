import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type WishMap = Record<string, number[]>;

function hasId(u: unknown): u is { id: string | number } {
  if (typeof u !== "object" || u === null) return false;
  if (!("id" in u)) return false;
  const id = (u as Record<string, unknown>).id;
  return typeof id === "string" || typeof id === "number";
}

export function useWishlist(gatheringId: number) {
  const router = useRouter();
  const { data: session } = useSession();

  const rawUser: unknown = session?.user;
  const userId = hasId(rawUser) ? String(rawUser.id) : "";

  const [isWished, setIsWished] = useState(false);

  // localStorage에서 찜 상태 불러오기
  useEffect(() => {
    if (!userId) {
      setIsWished(false);
      return;
    }
    try {
      const raw = localStorage.getItem("wishlist");
      const map: WishMap = raw ? JSON.parse(raw) : {};
      setIsWished(!!map[userId]?.includes(gatheringId));
    } catch {
      setIsWished(false);
    }
  }, [userId, gatheringId]);

  // 찜 토글 함수
  const toggleWish = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      if (!userId) {
        alert("로그인이 필요한 서비스입니다");
        router.push("/login");
        return;
      }

      try {
        const raw = localStorage.getItem("wishlist");
        const map: WishMap = raw ? JSON.parse(raw) : {};
        const set = new Set<number>(map[userId] ?? []);

        if (set.has(gatheringId)) {
          set.delete(gatheringId);
          setIsWished(false);
        } else {
          set.add(gatheringId);
          setIsWished(true);
        }

        map[userId] = Array.from(set);
        localStorage.setItem("wishlist", JSON.stringify(map));
      } catch (error) {
        return error;
      }
    },
    [userId, gatheringId, router],
  );

  return {
    isWished,
    toggleWish,
  };
}
