import guaIndexData from "@/lib/data/gua-index.json";
import guaListData from "@/lib/data/gua-list.json";

// 6 老阴、7 少阳、8 少阴、9 老阳，自下而上排列
export type Yao = 6 | 7 | 8 | 9;

const guaDict1 = ["坤", "震", "坎", "兑", "艮", "离", "巽", "乾"];
const guaDict2 = ["地", "雷", "水", "泽", "山", "火", "风", "天"];

const lineYang = ["初九", "九二", "九三", "九四", "九五", "上九"];
const lineYin = ["初六", "六二", "六三", "六四", "六五", "上六"];

export function toYao(yang: boolean, change: boolean): Yao {
  return yang ? (change ? 9 : 7) : change ? 6 : 8;
}

export function isYang(yao: Yao) {
  return yao === 7 || yao === 9;
}

export function isChange(yao: Yao) {
  return yao === 6 || yao === 9;
}

export function lineName(index: number, yang: boolean) {
  return yang ? lineYang[index] : lineYin[index];
}

// 卦的结果： 第X卦 X卦 XX卦 X上X下
// 计算卦的索引，111对应乾卦，000对应坤卦，索引转为10进制。
export function getGua(yangList: boolean[]) {
  const upIndex =
    (yangList[5] ? 4 : 0) + (yangList[4] ? 2 : 0) + (yangList[3] ? 1 : 0);
  const downIndex =
    (yangList[2] ? 4 : 0) + (yangList[1] ? 2 : 0) + (yangList[0] ? 1 : 0);

  const guaIndex = guaIndexData[upIndex][downIndex] - 1;
  const guaName1 = guaListData[guaIndex];

  let guaName2;
  if (upIndex === downIndex) {
    // 上下卦相同，格式为X为X
    guaName2 = guaDict1[upIndex] + "为" + guaDict2[upIndex];
  } else {
    guaName2 = guaDict2[upIndex] + guaDict2[downIndex] + guaName1;
  }

  const guaDesc = guaDict1[upIndex] + "上" + guaDict1[downIndex] + "下";

  return {
    // 例：26.山天大畜
    guaMark: `${(guaIndex + 1).toString().padStart(2, "0")}.${guaName2}`,
    guaTitle: `周易第${guaIndex + 1}卦`,
    // 例：大畜卦(山天大畜)_艮上乾下
    guaResult: `${guaName1}卦(${guaName2})_${guaDesc}`,
  };
}
