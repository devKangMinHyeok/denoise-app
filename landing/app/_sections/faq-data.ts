// FAQ 문항 타입. 실제 문항 데이터는 로케일별 사전(lib/i18n/en.ts 의 faq.items)에 있고,
// FAQ UI(Faq.tsx)와 FAQPage JSON-LD(schema.faqPageSchema)가 그 사전을 참조한다.
export interface FaqItem {
  q: string;
  a: string;
}
