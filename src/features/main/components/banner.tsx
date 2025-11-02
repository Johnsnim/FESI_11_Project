import Image from "next/image";

type BannerProps = {
  title: string;
  subtitle?: string;
};

export default function Banner({ title, subtitle }: BannerProps) {
  return (
    <div className="md relative min-h-[192px] w-full bg-[#9DEBCD] md:h-[200px] md:rounded-2xl md:bg-transparent lg:mb-2 lg:h-[240px]">
      <picture>
        <source srcSet="/image/banner_lg.svg" media="(min-width: 1280px)" />
        <source srcSet="/image/banner_md.svg" media="(min-width: 744px)" />
        <Image
          src="/image/banner_sm.svg"
          alt="같이달램 배너"
          fill
          sizes="100vw"
          priority
          quality={85}
          className="object-cover object-center md:rounded-3xl"
          fetchPriority="high"
        />
      </picture>

      {/* 텍스트 오버레이 */}
      <div className="absolute inset-0 ml-4 flex flex-col items-start justify-center gap-1 px-6 leading-7 tracking-[-0.03em] md:ml-10 lg:ml-14">
        {subtitle && (
          <p className="text-lg font-medium text-green-800">{subtitle}</p>
        )}
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}
