"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProfileShell from "./ProfileShell";
import { profileCopy } from "@/lib/auth";
import { faqCategories, filterFaqs } from "@/lib/support";

export default function SupportFaqPage() {
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const items = useMemo(
    () => filterFaqs(categoryId, query),
    [categoryId, query],
  );

  return (
    <ProfileShell title="FAQ" backHref="/profile">
      <label className="faq-search">
        <span className="visually-hidden">질문 검색</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="무엇을 도와드릴까요?"
        />
      </label>

      <div className="faq-tabs" role="tablist" aria-label="FAQ 분류">
        {faqCategories.map((tab) => {
          const selected = tab.id === categoryId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "faq-tab is-selected" : "faq-tab"}
              onClick={() => setCategoryId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="faq-list">
        {items.length === 0 ? (
          <p className="login-lead">맞는 질문을 찾지 못했습니다.</p>
        ) : (
          items.map((item) => (
            <details key={item.id} className="faq-item">
              <summary>
                <span>
                  <span className="faq-item-category">
                    {faqCategories.find((tab) => tab.id === item.category)?.label}
                  </span>
                  <span className="faq-item-question">{item.question}</span>
                </span>
                <span className="faq-item-chevron" aria-hidden="true" />
              </summary>
              <p className="faq-item-answer">{item.answer}</p>
            </details>
          ))
        )}
      </div>

      <Link href="/profile/inquiry" className="button faq-inquiry-cta">
        {profileCopy.inquiry}
      </Link>
    </ProfileShell>
  );
}
