import "./globals.css";

export const metadata = {
  title: "Driving the Energy Highway — Stamp Tour",
  description: "LS ELECTRIC Event Stamp Tour"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
