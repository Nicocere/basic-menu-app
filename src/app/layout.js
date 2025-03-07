import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Nav/NavBar";
import { AuthProvider } from "@/context/AuthUserContext";
import Footer from "@/components/Footer/Footer";
import { ThemeProvider } from "@/context/ThemeSwitchContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bar Menu App",
  description: "Aplicación de menú para un bar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <ThemeProvider>

        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AuthProvider>
            <NavBar />
            {children}
            <Footer />
          </AuthProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}