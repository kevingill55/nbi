import { RawBridge } from "../models";

export const findAdjacentPrestressedConcreteBridges = (data: RawBridge[]) => {
  const bridgeYearMap = new Map<number, RawBridge[]>();

  let minYear = 2023;
  let maxYear = 0;
  const bridges: RawBridge[] = [];
  data.forEach((bridge: RawBridge) => {
    if (
      (bridge.STRUCTURE_KIND_043A === 5 || bridge.STRUCTURE_KIND_043A === 6) &&
      (bridge.STRUCTURE_TYPE_043B === 1 || bridge.STRUCTURE_TYPE_043B === 5)
    ) {
      const lastTouchedYear =
        bridge.YEAR_RECONSTRUCTED_106 || bridge.YEAR_BUILT_027;

      const bridgesOfCurrentYear = bridgeYearMap.get(lastTouchedYear) || [];
      bridgesOfCurrentYear.push(bridge);
      bridgeYearMap.set(lastTouchedYear, bridgesOfCurrentYear);

      if (lastTouchedYear < minYear) minYear = lastTouchedYear;
      if (lastTouchedYear > maxYear) maxYear = lastTouchedYear;
      bridges.push(bridge);
    }
  });

  return { minYear, maxYear, bridges, bridgeYearMap };
};

export const convertBridgeMapToLengths = (
  minYear: number,
  maxYear: number,
  bridgeYearMap: Map<number, RawBridge[]>,
) => {
  const bridgeRangeMap = new Map<number, number>();
  for (let i = minYear; i <= maxYear; i++) {
    const currentCount = bridgeYearMap.get(i)?.length || 0;
    bridgeRangeMap.set(i, currentCount);
  }

  return bridgeRangeMap;
};

export const assignBridgesToSpread = (
  minYear: number,
  maxYear: number,
  spread: number,
  bridgeYearMap: Map<number, RawBridge[]>,
): Map<number, RawBridge[]> => {
  const bridgeRangeMap = new Map<number, RawBridge[]>();

  if (spread === 0) return bridgeRangeMap;
  if (spread === 1) return bridgeYearMap;

  let pointer = minYear;
  while (pointer <= maxYear) {
    if (pointer === maxYear) {
      bridgeRangeMap.set(pointer, bridgeYearMap.get(pointer) || []);
    }

    if (pointer < maxYear) {
      let bridges: RawBridge[] = [];
      let counter = pointer;
      while (counter <= pointer + spread - 1) {
        const currentBridges = bridgeYearMap.get(counter) || [];
        bridges = bridges.concat(currentBridges);
        counter++;
      }

      bridgeRangeMap.set(pointer, bridges);
    }
    pointer = pointer + spread;
  }

  return bridgeRangeMap;
};

export const getConditionValues = (bridges: RawBridge[]) => {
  let condition7 = 0;
  let condition6 = 0;
  let condition5 = 0;
  let condition4 = 0;
  let condition3 = 0;

  bridges.forEach((bridge) => {
    if (bridge.DECK_COND_058 >= 7 || bridge.SUPERSTRUCTURE_COND_059 >= 7) {
      condition7++;
    } else if (
      bridge.DECK_COND_058 >= 6 ||
      bridge.SUPERSTRUCTURE_COND_059 >= 6
    ) {
      condition6++;
    } else if (
      bridge.DECK_COND_058 >= 5 ||
      bridge.SUPERSTRUCTURE_COND_059 >= 5
    ) {
      condition5++;
    } else if (
      bridge.DECK_COND_058 >= 4 ||
      bridge.SUPERSTRUCTURE_COND_059 >= 4
    ) {
      condition4++;
    } else if (
      bridge.DECK_COND_058 <= 3 ||
      bridge.SUPERSTRUCTURE_COND_059 <= 3
    ) {
      condition3++;
    }
  });

  return {
    condition3,
    condition4,
    condition5,
    condition6,
    condition7,
  };
};

export const getChartData = (
  maxYear: number,
  spread: number,
  bridgeRangeMap: Map<number, RawBridge[]>,
) => {
  const rangeKeys = Array.from(bridgeRangeMap.keys());
  const labels: string[] = [];
  const values7: number[] = [];
  const values6: number[] = [];
  const values5: number[] = [];
  const values4: number[] = [];
  const values3: number[] = [];

  rangeKeys.forEach((key) => {
    if (spread === 1) {
      const currentBridges = bridgeRangeMap.get(key) || [];
      const { condition3, condition4, condition5, condition6, condition7 } =
        getConditionValues(currentBridges);
      values7.push(condition7);
      values6.push(condition6);
      values5.push(condition5);
      values4.push(condition4);
      values3.push(condition3);
      labels.push(key.toString());
    } else {
      const currentBridges = bridgeRangeMap.get(key) || [];
      const { condition3, condition4, condition5, condition6, condition7 } =
        getConditionValues(currentBridges);
      values7.push(condition7);
      values6.push(condition6);
      values5.push(condition5);
      values4.push(condition4);
      values3.push(condition3);
      const currentLabel =
        key + spread - 1 > maxYear
          ? `After ${key}`
          : `${key}-${key + spread - 1}`;

      labels.push(currentLabel);
    }
  });

  return { labels, values3, values4, values5, values6, values7 };
};
