// public/ 정적 에셋 경로 헬퍼. 배포가 루트 서빙(basePath 없음)이라 지금은 경로를
// 그대로(선행 슬래시 보장) 돌려준다. 호출부 하위호환을 위해 함수는 유지한다.
// 일반 <img>/<a>/CSS url() 에 쓴다. next/link 는 라우트 경로를 그대로 주면 된다.
export function asset(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
