import { Solar } from 'lunar-typescript';
import type { BirthProfile, KLinePoint, LifeDestinyResult } from '../types';

type ElementName = '木' | '火' | '土' | '金' | '水';

const ELEMENTS: ElementName[] = ['木', '火', '土', '金', '水'];

const STEM_ELEMENT: Record<string, ElementName> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

const BRANCH_ELEMENT: Record<string, ElementName> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

const ELEMENT_COPY: Record<ElementName, {
  traits: string;
  industries: string;
  direction: string;
  colors: string;
  health: string;
}> = {
  木: {
    traits: '重视成长与原则，行动中带有韧性，也愿意持续学习',
    industries: '教育、内容、设计、品牌、环保与长期型产品',
    direction: '东方、东南方',
    colors: '青色、绿色',
    health: '规律舒展与减少久坐有助于保持状态',
  },
  火: {
    traits: '表达直接、行动热情，善于带动气氛并快速推进事情',
    industries: '互联网、传媒、能源、餐饮、营销与公众表达',
    direction: '南方',
    colors: '红色、橙色',
    health: '稳定作息、控制熬夜和保持适量有氧运动更为重要',
  },
  土: {
    traits: '务实可靠，重视秩序与承诺，擅长把复杂事情落到实处',
    industries: '运营、地产、工程、供应链、咨询与组织管理',
    direction: '中部、西南方、东北方',
    colors: '米色、黄色、棕色',
    health: '规律饮食、适量步行和避免长期高压更有利于稳定状态',
  },
  金: {
    traits: '判断清晰、注重效率与边界，面对选择时通常较为果断',
    industries: '金融、法律、制造、数据、技术工具与质量管理',
    direction: '西方、西北方',
    colors: '白色、金色、银灰色',
    health: '关注呼吸环境、补水与肩颈放松会更有帮助',
  },
  水: {
    traits: '观察敏锐、适应力强，习惯先理解环境再选择行动方式',
    industries: '贸易、研究、物流、旅游、咨询与信息服务',
    direction: '北方',
    colors: '蓝色、黑色',
    health: '注意保暖、睡眠质量和劳逸节奏，有助于维持精力',
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.round(value)));

const elementOf = (char: string): ElementName | undefined =>
  STEM_ELEMENT[char] || BRANCH_ELEMENT[char];

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
};

const seededRange = (seed: string, min: number, max: number) =>
  min + (hashString(seed) % (max - min + 1));

const scoreToTen = (value: number) => clamp(value / 10, 3, 9);

const getElementCounts = (pillars: string[]) => {
  const counts: Record<ElementName, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.join('').split('').forEach((char) => {
    const element = elementOf(char);
    if (element) counts[element] += 1;
  });
  return counts;
};

const makeReason = (
  score: number,
  yearElement: ElementName,
  favorable: ElementName[],
  age: number,
) => {
  const stage = age < 18 ? '学习与家庭节奏' : age < 35 ? '成长与选择' : age < 55 ? '事业与资源' : age < 75 ? '生活与关系' : '身心与家庭';
  if (score >= 78) return `${yearElement}气相助，${stage}进入上扬期，宜主动把握机会。`;
  if (score >= 66) return `${stage}稳中有进，适合积累成果并推进重要计划。`;
  if (score >= 52) return `${stage}整体平稳，保持节奏比追求短期突破更重要。`;
  if (favorable.includes(yearElement)) return `${yearElement}气带来缓冲，虽有波动，调整策略后仍可逐步改善。`;
  if (score >= 40) return `${stage}容易反复，宜降低预期、留足余量并谨慎决策。`;
  return `${stage}处于调整期，先守住基本盘，避免冲动与过度消耗。`;
};

