export type BridgeRange = { bottom: number; top: number };

enum NBI_BRIDGE_FIELD {
  STRUCTURE_NUMBER_008 = "STRUCTURE_NUMBER_008",
  LOCATION_009 = "LOCATION_009",
  SUPERSTRUCTURE_COND_059 = "SUPERSTRUCTURE_COND_059",
  DECK_COND_058 = "DECK_COND_058",
  BRIDGE_CONDITION = "BRIDGE_CONDITION",
  YEAR_RECONSTRUCTED_106 = "YEAR_RECONSTRUCTED_106",
  YEAR_BUILT_027 = "YEAR_BUILT_027",
  STRUCTURE_KIND_043A = "STRUCTURE_KIND_043A",
  STRUCTURE_TYPE_043B = "STRUCTURE_TYPE_043B",
}

export type RawBridge = {
  YEAR_RECONSTRUCTED_106: number;
  YEAR_BUILT_027: number;
  STRUCTURE_NUMBER_008: string;
  LOCATION_009: string;
  SUPERSTRUCTURE_COND_059: number | string;
  DECK_COND_058: number | string;
  BRIDGE_CONDITION: string;
  /**
   * STRUCTURE KIND GUIDE
   *
   * (1) concrete
   * (2) concrete continuous
   * (3) steel
   * (4) steel continuous
   * (5) prestressed concrete
   * (6) prestressed concrete continuous
   * (7) wood or timber
   * (8) masonry
   * (9) aluminum, wrought iron, or cast iron
   * (0) other
   */
  STRUCTURE_KIND_043A: number;
  STRUCTURE_TYPE_043B: number;
};

export type BRIDGE_KEY_TYPE = Record<NBI_BRIDGE_FIELD, string>;

export const BRIDGE_KEY: BRIDGE_KEY_TYPE = {
  [NBI_BRIDGE_FIELD.YEAR_BUILT_027]: "yearBuilt",
  [NBI_BRIDGE_FIELD.YEAR_RECONSTRUCTED_106]: "yearReconstructed",
  [NBI_BRIDGE_FIELD.STRUCTURE_NUMBER_008]: "structureNumber",
  [NBI_BRIDGE_FIELD.STRUCTURE_KIND_043A]: "structureKind",
  [NBI_BRIDGE_FIELD.STRUCTURE_TYPE_043B]: "structureType",
  [NBI_BRIDGE_FIELD.LOCATION_009]: "location",
  [NBI_BRIDGE_FIELD.BRIDGE_CONDITION]: "bridgeCondition",
  [NBI_BRIDGE_FIELD.DECK_COND_058]: "deckCondition",
  [NBI_BRIDGE_FIELD.SUPERSTRUCTURE_COND_059]: "superstructureCondition",
};
