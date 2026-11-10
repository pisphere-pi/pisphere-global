import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="hi" className="dark">
      <Head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <script src="https://cdn.tailwindcss.com" />
        <script src="https://sdk.minepi.com/pi-sdk.js" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #090614;
            color: #f3f4f6;
            overflow-x: hidden;
          }
          .glass-card {
            background: rgba(24, 18, 43, 0.84);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(168, 85, 247, 0.24);
          }
          /* Soft Warm Gold Button with Deep Dark Black Text */
          .soft-gold-btn {
            background: linear-gradient(135deg, #e5c467 0%, #d4ac42 100%);
            color: #090612 !important;
            font-weight: 800;
            border: 1px solid rgba(255, 238, 180, 0.35);
          }
          .soft-gold-btn:hover {
            background: linear-gradient(135deg, #ebd07e 0%, #ddb752 100%);
          }
          @keyframes ticker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-ticker {
            display: inline-block;
            white-space: nowrap;
            animation: ticker 22s linear infinite;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
Displaying 1000467041.png. 
