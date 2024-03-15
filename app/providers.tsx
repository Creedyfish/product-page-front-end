"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useState, createContext, useEffect } from "react";
import { getCart } from "@/apiqueries/apiqueries";
type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
};
export const CartContext = createContext<any>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart();
        if (Array.isArray(cartData)) {
          setCart(cartData);
        } else {
          console.error("getCart did not return an array:", cartData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (item: CartItem) => {
    // Optimistically update the cart
    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        // If the item already exists, return a new array where the existing item's quantity is updated
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        );
      } else {
        // If the item doesn't exist, add the new item to the cart
        return [...prevCart, item];
      }
    });
  };

  const deleteFromCart = (itemId: number) => {
    const itemIdNumber = Number(itemId);

    setCart((prevCart) => {
      return prevCart.filter((cartItem) => cartItem.id !== itemIdNumber);
    });
  };

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <CartContext.Provider value={{ cart, addToCart, deleteFromCart }}>
          {children}
        </CartContext.Provider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
