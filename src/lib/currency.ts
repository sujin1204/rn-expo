import config from '~/config';

const API_KEY = config.CURRENCY_API_KEY;

/**
 * 한국수출입은행 환율 정보 중
 * 달러, 유로 조회
 */
export const getEurUsdCurrency = async () => {
  const today = new Date();
  const day = today.getDay(); // 요일
  const currentTime = today.getHours();
  let month = (today.getMonth() + 1).toString();
  month = month.length < 2 ? '0' + month : month;
  let searchDate: string = `${today.getFullYear()}${month}${today.getDate()}`;

  // 주말인 경우 주말 전 금요일 날짜로 변경
  // day === 0 : 일요일
  // day === 6 : 토요일
  if (day === 0 || day === 6) {
    const lastWeekDay: Date = new Date(today.setDate(today.getDate() - (day === 0 ? 2 : 1)));
    searchDate = searchDate.substring(0, 6) + lastWeekDay.getDate();
  }
  // 현재 시간이 평일 오전 11시 이전이면
  // 전 날의 환율을 조회
  if (currentTime < 12 && day > 0 && day < 6) {
    const yesterDay = new Date(today.setDate(today.getDate() - 1));
    // 월요일(day 1) 오전 11시 이전이면 지난 금요일 환율 조회 필요
    const theDayBefore: Date = day > 1 ? yesterDay : new Date(today.setDate(today.getDate() - 3));
    searchDate = searchDate.substring(0, 6) + theDayBefore.getDate();
  }
  try {
    const result = await fetch(
      `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&data=AP01&searchdate=${searchDate}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    ).then((res) => res.json());
    const usdData = result.find((data: any) => data['cur_unit'] === 'USD');
    const euroData = result.find((data: any) => data['cur_unit'] === 'EUR');
    // deal_bas_r : 매매기준율
    // , 를 포함한 문자열에서 소수점 아래 한 자리만 남기고 잘라서 반환
    return {
      usd: usdData['deal_bas_r'].replace(/(?<=\.\d)\d+/g, ''),
      eur: euroData['deal_bas_r'].replace(/(?<=\.\d)\d+/g, ''),
    } as { usd: number; eur: number };
  } catch (error) {
    console.log(error);
  }
};
