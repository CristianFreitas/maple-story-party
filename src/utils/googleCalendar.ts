export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateForGoogle(event.startTime)}/${formatDateForGoogle(event.endTime)}`,
  });

  if (event.description) {
    params.append('details', event.description);
  }

  if (event.location) {
    params.append('location', event.location);
  }

  return `${baseUrl}?${params.toString()}`;
}

function formatDateForGoogle(date: Date): string {
  // Google Calendar expects format: YYYYMMDDTHHMMSSZ
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function openGoogleCalendar(event: CalendarEvent): void {
  const url = generateGoogleCalendarUrl(event);
  window.open(url, '_blank', 'width=600,height=600');
}

// Helper to create buff schedule calendar event
export function createBuffScheduleEvent(schedule: {
  playerName: string;
  buffType: string;
  scheduledTime: Date;
  location: string;
  description?: string;
  server: string;
}): CalendarEvent {
  const startTime = new Date(schedule.scheduledTime);
  const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes duration

  const buffTypeNames = {
    exp: 'EXP Buff',
    drop: 'Drop Rate Buff',
    burning: 'Burning Field',
    other: 'Special Buff'
  };

  const title = `🍁 ${buffTypeNames[schedule.buffType as keyof typeof buffTypeNames] || 'Buff'} - ${schedule.playerName}`;
  
  const description = [
    `MapleStory Buff Schedule`,
    `Player: ${schedule.playerName}`,
    `Server: ${schedule.server}`,
    `Buff Type: ${buffTypeNames[schedule.buffType as keyof typeof buffTypeNames] || schedule.buffType}`,
    `Location: ${schedule.location}`,
    schedule.description ? `Notes: ${schedule.description}` : '',
    '',
    '🎮 Don\'t forget to be online and ready!',
    '⏰ Duration: 30 minutes',
    '',
    'Created by MapleStory Party Finder 🍁'
  ].filter(Boolean).join('\n');

  return {
    title,
    description,
    location: `${schedule.location} - ${schedule.server} Server`,
    startTime,
    endTime
  };
}
