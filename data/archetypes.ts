export interface Archetype {
  id: string;
  name: string;
  quadrant: 'TYRANT' | 'OBLIVIOUS' | 'CONCIERGE' | 'DIPLOMAT';
  oneLineBurn: string;
  permitText: string;
  compatTraits: string[];
  xBias: 'self' | 'other';
  yBias: 'controller' | 'chill';
}

export const ARCHETYPES: Archetype[] = [
  // ── TYRANT family: SELF-FOCUSED + CONTROLLER ──────────────────
  {
    id: 'subarctic_tyrant',
    name: 'Subarctic Tyrant',
    quadrant: 'TYRANT',
    oneLineBurn: 'Sets it to 62°F, recirc on, fan max. Passenger requests denied.',
    permitText:
      'This operator maintains cabin temperature at or below 64°F regardless of passenger consensus, seasonal conditions, or basic human decency. Complaints are processed on a strict never-never basis. The blower operates at maximum capacity as a white-noise deterrent against further discussion. Passengers are advised to bring layers, a blanket, or a different ride.',
    compatTraits: ['responds to cold', 'has a visible shiver'],
    xBias: 'self',
    yBias: 'controller',
  },
  {
    id: 'tropical_tyrant',
    name: 'Tropical Tyrant',
    quadrant: 'TYRANT',
    oneLineBurn: 'Keeps it at 78°F with the heater on. Others sweat in silence.',
    permitText:
      'This operator considers 78°F the bare minimum for civilized travel and the heater a constitutional right. The cabin doubles as a controlled fermentation environment. All occupants are legally required to pretend this is normal. Windows stay up. Vents stay on face. This is not a negotiation — this is a climate.',
    compatTraits: ['sweat tolerance > 7/10', 'owns no winter clothing'],
    xBias: 'self',
    yBias: 'controller',
  },
  {
    id: 'recirc_loyalist',
    name: 'Recirc Loyalist',
    quadrant: 'TYRANT',
    oneLineBurn: 'Has not used fresh air mode since the Obama administration.',
    permitText:
      'This operator sealed the cabin atmosphere in 2013 and has not permitted external air to enter the vehicle since. The recirculation button is illuminated as a permanent fixture. The air inside this car has been breathed approximately 40,000 times. Passengers are advised to bring their own CO2 scrubber or remain silent about the stuffiness.',
    compatTraits: ['unbothered by stale air', 'does not open windows'],
    xBias: 'self',
    yBias: 'controller',
  },
  {
    id: 'fresh_air_fascist',
    name: 'Fresh Air Fascist',
    quadrant: 'TYRANT',
    oneLineBurn: "Window cracked at 75 mph in December. Everyone's hair is whipping. You don't care.",
    permitText:
      "This operator believes that fresh air is a moral imperative and highway wind resistance is merely character building. The window remains cracked in all weather conditions including winter, hail, and the express lane. Passengers' objections are treated as symptoms of weakness. Their hair does not concern this operator.",
    compatTraits: ['windproof hair', "doesn't feel cold"],
    xBias: 'self',
    yBias: 'controller',
  },

  // ── OBLIVIOUS family: SELF-FOCUSED + CHILL ─────────────────────
  {
    id: 'set_and_forget',
    name: 'Set-and-Forget',
    quadrant: 'OBLIVIOUS',
    oneLineBurn: '70°F AUTO since 2019. Genuinely confused why anyone is uncomfortable.',
    permitText:
      'This operator established a climate protocol in 2019 and has not revisited it since. The setting is 70°F, AUTO, fan 3. This is objectively fine. The operator is sincerely unable to process reports of discomfort and will respond with mild bewilderment. No adjustments will be made. The system is working.',
    compatTraits: ['agreeable', "doesn't notice temperature"],
    xBias: 'self',
    yBias: 'chill',
  },
  {
    id: 'defrost_forever',
    name: 'Defrost Forever',
    quadrant: 'OBLIVIOUS',
    oneLineBurn: "That button has been on since you bought the car. You don't know why.",
    permitText:
      'This operator has operated the vehicle in permanent defrost mode since the original purchase date. The reason has been lost to time. The front windshield is immaculate. The cabin is inexplicably warm on one side. Passengers ask about the button. The operator says "I think it just does that." It does not just do that.',
    compatTraits: ['accepts mystery', "doesn't press buttons twice"],
    xBias: 'self',
    yBias: 'chill',
  },
  {
    id: 'windows_down_purist',
    name: 'Windows-Down Purist',
    quadrant: 'OBLIVIOUS',
    oneLineBurn: "AC has never been used. \"It's a beautiful day.\" It is 97°F.",
    permitText:
      "This operator has never activated the air conditioning system. The vehicle contains one. The operator is aware of this. It is a beautiful day. It is always a beautiful day to this operator. Heat advisory warnings are interpreted as commentary for lesser people. The windows are down. Hair is flying. This is living.",
    compatTraits: ['heat-resistant', 'also refuses sunscreen'],
    xBias: 'self',
    yBias: 'chill',
  },
  {
    id: 'fan_on_3_lifer',
    name: 'Fan-On-3 Lifer',
    quadrant: 'OBLIVIOUS',
    oneLineBurn: 'Speed 3, vents at face, untouched. The dial has fused.',
    permitText:
      'This operator has identified Fan Speed 3 as the optimal and only setting. The dial has been at this position so long it may require professional removal. Vents point at the face. Always. The system requires no further input. If you ask to turn it up, a three is stared at. If you ask to turn it down, a three is stared at. It is three.',
    compatTraits: ["doesn't complain", 'also has a "usual order"'],
    xBias: 'self',
    yBias: 'chill',
  },

  // ── CONCIERGE family: OTHER-FOCUSED + CONTROLLER ───────────────
  {
    id: 'the_anticipator',
    name: 'The Anticipator',
    quadrant: 'CONCIERGE',
    oneLineBurn: 'Pre-cools the car 10 minutes before departure. Checks the forecast.',
    permitText:
      'This operator initiates vehicle pre-conditioning a minimum of 10 minutes prior to passenger boarding. Forecast data is reviewed each morning. Seat temperatures are staged. The cabin is ready before the passenger even knows they need a ride. This behavior is not considered excessive by this operator. It is considered the bare minimum.',
    compatTraits: ['appreciates punctuality', 'will not be early enough'],
    xBias: 'other',
    yBias: 'controller',
  },
  {
    id: 'the_adjuster',
    name: 'The Adjuster',
    quadrant: 'CONCIERGE',
    oneLineBurn: 'Tilts rear vents toward back-seat passengers before they sit down.',
    permitText:
      'This operator pre-positions rear vents in the direction of anticipated passenger seating before occupancy is established. Vent angle is calculated by seat assignment. All climate zones are configured per passenger. This operator has opinions about airflow distribution that they will not express but will silently act on at all times.',
    compatTraits: ['notices everything', 'will also adjust your armrest'],
    xBias: 'other',
    yBias: 'controller',
  },
  {
    id: 'the_negotiator',
    name: 'The Negotiator',
    quadrant: 'CONCIERGE',
    oneLineBurn: 'Asks "too cold?" within 30 seconds of every passenger entering.',
    permitText:
      "This operator requires verbal temperature confirmation from all passengers within 30 seconds of vehicle entry. Follow-up inquiries will be issued at 5-minute intervals or whenever the operator detects a micro-expression of discomfort. Passengers who say \"I'm fine\" will be asked again. This is concern, not surveillance. There is a difference.",
    compatTraits: ['tolerates check-ins', 'actually answers "are you okay?"'],
    xBias: 'other',
    yBias: 'controller',
  },
  {
    id: 'the_optimizer',
    name: 'The Optimizer',
    quadrant: 'CONCIERGE',
    oneLineBurn: 'Balances comfort and fuel efficiency. Has opinions about recirc.',
    permitText:
      'This operator manages cabin climate as a multi-variable optimization problem. Recirculation is engaged based on outdoor air quality index, not reflex. Fan speed tracks delta-T against target. Economy mode is not deprivation — it is discipline. Passengers are comfortable. The operator is also comfortable. The car is 12% more efficient. This is the way.',
    compatTraits: ["doesn't argue with logic", 'accepts a spreadsheet as a love language'],
    xBias: 'other',
    yBias: 'controller',
  },

  // ── DIPLOMAT family: OTHER-FOCUSED + CHILL ─────────────────────
  {
    id: 'trust_fall_diplomat',
    name: 'Trust-Fall Diplomat',
    quadrant: 'DIPLOMAT',
    oneLineBurn: '"Set your side to whatever you want." Has never touched another\'s zone.',
    permitText:
      "This operator views dual-zone climate control as a fundamental expression of human autonomy and has never touched the passenger zone. Passengers are invited — no, trusted — to configure their own thermal environment. The operator's zone is wherever the car defaults. This is not indifference. This is respect. Deep, unbothered respect.",
    compatTraits: ['independent temperature needs', "also won't pick the restaurant"],
    xBias: 'other',
    yBias: 'chill',
  },
  {
    id: 'default_citizen',
    name: 'Default Citizen',
    quadrant: 'DIPLOMAT',
    oneLineBurn: '72°F AUTO. Same setting every drive. Causes no problems. Solves none.',
    permitText:
      "This operator has identified 72°F, AUTO, as the societal center and has resided there without incident since obtaining their license. No temperature drama has ever originated from this vehicle. No passenger has ever been uncomfortable enough to mention it. Nothing memorable has happened in this cabin. This is a compliment.",
    compatTraits: ['has no strong opinions', "is everybody's second-best choice"],
    xBias: 'other',
    yBias: 'chill',
  },
  {
    id: 'window_buddy',
    name: 'Window Buddy',
    quadrant: 'DIPLOMAT',
    oneLineBurn: 'Cracks one window. Lets the weather decide. At peace.',
    permitText:
      "This operator cracks a single window and releases the climate outcome to the universe. The AC is off. The heater is off. The window is open exactly two inches. What happens, happens. This is not negligence — this is philosophy. Passengers find this either deeply relaxing or mildly concerning. Both reactions are valid. The window remains open.",
    compatTraits: ['goes with the flow', 'will also leave restaurant choice "up to you"'],
    xBias: 'other',
    yBias: 'chill',
  },
  {
    id: 'weather_vane',
    name: 'Weather Vane',
    quadrant: 'DIPLOMAT',
    oneLineBurn: 'Adjusts based purely on outside temp. No personal preference. A leaf in the wind.',
    permitText:
      'This operator has no personal climate preferences and does not pretend otherwise. Settings mirror outside conditions minus 2°F for cabin comfort. If it is 80°F outside, it is 78°F inside. If it is 40°F outside, the heater is at 42°F. This person has dissolved their preferences into data. They are at peace. They are also slightly alarming.',
    compatTraits: ['has strong opinions about everything else', 'just not this'],
    xBias: 'other',
    yBias: 'chill',
  },
];
