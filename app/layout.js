import "./globals.css";
import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { SearchProvider } from "@/context/SearchContext";
import OverlayButton from "@/components/OverlayButton";
import GoogleTranslate from "@/components/GoogleTranslate";


export const metadata = {
  metadataBase: new URL("https://www.himalayanwellnessretreats.com/"),
  title: {
    default: "Experience the Soul of Himalayan Wellness in Rishikesh.   Our wellness retreat packages are thoughtfully designed to rejuvenate your body, mind, and spirit amidst the tranquil beauty of the Himalayas. Each retreat offers a holistic blend of daily yoga and meditation sessions led by experienced instructors",
    template: "%s | Himalayan Wellness Retreats",
  },
  description:
    "Experience the Soul of Himalayan Wellness in Rishikesh.   Our wellness retreat packages are thoughtfully designed to rejuvenate your body, mind, and spirit amidst the tranquil beauty of the Himalayas. Each retreat offers a holistic blend of daily yoga and meditation sessions led by experienced instructors",
  keywords:
    "himalayanwellnessretreats, rishikesh, Yoga, website, rishikesh yoga,meditation, Ayurveda, india, India",
  icons: { apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Himalayan Wellness Retreats - Yoga, Meditation, Ayurveda",
    description:
      "Experience the Soul of Himalayan Wellness in Rishikesh.   Our wellness retreat packages are thoughtfully designed to rejuvenate your body, mind, and spirit amidst the tranquil beauty of the Himalayas. Each retreat offers a holistic blend of daily yoga and meditation sessions led by experienced instructors",
    images: ["/logo.png"],
    url: "https://www.himalayanwellnessretreats.com/",
    site_name: "Himalayan Wellness Retreats",
  },
  twitter: {
    card: "summary_large_image",
    title: "Himalayan Wellness Retreats - Yoga, Meditation, Ayurveda",
    description:
      "Experience the Soul of Himalayan Wellness in Rishikesh.   Our wellness retreat packages are thoughtfully designed to rejuvenate your body, mind, and spirit amidst the tranquil beauty of the Himalayas. Each retreat offers a holistic blend of daily yoga and meditation sessions led by experienced instructors",
    images: ["/logo.png"],
  },
  other: {
    "author": "Himalayan Wellness Retreats",
    "robots": "index, follow",
    "viewport": "width=device-width, initial-scale=1",
  },
};

import { CartProvider } from "../context/CartContext";

export default function RootLayout({ children }) {
  const isPaid = process.env.NEXT_PUBLIC_IS_PAID === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-gilda`}>
        {isPaid ? (
          <CartProvider>
            <NextTopLoader color="#006eff" height={3} showSpinner={false} zIndex={1600} />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, style: { fontFamily: "var(--font-GildaDisplay)" } }} />
            <SessionWrapper>
              <SearchProvider>
                <Header />
                <GoogleTranslate />
                <main>
                  <OverlayButton />
                  {children}
                </main>
                <Footer />
              </SearchProvider>
            </SessionWrapper>
          </CartProvider>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-black text-center">
              Payment Pending. Please Contact Admin.
            </h1>
          </div>
        )}
      </body>
    </html>
  );
}
