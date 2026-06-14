import { readJson, writeJson, cleanText } from './jsonDb';

export const saarcCountries = ['Afghanistan', 'Bangladesh', 'Bhutan', 'India', 'Maldives', 'Nepal', 'Pakistan', 'Sri Lanka'];

export const defaultSafariTravelPricesUsd = {
  'Full-Day Yala Safari': 120,
  'Half-Day Morning Safari': 70,
  'Half-Day Evening Safari': 70,
  '5-12 Yala Safari': 90,
};

export const defaultPricingSettings = {
  exchangeRateLkr: 305,
  jeepCapacity: 6,
  generalAdultTicketUsd: 50,
  generalChildTicketUsd: 25,
  saarcAdultTicketUsd: 30,
  saarcChildTicketUsd: 15,
  localAdultTicketUsd: 15,
  localChildTicketUsd: 8,
  safariPriceMode: 'perJeep',
  safariTravelPricesUsd: defaultSafariTravelPricesUsd,
  serviceFeeUsd: 0,
  showLkrTotal: true,
  calculatorNote: 'Final park ticket rates can change by authority notice. We confirm the final amount on WhatsApp before payment.',
};

function numberValue(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
}

function cleanSafariTravelPrices(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  return Object.fromEntries(
    Object.entries(defaultSafariTravelPricesUsd).map(([title, fallback]) => [title, numberValue(source[title], fallback)])
  );
}

export async function getPricingSettings() {
  const raw = await readJson('pricingSettings', defaultPricingSettings);
  return { ...defaultPricingSettings, ...(raw || {}) };
}

export async function savePricingSettings(nextSettings = {}) {
  const current = await getPricingSettings();
  const merged = { ...current, ...nextSettings };
  const cleaned = {
    exchangeRateLkr: numberValue(merged.exchangeRateLkr, defaultPricingSettings.exchangeRateLkr),
    jeepCapacity: Math.max(1, Math.round(numberValue(merged.jeepCapacity, defaultPricingSettings.jeepCapacity))),
    generalAdultTicketUsd: numberValue(merged.generalAdultTicketUsd, defaultPricingSettings.generalAdultTicketUsd),
    generalChildTicketUsd: numberValue(merged.generalChildTicketUsd, defaultPricingSettings.generalChildTicketUsd),
    saarcAdultTicketUsd: numberValue(merged.saarcAdultTicketUsd, defaultPricingSettings.saarcAdultTicketUsd),
    saarcChildTicketUsd: numberValue(merged.saarcChildTicketUsd, defaultPricingSettings.saarcChildTicketUsd),
    localAdultTicketUsd: numberValue(merged.localAdultTicketUsd, defaultPricingSettings.localAdultTicketUsd),
    localChildTicketUsd: numberValue(merged.localChildTicketUsd, defaultPricingSettings.localChildTicketUsd),
    safariPriceMode: cleanText(merged.safariPriceMode) === 'perBooking' ? 'perBooking' : 'perJeep',
    safariTravelPricesUsd: cleanSafariTravelPrices(merged.safariTravelPricesUsd),
    serviceFeeUsd: numberValue(merged.serviceFeeUsd, defaultPricingSettings.serviceFeeUsd),
    showLkrTotal: Boolean(merged.showLkrTotal),
    calculatorNote: cleanText(merged.calculatorNote, defaultPricingSettings.calculatorNote),
  };
  await writeJson('pricingSettings', cleaned);
  return cleaned;
}