export const generateLocalDestiny = (profile: BirthProfile): LifeDestinyResult => {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const [hour, minute] = profile.birthTime.split(':').map(Number);

  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    throw new Error('请填写完整、有效的出生日期和时间');
  }

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  const pillars = [eightChar.getYear(), eightChar.getMonth(), eightChar.getDay(), eightChar.getTime()];
  const dayElement = elementOf(eightChar.getDayGan()) || '土';
  const supportElement = ELEMENTS[(ELEMENTS.indexOf(dayElement) + ELEMENTS.length - 1) % ELEMENTS.length];
  const outputElement = ELEMENTS[(ELEMENTS.indexOf(dayElement) + 1) % ELEMENTS.length];
  const favorable: ElementName[] = [dayElement, supportElement];
  const counts = getElementCounts(pillars);
  const dominant = ELEMENTS.reduce((best, item) => counts[item] > counts[best] ? item : best, ELEMENTS[0]);
  const lacking = ELEMENTS.reduce((best, item) => counts[item] < counts[best] ? item : best, ELEMENTS[0]);
  const genderNumber = profile.gender === 'Male' ? 1 : 0;
  const yun = eightChar.getYun(genderNumber, 2);
  const daYunList = yun.getDaYun(12);

  let previousClose = 52;
  const chartData: KLinePoint[] = Array.from({ length: 100 }, (_, index) => {
    const age = index + 1;
    const currentYear = year + index;
    const yearGanZhi = Solar.fromYmdHms(currentYear, 7, 1, 12, 0, 0)
      .getLunar()
      .getYearInGanZhiExact();
    const daYun = daYunList.find((item) =>
      item.getIndex() > 0 && age >= item.getStartAge() && age <= item.getEndAge());
    const daYunGanZhi = daYun?.getGanZhi() || '童限';
    const yearElement = elementOf(yearGanZhi.charAt(0)) || '土';

    const influence = `${yearGanZhi}${daYunGanZhi}`.split('').reduce((total, char) => {
      const element = elementOf(char);
      if (!element) return total;
      if (element === dayElement) return total + 4;
      if (element === supportElement) return total + 5;
      if (element === outputElement) return total + 1;
      return total - 3;
    }, 0);

    const cycleWave = Math.sin((age + hashString(pillars.join('')) % 9) * 0.48) * 8;
    const decadeWave = Math.cos((age + 3) * 0.17) * 5;
    const noise = seededRange(`${pillars.join('')}-${currentYear}`, -5, 5);
    const balancePenalty = counts[dominant] >= 4 && yearElement === dominant ? -4 : 0;
    const close = clamp(55 + influence + cycleWave + decadeWave + noise + balancePenalty, 24, 92);
    const open = age === 1
      ? clamp(close + seededRange(`${currentYear}-open`, -6, 6), 20, 94)
      : clamp(previousClose + seededRange(`${currentYear}-open`, -4, 4), 20, 94);
    const high = clamp(Math.max(open, close) + seededRange(`${currentYear}-high`, 3, 8), 25, 98);
    const low = clamp(Math.min(open, close) - seededRange(`${currentYear}-low`, 3, 8), 12, 90);
    previousClose = close;

    return {
      age,
      year: currentYear,
      ganZhi: yearGanZhi,
      daYun: daYunGanZhi,
      open,
      close,
      high,
      low,
      score: close,
      reason: makeReason(close, yearElement, favorable, age),
    };
  });

  const averageScore = chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length;
  const peak = chartData.reduce((best, item) => item.high > best.high ? item : best, chartData[0]);
  const lowPoint = chartData.reduce((best, item) => item.low < best.low ? item : best, chartData[0]);
  const balance = 10 - (Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)));
  const summaryScore = scoreToTen((averageScore + balance * 2) / 1.2);
  const dayCopy = ELEMENT_COPY[dayElement];
  const supportCopy = ELEMENT_COPY[supportElement];
  const namePrefix = profile.name.trim() ? `${profile.name.trim()}的` : '命盘的';

  return {
    chartData,
    analysis: {
      bazi: pillars,
      summary: `${namePrefix}日主为${eightChar.getDayGan()}${dayElement}，命盘中${dominant}的特征较明显，${lacking}相对偏少。整体走势呈周期性起伏，${peak.year}年前后为图中相对高点，${lowPoint.year}年前后宜更重视节奏与风险控制。此结果由固定历法与五行规则计算，仅作传统文化娱乐参考。`,
      summaryScore,
      personality: `${dayElement}日主通常${dayCopy.traits}。命盘中${dominant}偏旺，会放大相关做事风格；在重要决定前多引入${lacking}所代表的不同视角，有助于减少惯性判断。`,
      personalityScore: clamp(summaryScore + (balance >= 7 ? 1 : 0), 3, 9),
      industry: `从五行搭配看，更容易在需要${dayElement}的主动特质与${supportElement}的支持能力的环境中发挥。可重点关注${dayCopy.industries}，也可将${supportCopy.industries}作为互补方向。行业选择仍应以能力、兴趣和真实机会为准。`,
      industryScore: scoreToTen(averageScore + 5),
      fengShui: `传统五行取象中，${dayElement}与${supportElement}可作为日常环境的参考元素。方位可留意${dayCopy.direction}或${supportCopy.direction}，配色可选${dayCopy.colors}与${supportCopy.colors}。这些建议适合用于空间偏好，不应替代现实决策。`,
      fengShuiScore: clamp(6 + (counts[supportElement] > 0 ? 1 : 0), 3, 9),
      wealth: `财富走势更适合结合图中的周期变化理解：高分阶段适合推进长期计划，低分阶段则宜保留现金流和决策余量。你的命盘更适合通过持续积累、专业能力与分散风险来建立稳定性，不建议把单一年份预测作为投资依据。`,
      wealthScore: scoreToTen(averageScore),
      marriage: `关系中的优势来自${dayCopy.traits}；需要留意的是，${dominant}偏旺时可能更坚持自己的节奏。重要关系宜通过明确表达、稳定沟通与共同计划来经营，年份评分只用于提醒关注节奏，不代表具体事件必然发生。`,
      marriageScore: clamp(scoreToTen(averageScore) + (balance >= 6 ? 1 : 0), 3, 9),
      health: `${dayCopy.health}。在走势图较低的年份，可把它当作安排体检、休息和降低负荷的提醒。此处不构成医学判断，任何身体不适都应以正规医疗建议为准。`,
      healthScore: clamp(scoreToTen(averageScore) - (balance < 5 ? 1 : 0), 3, 9),
      family: `家庭与亲友关系更适合采用稳定、可预期的沟通方式。${supportElement}元素所象征的${supportCopy.traits}，可作为处理分歧时的互补思路。关系质量主要取决于现实互动，而非命盘评分。`,
      familyScore: clamp(6 + (balance >= 6 ? 1 : 0), 3, 9),
      crypto: `本地规则显示你的风险偏好更适合“先设边界、再参与机会”。走势图高位也不代表市场一定上涨，低位也不构成卖出信号；若参与高波动资产，应优先采用小仓位、分散配置和明确止损。`,
      cryptoScore: clamp(scoreToTen(averageScore) - 1, 3, 8),
      cryptoYear: `${peak.year}年 (${peak.ganZhi})`,
      cryptoStyle: dayElement === '火' || dayElement === '木' ? '趋势观察 / 分批参与' : '稳健配置 / 分散持有',
    },
  };
};
