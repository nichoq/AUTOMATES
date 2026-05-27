export interface DFAConfig {
  n: number;
  START: number;
  ACC: Set<number>;
  T: Array<Record<string | number, number>>;
  alpha: string[];
  dead: Set<number>;
  DESC: string[];
  labels: string[]; // State labels shown in diagram nodes
  pos: Array<[number, number]>;
  W: number;
  H: number;
  R: number;
}

export interface StateTrace {
  cur: number;
  str: string;
  path: number[];
  stepIdx: number;
  done: boolean;
}
