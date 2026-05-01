export const CART_STORAGE_KEY = "sizzle_cart";
export const CART_CHANGED_EVENT = "sizzle-cart-changed";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type RawCartItem = {
  id?: unknown;
  name?: unknown;
  price?: unknown;
  image?: unknown;
  quantity?: unknown;
};

function parseCart(raw: string | null): CartItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item: RawCartItem) => {
        if (
          typeof item?.id !== "string" ||
          typeof item?.name !== "string" ||
          typeof item?.price !== "number" ||
          typeof item?.image !== "string" ||
          typeof item?.quantity !== "number"
        ) {
          return null;
        }

        return {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: Math.max(1, Math.floor(item.quantity)),
        };
      })
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseCart(window.localStorage.getItem(CART_STORAGE_KEY));
}

export function addToCart(next: Omit<CartItem, "quantity"> & { quantity: number }) {
  const items = getCartItems();
  const existing = items.find((item) => item.id === next.id);

  if (existing) {
    existing.quantity += Math.max(1, Math.floor(next.quantity));
    saveCart(items);
    return;
  }

  items.push({
    ...next,
    quantity: Math.max(1, Math.floor(next.quantity)),
  });

  saveCart(items);
}

export function setItemQuantity(id: string, quantity: number) {
  const items = getCartItems();
  const nextQuantity = Math.floor(quantity);

  if (nextQuantity <= 0) {
    saveCart(items.filter((item) => item.id !== id));
    return;
  }

  const target = items.find((item) => item.id === id);
  if (!target) {
    return;
  }

  target.quantity = nextQuantity;
  saveCart(items);
}

export function removeFromCart(id: string) {
  const items = getCartItems().filter((item) => item.id !== id);
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
