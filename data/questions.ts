// Question metadata — UI logic lives in app/dashboard.tsx
// This file defines types for external reference / future extensibility

export type QuestionId =
  | 'driverTemp'
  | 'passengerTemp'
  | 'fanSpeed'
  | 'ventDirection'
  | 'recirc'
  | 'acCompressor'
  | 'climateMode'
  | 'rearVents'
  | 'heatedSeats'
  | 'preCool';

export interface QuestionMeta {
  id: QuestionId;
  label: string;
  requiresDualZone?: boolean;
}

export const QUESTION_META: QuestionMeta[] = [
  { id: 'driverTemp', label: 'Driver Temp' },
  { id: 'passengerTemp', label: 'Passenger Temp', requiresDualZone: true },
  { id: 'fanSpeed', label: 'Fan Speed' },
  { id: 'ventDirection', label: 'Vent Direction' },
  { id: 'recirc', label: 'Recirculation' },
  { id: 'acCompressor', label: 'A/C Compressor' },
  { id: 'climateMode', label: 'Climate Mode' },
  { id: 'rearVents', label: 'Rear Vents' },
  { id: 'heatedSeats', label: 'Heated / Cooled Seats' },
  { id: 'preCool', label: 'Pre-Cool Before Drive' },
];
