import { Anyrun } from './anyrun.interface';

export interface AnyrunResult {
  hits: {
    total: number;
    hits: Array<{
      _id: string;
      _source: Anyrun;
    }>;
  };
}
