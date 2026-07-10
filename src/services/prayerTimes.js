const BATAM_LOCATION = {
  city: 'Batam',
  province: 'Kepulauan Riau',
  country: 'Indonesia',
  timezone: 'Asia/Jakarta',
};

const PRAYER_KEYS = [
  ['Subuh', 'Fajr'],
  ['Dzuhur', 'Dhuhr'],
  ['Ashar', 'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isya', 'Isha'],
];

// Fallback only: used when the public prayer-time API is unavailable.
const FALLBACK_PRAYER_TIMES = [
  { name: 'Subuh', time: '04:45' },
  { name: 'Dzuhur', time: '12:11' },
  { name: 'Ashar', time: '15:34' },
  { name: 'Maghrib', time: '18:15' },
  { name: 'Isya', time: '19:27' },
];

function getBatamDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BATAM_LOCATION.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function getApiDate(date = new Date()) {
  const { day, month, year } = getBatamDateParts(date);
  return `${day}-${month}-${year}`;
}

function normalizeTime(time) {
  const match = String(time).match(/\d{1,2}:\d{2}/);
  if (!match) {
    return '--:--';
  }

  return match[0].padStart(5, '0');
}

function withSource(times, source) {
  return times.map((time) => ({ ...time, source }));
}

function getFallbackPrayerTimes() {
  return withSource(FALLBACK_PRAYER_TIMES, 'fallback');
}

function buildPrayerTimes(timings) {
  return PRAYER_KEYS.map(([name, apiKey]) => ({
    name,
    time: normalizeTime(timings?.[apiKey]),
  }));
}

function createBatamDate(date, time, addDays = 0) {
  const { day, month, year } = getBatamDateParts(date);
  const [hours, minutes] = time.split(':').map(Number);

  return new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day) + addDays, hours - 7, minutes, 0),
  );
}

function formatRemaining(remainingMs) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export async function getTodayPrayerTimes() {
  const apiDate = getApiDate();
  const params = new URLSearchParams({
    city: BATAM_LOCATION.city,
    state: BATAM_LOCATION.province,
    country: BATAM_LOCATION.country,
    method: '20',
    school: '0',
    timezonestring: BATAM_LOCATION.timezone,
  });
  const url = `https://api.aladhan.com/v1/timingsByCity/${apiDate}?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Prayer API responded with ${response.status}`);
    }

    const payload = await response.json();
    const timings = payload?.data?.timings;

    if (!timings) {
      throw new Error('Prayer API response did not include timings');
    }

    return {
      location: BATAM_LOCATION,
      source: 'api',
      times: withSource(buildPrayerTimes(timings), 'api'),
    };
  } catch (error) {
    return {
      location: BATAM_LOCATION,
      source: 'fallback',
      error,
      times: getFallbackPrayerTimes(),
    };
  }
}

export function getNextPrayer(prayerTimes, currentDate = new Date()) {
  const usableTimes = Array.isArray(prayerTimes) ? prayerTimes : [];
  const nextPrayerToday = usableTimes.find((prayer) => {
    const prayerDate = createBatamDate(currentDate, prayer.time);
    return prayerDate.getTime() > currentDate.getTime();
  });

  const nextPrayer = nextPrayerToday ?? usableTimes[0];

  if (!nextPrayer) {
    return null;
  }

  const addDays = nextPrayerToday ? 0 : 1;
  const prayerDate = createBatamDate(currentDate, nextPrayer.time, addDays);
  const remainingMs = prayerDate.getTime() - currentDate.getTime();

  return {
    ...nextPrayer,
    date: prayerDate,
    remainingMs,
    countdown: formatRemaining(remainingMs),
  };
}
