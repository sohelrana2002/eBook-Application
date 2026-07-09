"use client";

import Image from "next/image";
import { Trash2, ShieldCheck, BookOpen } from "lucide-react";
import { useCart } from "@/hooks/useCart";
const defaultImage = "/book.jpg";

export default function CartPage() {
  const { state, removeFromCart, clearCart } = useCart();
  const { carts, totalQuantity, totalPrice } = state;

  const discount = 5;
  const total = totalPrice > 30 ? totalPrice - discount : 0;

  const handleRemoveFromCart = (bookId) => {
    if (window.confirm("Remove this book from your cart?")) {
      removeFromCart(bookId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">Shopping Cart</h1>
          <p className="mt-2 text-gray-500 text-[13px] md:text-lg">
            {totalQuantity} book{totalQuantity > 1 && "s"} in your cart
          </p>
        </div>

        <button
          className="cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* ================= CART ITEMS ================= */}
        <div className="space-y-5">
          {carts.map((book) => (
            <div
              key={book?._id}
              className="flex gap-5 rounded-xl border-[var(--border)] border-2 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-25 md:h-32 w-20 md:w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={book?.coverImage || defaultImage}
                  alt={book?.title || "Cart Image"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Book Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-[16px] md:text-xl font-semibold line-clamp-1 capitalize">
                    {book?.title}
                  </h2>

                  <p className="text-[10px] md:text-[16px] mt-[2px] md:mt-1 text-gray-500 capitalize">
                    by <span className="font-medium">{book?.author}</span>
                  </p>

                  <div className="mt-1 md:mt-3 flex flex-wrap gap-1 md:gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-[2px] md:py-1 text-[6px] md:text-xs font-semibold text-blue-700">
                      Digital Book
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-[2px] md:py-1 text-[6px] md:text-xs font-semibold text-green-700">
                      Qty: 1
                    </span>
                  </div>
                </div>

                <button
                  className="cursor-pointer mt-1 md:mt-5 flex w-fit items-center gap-1 md:gap-2 text-[8px] md:text-sm font-medium text-red-500 transition hover:text-red-700"
                  onClick={() => handleRemoveFromCart(book?._id)}
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>

              {/* Price */}
              <div className="flex items-start">
                <p className="text-lg md:text-2xl font-bold text-black">
                  ৳{book?.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="sticky top-24 h-fit rounded-xl border-[var(--border)] border-2 bg-white p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold">Order Summary</h2>

          <div className="mt-6 space-y-2 md:space-y-4">
            <div className="flex justify-between text-gray-600 text-[12px] md:text-lg">
              <span>Subtotal</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600 text-[12px] md:text-lg">
              <span>Discount</span>
              <span className="text-green-600">-৳{discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600 text-[12px] md:text-lg">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <hr className="text-[var(--black)]" />

            <div className="flex justify-between text-[14px] md:text-xl font-bold">
              <span>Total</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-4 md:mt-8 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 md:mb-4 font-semibold">Included</h3>

            <div className="space-y-2 md:space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-500" />
                <span>Instant PDF & EPUB Access</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-500" />
                <span>Secure Checkout</span>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-purple-500" />
                <span>Lifetime Library Access</span>
              </div>
            </div>
          </div>

          {/* Checkout */}
          <button className="cursor-pointer mt-5 md:mt-8 w-full rounded-lg bg-black py-3 text-md md:text-lg font-semibold text-white transition hover:bg-blue-700">
            Proceed to Checkout
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            Secure payment powered by Stripe / SSLCommerz
          </p>
        </div>
      </div>
    </section>
  );
}
