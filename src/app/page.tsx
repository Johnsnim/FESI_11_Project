import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-100 flex size-full flex-col items-center justify-center">
      <p className="font-tenada pt-4 text-5xl font-extrabold text-green-800">
        반갑습니다
      </p>
      <p className="font-sans text-6xl font-bold text-blue-400">세준님</p>
      <p className="text-6xl font-bold text-green-500">다연님</p>
    </div>
  );
}
