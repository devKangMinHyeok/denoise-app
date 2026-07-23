"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict, type Lang } from "../../lib/i18n";
import { localePath } from "../../lib/site";

const FEAT = '"calt","kern","liga","ss03"';

// 현재 경로에서 로케일 접두(/ko)를 떼어 언어 무관 경로를 만든다.
function stripLocale(pathname: string): string {
  if (pathname === "/ko" || pathname === "/ko/") return "/";
  if (pathname.startsWith("/ko/")) return pathname.slice(3); // "/ko/blog/" → "/blog/"
  return pathname || "/";
}

/**
 * EN / KO 세그먼트 토글. 현재 페이지의 반대 로케일 대응 URL로 이동한다.
 * (hreflang 과 짝을 이루는 사용자용 언어 전환.)
 */
export function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname() || "/";
  const t = getDict(lang);
  const base = stripLocale(pathname);

  const items: { code: Lang; label: string; href: string }[] = [
    { code: "en", label: "EN", href: localePath("en", base) },
    { code: "ko", label: "KO", href: localePath("ko", base) },
  ];

  return (
    <div
      role="group"
      aria-label={t.langSwitch.label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 2,
        borderRadius: "var(--rc-radius-md)",
        border: "1px solid var(--rc-hairline)",
      }}
    >
      {items.map((it) => {
        const current = it.code === lang;
        return (
          <Link
            key={it.code}
            href={it.href}
            aria-current={current ? "true" : undefined}
            hrefLang={it.code}
            style={{
              font: "600 12px/1 var(--rc-font-sans)",
              letterSpacing: ".3px",
              fontFeatureSettings: FEAT,
              padding: "5px 8px",
              borderRadius: "var(--rc-radius-sm)",
              textDecoration: "none",
              color: current ? "var(--rc-ink)" : "var(--rc-body)",
              background: current ? "#1a1b1c" : "transparent",
            }}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
