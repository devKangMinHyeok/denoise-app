// Korean copy dictionary.
//
// 표준 지침: 임의 기계번역은 하지 않는다. 한국어 마케팅 카피는 디자인 핸드오프로
// 채운다(맥 앱 i18n과 동일한 방식). 채우기 전까지는 영어(en)로 폴백한다.
//
// 번역이 도착하면 아래 `en`을 실제 한국어 객체(en과 같은 구조, Dict 타입)로 교체한다.
// 부분 번역도 가능: en을 펼친 뒤 번역된 키만 덮어쓰면 나머지는 영어로 남는다.
import { en, type Dict } from "./en";

export const ko: Dict = en;
