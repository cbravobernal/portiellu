import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Rural en Cangas de Onís | Reserva Directa",
  description:
    "Casa rural en Cangas de Onís, Asturias. Consulta disponibilidad y envía tu solicitud de reserva desde el formulario.",
  metadataBase: new URL("https://elportiellu.com"),
  openGraph: {
    title: "Casa Rural en Cangas de Onís",
    description:
      "Escapada rural en Asturias con reserva directa por formulario.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
