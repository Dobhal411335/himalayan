// components/CurrentYear.js
"use client";
export default function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}