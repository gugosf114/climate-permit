import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { BearSilhouette } from './Chrome';
import { Archetype } from '../data/archetypes';
import { Answers } from '../lib/store';
import { getVehicleImage } from '../lib/vehicleImages';

interface Props {
  archetype: Archetype;
  make: string;
  model: string;
  answers: Answers;
  compact?: boolean;
}

// Real CA Driver License palette
const DL = {
  paper:       '#f5efde',   // cream/pale card body
  paperLight:  '#fbf6e6',   // top band lighter
  paperEdge:   '#e7ddc0',   // soft edge / shadow
  border:      '#8a7a3a',   // outer card border
  caBlue:      '#0e2d63',   // "California" deep navy (matches real DL)
  caBlueSoft:  '#1e4385',   // softer navy for accents
  caBlueDeep:  '#081c44',   // even darker navy for emphasis
  ink:         '#0a0a0a',   // body text
  inkSoft:     '#2c2c2c',
  inkDim:      '#7a7a7a',   // field-number prefix (legacy)
  red:         '#b41d23',   // ID number red (DLN/EXP/DOB)
  redDeep:     '#7a1218',
  gold:        '#c78c19',   // bear / seal gold
  goldDeep:    '#8b6310',
  goldLight:   '#e8b32a',
  hologram:    '#dba519',
  divider:     'rgba(20,20,20,0.18)',
};

function permitNo(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  // CA format: 1 letter + 7 digits
  const num = String(Math.abs(hash) % 9000000 + 1000000).padStart(7, '0');
  const letter = String.fromCharCode(65 + (Math.abs(hash) % 26));
  return `${letter}${num}`;
}

function fmtDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()}`;
}

function todayStr(): string {
  return fmtDate(new Date());
}

function ddCode(seed: string): string {
  // CA DD field looks like: 00/00/0000NNNAN/ANFD/YY
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const a = String(Math.abs(h) % 100).padStart(2, '0');
  const b = String(Math.abs(h >> 4) % 100).padStart(2, '0');
  const c = String(Math.abs(h >> 8) % 10000).padStart(4, '0');
  const letters = 'NNNAN/ANFD/YY';
  return `${a}/${b}/${c}${letters}`;
}

function dobFromArchetype(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  const mm = String((Math.abs(h) % 12) + 1).padStart(2, '0');
  const dd = String((Math.abs(h >> 4) % 28) + 1).padStart(2, '0');
  const yy = 1957 + (Math.abs(h >> 8) % 38);
  return `${mm}/${dd}/${yy}`;
}

function archeFirstLast(name: string): [string, string] {
  const parts = name.split(' ');
  if (parts.length === 1) return ['OPERATOR', parts[0].toUpperCase()];
  return [parts.slice(0, -1).join(' ').toUpperCase(), parts[parts.length - 1].toUpperCase()];
}

function archeShortClass(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function fanLabel(fan: Answers['fanSpeed']): string {
  if (fan === 'auto') return 'AUT';
  if (fan === 0 || fan === undefined) return 'OFF';
  return String(fan);
}

function ventShort(v: Answers['ventDirection']): string {
  if (!v) return '—';
  return String(v).toUpperCase().slice(0, 3);
}

function modeShort(m: Answers['climateMode']): string {
  if (!m) return '—';
  return String(m).toUpperCase().slice(0, 3);
}

export function PermitCard({ archetype, make, model, answers, compact = false }: Props) {
  const scale = compact ? 0.72 : 1;
  const s = (n: number) => n * scale;

  const dln = permitNo(archetype.id + make + model);
  const exp = `12/31/2099`;
  const issue = todayStr();
  const dob = dobFromArchetype(archetype.id);
  const dd = ddCode(archetype.id + make);
  const [firstName, lastName] = archeFirstLast(archetype.name);
  const cls = archeShortClass(archetype.name);

  return (
    <View
      style={{
        backgroundColor: DL.paper,
        borderRadius: s(10),
        borderWidth: s(1.5),
        borderColor: DL.border,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* === BACKGROUND SECURITY PATTERN === */}
      {/* Watermark band — repeating DLN along the left edge */}
      <View pointerEvents="none" style={{
        position: 'absolute', top: 0, bottom: 0, left: s(8), width: s(14),
        justifyContent: 'space-between', paddingVertical: s(40),
      }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Text key={i} style={{
            fontFamily: 'monospace',
            fontSize: s(6.5),
            color: DL.goldDeep,
            opacity: 0.18,
            letterSpacing: s(0.5),
            transform: [{ rotate: '-90deg' }],
            width: s(80),
            marginLeft: s(-30),
            fontWeight: 'bold',
          }}>
            {dln}/{dln}/{dln}
          </Text>
        ))}
      </View>

      {/* Watermark band — bottom edge */}
      <View pointerEvents="none" style={{
        position: 'absolute', left: s(40), right: s(80), bottom: s(36),
        flexDirection: 'row', justifyContent: 'space-between',
      }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Text key={i} style={{
            fontFamily: 'monospace',
            fontSize: s(7),
            color: DL.goldDeep,
            opacity: 0.18,
            letterSpacing: s(0.5),
            fontWeight: 'bold',
          }}>
            {dln}
          </Text>
        ))}
      </View>

      {/* === Large faint bear silhouette watermark (center-back) === */}
      <View pointerEvents="none" style={{
        position: 'absolute',
        top: s(120), left: s(40), right: s(40),
        alignItems: 'center',
        opacity: 0.06,
      }}>
        <BearSilhouette size={s(240)} color={DL.caBlueDeep} />
      </View>

      {/* === TOP HEADER ROW === */}
      <View
        style={{
          paddingTop: s(8),
          paddingBottom: s(6),
          paddingLeft: s(28),
          paddingRight: s(10),
          borderBottomWidth: 1,
          borderBottomColor: DL.divider,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text
            style={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontSize: s(28),
              color: DL.caBlue,
              fontWeight: 'bold',
              lineHeight: s(30),
              letterSpacing: s(-0.5),
            }}
          >
            California
          </Text>
          <Text style={{
            fontFamily: 'monospace',
            fontSize: s(7),
            color: DL.ink,
            fontWeight: 'bold',
            letterSpacing: s(1),
            marginLeft: s(3),
            marginBottom: s(4),
          }}>
            USA
          </Text>
        </View>
        <Text style={{
          fontFamily: undefined,
          fontSize: s(14),
          color: DL.caBlue,
          fontWeight: 'bold',
          letterSpacing: s(1),
          marginBottom: s(2),
        }}>
          CLIMATE PERMIT
        </Text>
      </View>

      {/* === BEAR / SEAL CORNER === */}
      <View style={{
        position: 'absolute', top: s(36), right: s(10),
        alignItems: 'center',
      }}>
        <BearSilhouette size={s(46)} color={DL.gold} />
      </View>

      {/* === MAIN CONTENT === */}
      <View style={{ flexDirection: 'row', paddingTop: s(8), paddingHorizontal: s(28), paddingBottom: s(8), gap: s(10) }}>
        {/* Photo block */}
        <View style={{ width: s(96), alignItems: 'center' }}>
          <View style={{
            borderWidth: s(1),
            borderColor: DL.border,
            backgroundColor: DL.paperLight,
            padding: s(2),
            width: '100%',
            aspectRatio: 0.82,
            borderRadius: s(3),
          }}>
            <View style={{
              flex: 1,
              backgroundColor: DL.paper,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: s(2),
            }}>
              <Image
                source={getVehicleImage(make, model)}
                style={{ width: '95%', height: '85%' }}
                contentFit="contain"
              />
            </View>
          </View>
          {/* SAMPLE diagonal text on photo (CA DL specimen marker) */}
          <Text pointerEvents="none" style={{
            position: 'absolute',
            top: s(34), left: s(-6), right: 0,
            fontFamily: 'monospace',
            fontSize: s(10),
            color: DL.ink,
            opacity: 0.22,
            fontWeight: 'bold',
            letterSpacing: s(3),
            transform: [{ rotate: '-50deg' }],
            textAlign: 'center',
            width: s(108),
          }}>
            SAMPLE
          </Text>
          {/* SSC marker repeating */}
          <Text style={{
            position: 'absolute',
            bottom: s(2), left: -s(4), right: 0,
            fontFamily: 'monospace',
            fontSize: s(5.5),
            color: DL.goldDeep,
            opacity: 0.4,
            letterSpacing: 0,
            fontWeight: 'bold',
            textAlign: 'center',
            transform: [{ rotate: '0deg' }],
          }}>
            {dln.slice(-3)}/{dln.slice(-3)}/{dln.slice(-3)}
          </Text>
        </View>

        {/* Field block */}
        <View style={{ flex: 1, gap: s(2) }}>
          {/* Top row: DLN | EXP */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <NumField num="4d" label="DLN" value={dln} red large scale={s} />
            <NumField num="4b" label="EXP" value={exp} red scale={s} />
          </View>
          <NumField num="3" label="DOB" value={dob} red scale={s} />

          <View style={{ height: s(4) }} />

          <NumField num="1" label="LN" value={lastName} navy scale={s} />
          <NumField num="2" label="FN" value={firstName} bold scale={s} />
          <NumField num="8" label="" value={`${make.toUpperCase()} ${model.toUpperCase()}`} bold scale={s} />
          <NumField num="" label="" value={`SACRAMENTO, CA 95818`} scale={s} dim />

          <View style={{ height: s(2) }} />

          {/* Class + END (right-aligned columns) */}
          <View style={{ flexDirection: 'row', gap: s(20) }}>
            <NumField num="9" label="CLASS" value={cls} navy bold scale={s} />
            <NumField num="9a" label="END" value="NONE" scale={s} />
            <NumField num="12" label="REST" value="NONE" scale={s} />
          </View>

          <View style={{ height: s(2) }} />

          <NumField num="4a" label="ISS" value={issue} red scale={s} />
        </View>
      </View>

      {/* === BOTTOM STRIP: SEX/HGT/WGT/EYES/HAIR === */}
      <View
        style={{
          paddingHorizontal: s(28),
          paddingVertical: s(4),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          gap: s(14),
        }}
      >
        <NumField num="15" label="SEX" value="OPR" scale={s} small />
        <NumField num="18" label="EYES" value={ventShort(answers.ventDirection)} scale={s} small />
        <NumField num="16" label="HGT" value={answers.driverTemp ? `${answers.driverTemp}°F` : '—'} scale={s} small />
        <NumField num="19" label="HAIR" value={modeShort(answers.climateMode)} scale={s} small />
        <NumField num="17" label="WGT" value={`FAN ${fanLabel(answers.fanSpeed)}`} scale={s} small />
      </View>

      {/* === DD scan code line === */}
      <View style={{ paddingHorizontal: s(28), marginTop: s(2), marginBottom: s(4) }}>
        <NumField num="5" label="DD" value={dd} scale={s} small dim />
      </View>

      {/* === RESTRICTIONS / CLASSIFICATION === */}
      <View
        style={{
          marginHorizontal: s(28),
          marginTop: s(2),
          padding: s(8),
          borderTopWidth: s(1),
          borderTopColor: DL.divider,
          borderLeftWidth: s(3),
          borderLeftColor: DL.red,
          backgroundColor: 'rgba(255,250,230,0.5)',
        }}
      >
        <Text style={{
          fontFamily: 'monospace',
          fontSize: s(7),
          color: DL.caBlue,
          letterSpacing: s(1.5),
          fontWeight: 'bold',
          marginBottom: s(2),
        }}>
          12 RESTRICTIONS · CLASSIFICATION
        </Text>
        <Text style={{
          fontFamily: undefined,
          fontSize: s(13),
          color: DL.ink,
          fontWeight: 'bold',
          marginBottom: s(5),
          letterSpacing: s(0.5),
        }}>
          {archetype.name.toUpperCase()}
        </Text>
        <Text
          style={{
            fontFamily: undefined,
            fontSize: s(12),
            color: DL.ink,
            lineHeight: s(17),
            letterSpacing: s(0.1),
          }}
          numberOfLines={compact ? 4 : 10}
        >
          {archetype.permitText}
        </Text>
      </View>

      {/* === SIGNATURE === */}
      <View style={{ paddingHorizontal: s(28), paddingTop: s(6), paddingBottom: s(4) }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontSize: s(16),
              color: DL.ink,
              letterSpacing: s(-0.5),
              marginBottom: s(-3),
            }}>
              {firstName.charAt(0)}{firstName.slice(1).toLowerCase()} {lastName.toLowerCase()}
            </Text>
            <View style={{ height: 1, backgroundColor: DL.ink, opacity: 0.4 }} />
            <Text style={{
              fontFamily: 'monospace',
              fontSize: s(6),
              color: DL.inkDim,
              letterSpacing: s(0.8),
              marginTop: s(1),
            }}>
              OPERATOR SIGNATURE
            </Text>
          </View>
          {/* Ghost photo */}
          <View style={{
            width: s(38), height: s(46),
            borderWidth: s(0.5),
            borderColor: DL.border,
            backgroundColor: DL.paperLight,
            padding: s(2),
            marginLeft: s(10),
            opacity: 0.85,
          }}>
            <Image
              source={getVehicleImage(make, model)}
              style={{ width: '100%', height: '100%', opacity: 0.5 }}
              contentFit="contain"
            />
          </View>
        </View>
      </View>

      {/* === HOLOGRAPHIC FOOTER === */}
      <View
        style={{
          backgroundColor: DL.hologram,
          paddingVertical: s(4),
          paddingHorizontal: s(14),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopWidth: s(0.5),
          borderTopColor: DL.goldDeep,
        }}
      >
        <Text style={{
          fontFamily: 'monospace',
          fontSize: s(6),
          color: DL.paper,
          fontWeight: 'bold',
          letterSpacing: s(1.5),
        }}>
          CA · DCC · {dln}
        </Text>
        <Text style={{
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontSize: s(7),
          color: DL.paper,
        }}>
          Issued under penalty of comfort
        </Text>
        <Text style={{
          fontFamily: 'monospace',
          fontSize: s(6),
          color: DL.paper,
          fontWeight: 'bold',
          letterSpacing: s(1.5),
        }}>
          REV·04
        </Text>
      </View>
    </View>
  );
}

// ===== HELPERS =====

function NumField({
  num, label, value, red, navy, bold, large, small, dim, scale,
}: {
  num: string;
  label: string;
  value: string;
  red?: boolean;
  navy?: boolean;
  bold?: boolean;
  large?: boolean;
  small?: boolean;
  dim?: boolean;
  scale: (n: number) => number;
}) {
  const valSize = small ? scale(9) : large ? scale(13) : scale(10);
  const labelSize = small ? scale(6) : scale(7);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
      {num !== '' && (
        <Text style={{
          fontFamily: 'monospace',
          fontSize: labelSize,
          color: DL.caBlue,
          fontWeight: 'bold',
          marginRight: scale(2),
        }}>
          {num}
        </Text>
      )}
      {label !== '' && (
        <Text style={{
          fontFamily: 'monospace',
          fontSize: labelSize,
          color: DL.inkSoft,
          fontWeight: 'bold',
          letterSpacing: scale(0.5),
          marginRight: scale(4),
        }}>
          {label}
        </Text>
      )}
      <Text style={{
        fontFamily: undefined,
        fontSize: valSize,
        color: dim ? DL.inkDim : red ? DL.red : navy ? DL.caBlue : DL.ink,
        fontWeight: bold || large || red || navy ? 'bold' : '500',
        letterSpacing: scale(0.3),
      }}>
        {value}
      </Text>
    </View>
  );
}
