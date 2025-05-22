import './globals.css';

import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

// 폰트 설정
const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard-Thin.woff2', weight: '100' },
    { path: '../public/fonts/Pretendard-ExtraLight.woff2', weight: '200' },
    { path: '../public/fonts/Pretendard-Light.woff2', weight: '300' },
    { path: '../public/fonts/Pretendard-Regular.woff2', weight: '400' },
    { path: '../public/fonts/Pretendard-Medium.woff2', weight: '500' },
    { path: '../public/fonts/Pretendard-SemiBold.woff2', weight: '600' },
    { path: '../public/fonts/Pretendard-Bold.woff2', weight: '700' },
    { path: '../public/fonts/Pretendard-ExtraBold.woff2', weight: '800' },
    { path: '../public/fonts/Pretendard-Black.woff2', weight: '900' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RoomToBe',
  description: '내 방이 될 공간을 쉽게 그리다 - 가구 배치 3D 시뮬레이션',
  icons: {
    icon: '/favicon_io/favicon.ico',
    shortcut: '/favicon_io/favicon-16x16.png',
    apple: '/favicon_io/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon_io/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/favicon_io/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/favicon_io/android-chrome-512x512.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className={pretendard.variable}>
      <body>{children}</body>
    </html>
  );
}
