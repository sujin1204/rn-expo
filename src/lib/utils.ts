/**
 * 일정시간 딜레이를 준다.
 * @param {number} ms - 딜레이시간(millisecond)
 * @return {Promise<void>}
 * @example
 * sleep(1000).then(() => ...);
 * await sleep(100);
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
