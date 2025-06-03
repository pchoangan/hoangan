export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <nav>Root Navigation</nav>
        {children}
      </body>
    </html>
  );
}
