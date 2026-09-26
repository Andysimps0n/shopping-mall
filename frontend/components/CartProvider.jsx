"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchCurrentUser } from "@/lib/auth";
import {
  addAccountCartItem,
  fetchAccountCart,
  mergeAccountCart,
  removeAccountCartItem,
  setAccountCartQuantity,
} from "@/lib/cartApi";
import {
  CART_STORAGE_KEY,
  addItem as addItemToCart,
  addPricedItem,
  getItemCount,
  normalizeCartItems,
  removeItem as removeItemFromCart,
  repriceCart,
  setQuantity as setItemQuantity,
} from "@/lib/cart";
import { getProductById } from "@/lib/products";
import CartToast from "./CartToast";

const CartContext = createContext(null);

/** How long the add-to-cart toast stays visible (ms). */
const TOAST_DURATION_MS = 3200;

function readLocalCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return normalizeCartItems(parsed);
  } catch {
    return [];
  }
}

function writeLocalCart(items) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota or private mode — the cart still works for this session.
  }
}

function itemsFromAccountCart(cart) {
  return (cart?.items ?? []).map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}

/**
 * Guest cart lives in localStorage (productId + quantity only).
 * After login, each line becomes the larger of the guest quantity and the account quantity.
 * A retried merge does not add the same units again. localStorage is cleared after success.
 * We only clear localStorage after the merge request succeeds, so a failed request
 * cannot throw the shopper's items away.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [accountCart, setAccountCart] = useState(null);
  const [mode, setMode] = useState("guest");
  const [user, setUser] = useState(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const requestSeq = useRef(0);
  // Quantity clicks share one queue so an older save cannot finish last and
  // overwrite a newer quantity in the database.
  const writes = useRef(Promise.resolve());

  const rememberAccountCart = useCallback((cart) => {
    setAccountCart(cart);
    setItems(itemsFromAccountCart(cart));
    setMode("account");
  }, []);

  const syncCart = useCallback(async () => {
    const localItems = readLocalCart();
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      setMode("guest");
      setAccountCart(null);
      setItems(localItems);
      return;
    }

    const merged = await mergeAccountCart(localItems);
    if (!merged) {
      // Keep the guest copy. Checkout will ask the shopper to retry.
      setMode("guest");
      setAccountCart(null);
      setItems(localItems);
      return;
    }

    writeLocalCart([]);
    rememberAccountCart(merged);
  }, [rememberAccountCart]);

  useEffect(() => {
    let ignore = false;

    syncCart().finally(() => {
      if (!ignore) setHasHydrated(true);
    });

    function onAuthChanged() {
      syncCart();
    }

    window.addEventListener("annchloe-auth-changed", onAuthChanged);
    return () => {
      ignore = true;
      window.removeEventListener("annchloe-auth-changed", onAuthChanged);
    };
  }, [syncCart]);

  // Guest carts are the only ones written to localStorage.
  // An account cart must not be copied back, or the next login would add it twice.
  useEffect(() => {
    if (!hasHydrated) return;
    if (mode !== "guest") {
      writeLocalCart([]);
      return;
    }
    writeLocalCart(items);
  }, [items, hasHydrated, mode]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((productName) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ id: Date.now(), productName });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  const applyAccountChange = useCallback(
    (task) => {
      const seq = requestSeq.current + 1;
      requestSeq.current = seq;

      const run = writes.current.then(async () => {
        const cart = await task();
        if (seq !== requestSeq.current) return null;

        if (cart) {
          rememberAccountCart(cart);
          return cart;
        }

        // The save did not stick. Put the screen back to whatever the database has.
        const fresh = await fetchAccountCart();
        if (seq !== requestSeq.current || !fresh) return null;
        rememberAccountCart(fresh);
        return null;
      });

      writes.current = run.then(
        () => undefined,
        () => undefined,
      );
      return run;
    },
    [rememberAccountCart],
  );

  const flushCartWrites = useCallback(() => writes.current, []);

  // Name save should not re-merge the cart. Only swap the session user.
  const setCurrentUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const addItem = useCallback(
    (productId, details) => {
      const product = getProductById(productId);
      const name = details?.name || product?.name;

      if (mode === "account") {
        // Toast and the header count update now. The POST still saves the line.
        setAccountCart((current) =>
          addPricedItem(current, productId, {
            name,
            unitPrice: details?.unitPrice,
            imageUrl: details?.imageUrl,
          }),
        );
        setItems((current) => addItemToCart(current, productId));
        showToast(name ?? null);
        applyAccountChange(() => addAccountCartItem(productId));
        return;
      }

      setItems((current) => addItemToCart(current, productId));
      showToast(name ?? null);
    },
    [applyAccountChange, mode, showToast],
  );

  const setQuantity = useCallback(
    (productId, quantity) => {
      if (mode === "account") {
        // Paint the new quantity from the unit price already on screen.
        // The PATCH still runs, but the button does not wait for it.
        setAccountCart((current) => repriceCart(current, productId, quantity));
        setItems((current) => setItemQuantity(current, productId, quantity));
        applyAccountChange(() => setAccountCartQuantity(productId, quantity));
        return;
      }
      setItems((current) => setItemQuantity(current, productId, quantity));
    },
    [applyAccountChange, mode],
  );

  const removeItem = useCallback(
    (productId) => {
      if (mode === "account") {
        setAccountCart((current) => repriceCart(current, productId, 0));
        setItems((current) => removeItemFromCart(current, productId));
        applyAccountChange(() => removeAccountCartItem(productId));
        return;
      }
      setItems((current) => removeItemFromCart(current, productId));
    },
    [applyAccountChange, mode],
  );

  const value = useMemo(
    () => ({
      items,
      accountCart,
      mode,
      user,
      itemCount: getItemCount(items),
      hasHydrated,
      toast,
      addItem,
      setQuantity,
      removeItem,
      dismissToast,
      reloadCart: syncCart,
      flushCartWrites,
      setCurrentUser,
    }),
    [
      items,
      accountCart,
      mode,
      user,
      hasHydrated,
      toast,
      addItem,
      setQuantity,
      removeItem,
      dismissToast,
      syncCart,
      flushCartWrites,
      setCurrentUser,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartToast />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
