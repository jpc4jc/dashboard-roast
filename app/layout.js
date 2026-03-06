export const metadata = {
  title: "Dashboard Roast — Get Brutally Honest Feedback on Your Dashboard",
  description: "Upload a dashboard screenshot and get AI-powered design feedback based on data visualization best practices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0A0A0A" }}>
        {children}
      </body>
    </html>
  );
}
