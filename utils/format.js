import {i18n} from '@servicenow/aiux/aiux-services';

export const PHASES = [
  {id: 'detection', color: '#7c3aed'},
  {id: 'triage', color: '#f59e0b'},
  {id: 'misrouted', color: '#dc2626'},
  {id: 'waiting', color: '#64748b'},
  {id: 'fixing', color: '#0891b2'}
];

export const RECOVERY_COLOR = '#16a34a';

export function phaseLabel(phase) {
  switch (phase) {
    case 'detection':
      return i18n.getMessage('Detection');
    case 'triage':
      return i18n.getMessage('Triage');
    case 'misrouted':
      return i18n.getMessage('Misrouted');
    case 'waiting':
      return i18n.getMessage('Waiting');
    case 'fixing':
      return i18n.getMessage('Fixing');
    case 'recovery':
      return i18n.getMessage('Recovery');
    default:
      return '';
  }
}

export function phaseHint(phase) {
  switch (phase) {
    case 'detection':
      return i18n.getMessage('First alert until the incident was opened');
    case 'triage':
      return i18n.getMessage('Open but nobody assigned');
    case 'misrouted':
      return i18n.getMessage('Assigned to a group that did not resolve it');
    case 'waiting':
      return i18n.getMessage('On hold: caller, vendor, change or problem');
    case 'fixing':
      return i18n.getMessage('Worked by the resolving group');
    default:
      return '';
  }
}

export function phaseColor(phase) {
  if (phase === 'recovery') return RECOVERY_COLOR;
  return PHASES.find(info => info.id === phase)?.color || '#94a3b8';
}

export function formatMinutes(minutes) {
  if (minutes < 1) return '<1m';
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const rest = Math.round(minutes % 60);
  if (days) return `${days}d ${hours}h`;
  return hours ? `${hours}h ${rest}m` : `${rest}m`;
}

export function seconds(ms) {
  return ms ? `${(ms / 1000).toFixed(1)}s` : '';
}

// Server timestamps are UTC "yyyy-MM-dd HH:mm:ss"
export function parseUtc(value) {
  return value ? new Date(value.replace(' ', 'T') + 'Z') : null;
}

// Browser-only: the user's locale and time zone are not known while rendering on the server
export function formatTime(value) {
  const date = parseUtc(value);
  return date
    ? date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';
}

// Time since the impact started; independent of locale and time zone, so safe to render on the server
export function offsetLabel(value, origin) {
  const at = parseUtc(value);
  const start = parseUtc(origin);
  if (!at || !start) return '';
  const minutes = Math.round((at.getTime() - start.getTime()) / 60000);
  return minutes < 0
    ? `T-${formatMinutes(-minutes)}`
    : `T+${formatMinutes(minutes)}`;
}

export function priorityBadge(priority) {
  switch (priority) {
    case '1':
      return 'aiux-badge-error';
    case '2':
      return 'aiux-badge-warning';
    case '3':
      return 'aiux-badge-info';
    default:
      return 'aiux-badge-neutral';
  }
}
