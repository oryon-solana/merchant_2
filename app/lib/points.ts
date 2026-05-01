export const POINTS_STORAGE_KEY = "sizzle_points";
export const REDEEMED_STORAGE_KEY = "sizzle_redeemed_deals";
export const POINTS_CHANGED_EVENT = "sizzle-points-changed";

export const DEFAULT_POINTS = 1840;

export type RedeemedDeal = {
  id: string;
  expiresAt: string;
};

function emitPointsChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(POINTS_CHANGED_EVENT));
}

function parseNumber(value: string | null): number {
  if (value === null) {
    return DEFAULT_POINTS;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_POINTS;
  }

  return Math.max(0, Math.floor(parsed));
}

function parseRedeemed(raw: string | null): RedeemedDeal[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => {
        if (
          typeof entry !== "object" ||
          entry === null ||
          typeof (entry as RedeemedDeal).id !== "string" ||
          typeof (entry as RedeemedDeal).expiresAt !== "string"
        ) {
          return null;
        }

        return {
          id: (entry as RedeemedDeal).id,
          expiresAt: (entry as RedeemedDeal).expiresAt,
        };
      })
      .filter((entry): entry is RedeemedDeal => entry !== null);
  } catch {
    return [];
  }
}

function savePoints(points: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(POINTS_STORAGE_KEY, String(Math.max(0, Math.floor(points))));
  emitPointsChanged();
}

function saveRedeemedDeals(deals: RedeemedDeal[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(REDEEMED_STORAGE_KEY, JSON.stringify(deals));
  emitPointsChanged();
}

export function getCurrentPoints(): number {
  if (typeof window === "undefined") {
    return DEFAULT_POINTS;
  }

  const points = parseNumber(window.localStorage.getItem(POINTS_STORAGE_KEY));

  if (window.localStorage.getItem(POINTS_STORAGE_KEY) === null) {
    window.localStorage.setItem(POINTS_STORAGE_KEY, String(points));
  }

  return points;
}

export function getRedeemedDeals(): RedeemedDeal[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseRedeemed(window.localStorage.getItem(REDEEMED_STORAGE_KEY));
}

export function hasRedeemedDeal(dealId: string): boolean {
  return getRedeemedDeals().some((deal) => deal.id === dealId);
}

export function redeemDeal(dealId: string, cost: number, expiresAt: string): {
  ok: boolean;
  reason?: "already_redeemed" | "not_enough_points";
} {
  const current = getCurrentPoints();
  const pointsCost = Math.max(0, Math.floor(cost));

  if (hasRedeemedDeal(dealId)) {
    return { ok: false, reason: "already_redeemed" };
  }

  if (current < pointsCost) {
    return { ok: false, reason: "not_enough_points" };
  }

  savePoints(current - pointsCost);

  const redeemed = getRedeemedDeals();
  redeemed.push({ id: dealId, expiresAt });
  saveRedeemedDeals(redeemed);

  return { ok: true };
}
