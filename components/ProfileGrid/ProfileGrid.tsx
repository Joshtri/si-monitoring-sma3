"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "../common/PageContainer";

export default function ProfileGrid() {
  return (
    <>
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Profile Cards */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Profile Card 1</h2>
            <p className="text-gray-600 dark:text-gray-400">Details about profile 1.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Profile Card 2</h2>
            <p className="text-gray-600 dark:text-gray-400">Details about profile 2.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Profile Card 3</h2>
            <p className="text-gray-600 dark:text-gray-400">Details about profile 3.</p>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
