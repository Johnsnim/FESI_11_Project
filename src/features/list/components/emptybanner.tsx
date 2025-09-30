export default function EmptyBanner() {
  return (
    <div className="flex w-full flex-col items-center justify-center pt-25">
      <img src="/image/img_empty.svg" alt="empty image" />

      <p className="text-center text-lg font-semibold text-gray-400">
        아직 모임이 없어요 <br /> 지금 바로 모임을 만들어보세요!
      </p>
    </div>
  );
}
