"use client";

import React from "react";
import { Badge } from "@/components/ui/badge"
import {FileText, ArrowDown, ArrowUp , Package, Users ,UserRound} from "lucide-react"; // for the percentage arrows


export const ProductEventMetrics = () => {
  return (
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      
      {/* 1. Total Products */}
      <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-950/30">
          <Package className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </span>
            <h4 className="mt-1 font-bold text-gray-900 text-title-sm dark:text-white">
              3,782
            </h4>
          </div>
          <Badge 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
          >
            <ArrowUp className="h-3.5 w-3.5 mr-1" />
            11.01%
          </Badge>
        </div>
      </div>

      {/* 2. Total Events */}
      <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-amber-50 rounded-xl dark:bg-amber-950/30">
          <Users className="text-amber-600 size-6 dark:text-amber-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Events
            </span>
            <h4 className="mt-1 font-bold text-gray-900 text-title-sm dark:text-white">
              5,359
            </h4>
          </div>
          <Badge 
            variant="outline" 
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
          >
            <ArrowDown className="h-3.5 w-3.5 mr-1" />
            9.05%
          </Badge>
        </div>
      </div>

      {/* 3. Total Contacts */}
      <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl dark:bg-emerald-950/30">
          <UserRound className="text-emerald-600 size-6 dark:text-emerald-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Contacts
            </span>
            <h4 className="mt-1 font-bold text-gray-900 text-title-sm dark:text-white">
              12,847
            </h4>
          </div>
          <Badge 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
          >
            <ArrowUp className="h-3.5 w-3.5 mr-1" />
            18.4%
          </Badge>
        </div>
      </div>

      {/* 4. Total Form Submissions */}
      <div className="rounded-2xl  border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6  hover:shadow transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl dark:bg-purple-950/30">
          <FileText className="text-purple-600 size-6 dark:text-purple-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Form Submissions
            </span>
            <h4 className="mt-1 font-bold text-gray-900 text-title-sm dark:text-white">
              2,194
            </h4>
          </div>
          <Badge 
            variant="outline" 
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
          >
            <ArrowUp className="h-3.5 w-3.5 mr-1" />
            4.2%
          </Badge>
        </div>
      </div>

    </div>
  );
};