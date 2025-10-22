import Image from "next/image";

type BannerProps = {
  title: string;
  subtitle?: string;
};

export default function Banner({ title, subtitle }: BannerProps) {
  return (
    <div className="relative w-full bg-[#9DEBCD] md:bg-transparent">
      <picture>
        <source srcSet="/image/banner_lg.svg" media="(min-width: 1280px)" />

        <source srcSet="/image/banner_md.svg" media="(min-width: 375px)" />
        <Image
          src="/image/banner_sm.svg"
          alt="banner"
          width={0}
          height={0}
          unoptimized
          sizes="100vw"
          className="min-h-[192px] w-full object-cover object-center md:h-auto"
        />
      </picture>

      <div className="absolute inset-0 ml-4 flex flex-col items-start justify-center gap-1 px-6 leading-7 tracking-[-0.03em] md:ml-10 lg:ml-14">
        {subtitle && (
          <p className="text-lg font-medium text-green-800">{subtitle}</p>
        )}
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}
