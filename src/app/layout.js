import { Inter } from "next/font/google";
import { Syne } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Nav/NavBar";
import { AuthProvider } from "@/context/AuthUserContext";
import Footer from "@/components/Footer/Footer";
import { ThemeProvider } from "@/context/ThemeSwitchContext";
import { CartProvider } from '@/context/CartContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weights: [300, 400, 500, 600],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weights: [500, 700],
});

export const metadata = {
  title: "Bar Menu App",
  description: "Aplicación de menú para un bar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <ThemeProvider>
        <body className={`${inter.variable} ${syne.variable}`}>
          <AuthProvider>
            <CartProvider>
            <NavBar />
            {/* <Header/> */}
            {children}
            <Footer />
            </CartProvider>
          </AuthProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}