import { Answers } from './store';
import { ARCHETYPES, Archetype } from '../data/archetypes';

interface Traits {
  x: number;
  y: number;
  coldTrait: boolean;
  warmTrait: boolean;
  recircOn: boolean;
  defrostVent: boolean;
  autoMode: boolean;
  acOff: boolean;
  rearVentsOpen: boolean;
  precoolYes: boolean;
}

function scoreAnswers(answers: Answers): Traits {
  let x = 0;
  let y = 0;
  let coldTrait = false;
  let warmTrait = false;
  let recircOn = false;
  let defrostVent = false;
  let autoMode = false;
  let acOff = false;
  let rearVentsOpen = false;
  let precoolYes = false;

  if (answers.driverTemp !== undefined) {
    if (answers.driverTemp <= 67) coldTrait = true;
    if (answers.driverTemp >= 75) warmTrait = true;
  }

  if (answers.driverTemp !== undefined && typeof answers.passengerTemp === 'number') {
    if (Math.abs(answers.driverTemp - answers.passengerTemp) > 5) x -= 3;
  }

  if (answers.fanSpeed === 'auto') {
    y += 3;
  } else if (typeof answers.fanSpeed === 'number' && answers.fanSpeed >= 6) {
    y -= 2;
  }

  if (answers.ventDirection === 'face') x -= 2;
  if (answers.ventDirection === 'defrost') defrostVent = true;

  if (answers.recirc === 'on') { x -= 2; recircOn = true; }
  else if (answers.recirc === 'off') x += 1;
  else if (answers.recirc === 'auto') y += 2;

  if (answers.acCompressor === 'off') { y += 3; acOff = true; }
  else if (answers.acCompressor === 'on') y -= 2;

  if (answers.climateMode === 'auto') { y += 5; autoMode = true; }
  else if (answers.climateMode === 'manual') y -= 5;

  if (answers.rearVents === 'open') { x += 5; rearVentsOpen = true; }
  else if (answers.rearVents === 'what') x -= 5;

  if (answers.heatedSeats === 'always') x -= 1;

  if (answers.preCool === 'yes') { x += 4; precoolYes = true; }

  return { x, y, coldTrait, warmTrait, recircOn, defrostVent, autoMode, acOff, rearVentsOpen, precoolYes };
}

export function pickArchetype(answers: Answers): { archetype: Archetype; x: number; y: number } {
  const t = scoreAnswers(answers);

  let id: string;

  if (t.x <= 0 && t.y <= 0) {
    // TYRANT
    if (t.coldTrait && t.recircOn) id = 'subarctic_tyrant';
    else if (t.warmTrait) id = 'tropical_tyrant';
    else if (t.recircOn) id = 'recirc_loyalist';
    else id = 'fresh_air_fascist';
  } else if (t.x <= 0 && t.y > 0) {
    // OBLIVIOUS
    if (t.autoMode) id = 'set_and_forget';
    else if (t.defrostVent) id = 'defrost_forever';
    else if (t.acOff) id = 'windows_down_purist';
    else id = 'fan_on_3_lifer';
  } else if (t.x > 0 && t.y <= 0) {
    // CONCIERGE
    if (t.precoolYes) id = 'the_anticipator';
    else if (t.rearVentsOpen) id = 'the_adjuster';
    else if (t.x >= 5) id = 'the_negotiator';
    else id = 'the_optimizer';
  } else {
    // DIPLOMAT
    if (t.autoMode && t.x > 2) id = 'trust_fall_diplomat';
    else if (t.autoMode) id = 'default_citizen';
    else if (t.acOff) id = 'window_buddy';
    else id = 'weather_vane';
  }

  const archetype = ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[13];
  return { archetype, x: t.x, y: t.y };
}
