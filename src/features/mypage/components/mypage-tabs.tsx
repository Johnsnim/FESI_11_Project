"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/tabs";
import { motion } from "framer-motion";

export interface TabItem {
  value: string;
  label: string;
}

interface MyPageTabsProps {
  currentTab: string;
  tabs: TabItem[];
  onChange: (tab: string) => void;
}

export default function MyPageTabs({
  currentTab,
  tabs,
  onChange,
}: MyPageTabsProps) {
  return (
    <Tabs
      value={currentTab}
      onValueChange={onChange}
      className="w-full border-b-[2px] border-gray-200"
    >
      <TabsList className="relative flex h-12 w-full rounded-none md:w-fit">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative flex-1 cursor-pointer p-0 text-lg font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:w-[159px] md:flex-none md:text-xl"
          >
            {tab.label}
            {currentTab === tab.value && (
              <motion.div
                layoutId="underline"
                className="absolute right-0 bottom-[-6px] left-0 h-[2px] bg-green-600"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
