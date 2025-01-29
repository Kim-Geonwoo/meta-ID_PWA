"use client";
// useRouter 사용을 위한, 클라이언트 컴포넌트로 전환

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const PageBar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/saved-id", icon: "ri-archive-2-line", label: "저장한 ID" },
    { href: "/meta-ids", icon: "ri-seo-line", label: "메타 IDs" },
    { href: "/", icon: "ri-add-circle-line", label: "홈 화면" },
    { href: "/analytics", icon: "ri-bar-chart-box-line", label: "명함 통계" },
    { href: "/about", icon: "ri-user-line", label: "나의 정보" },
  ];

  return (
    <nav className="bg-white dark:bg-black h-14 place-content-end">
      <ul className="flex justify-center">
        {navItems.map((item) => (
          <li key={item.href} className="flex flex-col items-center w-1/5">
            <Link href={item.href}>
              <button
                className={`${
                  pathname === item.href
                    ? "bg-gray-300 text-slate-700 dark:bg-gray-800 " // 현재 페이지의 경우
                    : "bg-white text-slate-500 hover:bg-gray-200"
                } w-14 flex-col items-center pt-2 pb-1 px-[0.4rem] inline-flex text-md font-medium rounded-xl border border-transparent focus:outline-none focus:bg-gray-200 disabled:opacity-50
                dark:bg-black dark:text-white dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:disabled:opacity-50`}
              >
                <i className={`${item.icon} text-slate-500 ri-lg`} />
                <p className="mt-0.5 text-[0.6rem]">{item.label}</p>
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
