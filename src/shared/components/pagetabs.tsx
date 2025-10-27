"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/tabs";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/shadcn/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface MyPageTabsProps {
  currentTab: string;
  tabs: TabItem[];
  imageClassName?: string;
  tabsClassName?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  layoutId?: string;
  onChange: (tab: string) => void;
}

export default function PageTabs({
  currentTab,
  tabs,
  imageClassName,
  tabsClassName,
  tabsListClassName,
  tabsTriggerClassName,
  layoutId = "tab-underline",
  onChange,
}: MyPageTabsProps) {
  return (
    <Tabs
      value={currentTab}
      onValueChange={onChange}
      className={cn("w-full border-b-[2px] border-gray-200", tabsClassName)}
    >
      <TabsList
        className={cn(
          "relative flex h-12 w-full rounded-none md:w-fit",
          tabsListClassName,
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative flex-1 cursor-pointer p-0 text-lg font-semibold text-gray-400 shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-green-600 data-[state=active]:shadow-none md:w-[159px] md:flex-none md:text-xl",
              tabsTriggerClassName,
            )}
          >
            {tab.imageUrl && (
              <div className={cn(imageClassName, "relative")}>
                <Image
                  src={tab.imageUrl}
                  alt={tab.imageAlt ?? `${tab.label} icon`}
                  fill
                />
              </div>
            )}
            {tab.label}
            {currentTab === tab.value && (
              <motion.div
                layoutId={layoutId}
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
