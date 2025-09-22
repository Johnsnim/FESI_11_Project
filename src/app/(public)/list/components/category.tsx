"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/tabs";
import Card from "@/shared/components/card";

export default function Category() {
  const [value, setValue] = React.useState("dal");
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});

  const recalc = React.useCallback(() => {
    const root = wrapRef.current;
    if (!root) return;
    const active = root.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) return;

    const parentRect = root.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    setIndicatorStyle({
      width: `${rect.width}px`,
      transform: `translateX(${rect.left - parentRect.left}px)`,
    });
  }, []);

  React.useEffect(() => {
    recalc();
  }, [value, recalc]);

  React.useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalc]);

  return (
    <Tabs value={value} onValueChange={setValue}>
      <div ref={wrapRef} className="relative w-full">
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] bg-transparent md:bg-gray-200" />

        <TabsList className="flex h-16 w-full gap-0 bg-transparent p-0 md:w-fit md:gap-6">
          <TabsTrigger
            value="dal"
            className="h-auto flex-1 cursor-pointer border-0 px-0 py-2 text-lg leading-6 font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:flex-none md:px-4"
          >
            <img src="/image/ic_mind_sm.svg" alt="dallem icon" />
            달램핏
          </TabsTrigger>

          <TabsTrigger
            value="wor"
            className="h-auto flex-1 cursor-pointer rounded-none border-0 px-0 py-2 text-lg leading-6 font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:flex-none md:px-4"
          >
            <img src="/image/ic_ parasol_sm.svg" alt="workcation icon" />
            워케이션
          </TabsTrigger>
        </TabsList>

        <span
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-green-600 transition-[width,transform] duration-300"
          style={indicatorStyle}
        />
      </div>

      <TabsContent value="dal" className="mt-4">
        <Card />
      </TabsContent>
      <TabsContent value="wor" className="mt-4">
        워케이션탭
      </TabsContent>
    </Tabs>
  );
}
