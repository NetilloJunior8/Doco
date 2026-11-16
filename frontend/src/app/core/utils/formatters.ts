import { GarmentCondition, StyleEra } from '../models/catalog.models';

const MXN_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0
});

export function formatMxn(amount: number | null | undefined): string {
  if (amount == null) return '';
  return MXN_FORMATTER.format(amount) + ' MXN';
}

const CONDITION_LABELS: Record<GarmentCondition, string> = {
  DEADSTOCK: 'DEADSTOCK // NUEVO',
  MINT_9_10: 'MINT 9/10',
  VINTAGE_8_10: 'VINTAGE 8/10',
  DISTRESSED: 'FADE & DISTRESSED'
};

export function formatCondition(condition: GarmentCondition): string {
  return CONDITION_LABELS[condition] ?? condition;
}

const ERA_LABELS: Record<StyleEra, string> = {
  VINTAGE: 'VINTAGE',
  STREETWEAR: 'STREETWEAR',
  Y2K: 'Y2K',
  WORKWEAR: 'WORKWEAR',
  ARCHIVE: 'ARCHIVE'
};

export function formatEra(era: StyleEra): string {
  return ERA_LABELS[era] ?? era;
}
