import { create } from 'zustand';
import { DashboardStyle } from '../data/cars';

export interface Answers {
  driverTemp?: number;
  passengerTemp?: number | 'same';
  fanSpeed?: number | 'auto';
  ventDirection?: 'face' | 'feet' | 'defrost' | 'mix';
  recirc?: 'on' | 'off' | 'auto';
  acCompressor?: 'on' | 'off' | 'auto';
  climateMode?: 'auto' | 'manual';
  rearVents?: 'open' | 'closed' | 'what';
  heatedSeats?: 'always' | 'sometimes' | 'never';
  preCool?: 'yes' | 'sometimes' | 'never';
}

interface ClimateStore {
  make: string;
  model: string;
  hasDualZone: boolean;
  hasRearVents: boolean;
  dashboardStyle: DashboardStyle;
  answers: Answers;
  archetypeId: string | null;
  xScore: number;
  yScore: number;
  compatPayload: string | null;
  setVehicle: (make: string, model: string, hasDualZone: boolean, hasRearVents: boolean, style: DashboardStyle) => void;
  setAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  setResult: (archetypeId: string, x: number, y: number) => void;
  setCompatPayload: (payload: string | null) => void;
  reset: () => void;
}

const initial = {
  make: 'Generic',
  model: 'Not Listed',
  hasDualZone: false,
  hasRearVents: false,
  dashboardStyle: 'sedan' as DashboardStyle,
  answers: {} as Answers,
  archetypeId: null,
  xScore: 0,
  yScore: 0,
  compatPayload: null,
};

export const useClimateStore = create<ClimateStore>((set) => ({
  ...initial,
  setVehicle: (make, model, hasDualZone, hasRearVents, dashboardStyle) =>
    set({ make, model, hasDualZone, hasRearVents, dashboardStyle }),
  setAnswer: (key, value) =>
    set((s) => ({ answers: { ...s.answers, [key]: value } })),
  setResult: (archetypeId, xScore, yScore) =>
    set({ archetypeId, xScore, yScore }),
  setCompatPayload: (compatPayload) => set({ compatPayload }),
  reset: () => set(initial),
}));
