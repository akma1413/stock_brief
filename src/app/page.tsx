'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [count, setCount] = useState(12400);

    // Auto-advance logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentScreen((prev) => (prev + 1) % 3);
        }, 1500);
        return () => clearInterval(timer);
    }, [currentScreen]);

    // Dynamic Counter Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => prev + Math.floor(Math.random() * 3));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const goToScreen = (index: number) => {
        setCurrentScreen(index);
    };

    const handleTap = () => {
        setCurrentScreen((prev) => (prev + 1) % 3);
    };

    const handleLogin = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent screen switch when clicking login
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div
            onClick={handleTap}
            className="min-h-[100dvh] bg-white text-gray-900 font-sans flex flex-col items-center justify-between p-6 relative overflow-hidden selection:bg-gray-100 cursor-pointer"
        >
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-100 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-green-100 rounded-full blur-[80px]" />
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 w-full flex flex-col justify-center max-w-md mx-auto h-[60vh]">

                {/* Screen 0: Intro Problem */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-in-out ${currentScreen === 0 ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 -translate-x-8 blur-sm pointer-events-none'
                        }`}
                >
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-3 h-3 bg-gray-900 rounded-full shadow-sm" />
                        <span className="text-xl font-bold tracking-tight text-gray-900">Stock Brief</span>
                    </div>

                    <h1 className="text-2xl font-bold leading-relaxed mb-6 text-gray-900 break-keep">
                        내 주식 왜 떨어졌는지 보려고<br />
                        커뮤니티 갔다가<br />
                        <span className="text-blue-600 relative inline-block">
                            뻘글만 보고 왔다면?
                            <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-100 -z-10 translate-y-1"></span>
                        </span>
                    </h1>
                </div>

                {/* Screen 1: Solution & Value */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${currentScreen === 1 ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 translate-x-8 blur-sm pointer-events-none'
                        } ${currentScreen !== 1 && 'pointer-events-none'}`}
                >
                    <h1 className="text-2xl font-bold leading-relaxed mb-8 text-center text-gray-900 break-keep">
                        내 <span className="text-red-600 relative inline-block">관심종목<span className="absolute bottom-1 left-0 w-full h-2 bg-red-100 -z-10"></span></span>에 대해서만.<br />
                        내 <span className="text-red-600 relative inline-block">눈높이<span className="absolute bottom-1 left-0 w-full h-2 bg-red-100 -z-10"></span></span>에 맞춰서.
                    </h1>

                    {/* Tesla Card */}
                    <div className="w-full max-w-[340px] bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] scale-95 origin-center">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 leading-none">TSLA</h2>
                                <span className="text-sm text-gray-400">Stock Name</span>
                            </div>
                            <X className="w-5 h-5 text-gray-300" />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-blue-600">$485.56</span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-md border border-blue-100">
                                📉 -0.65%
                            </span>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-3">오늘 주가 해설</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-2 text-[13px] leading-relaxed text-gray-600">
                                    <span className="text-gray-400 mt-1.5">•</span>
                                    <span>
                                        <strong className="text-gray-800">주요 하락 요인:</strong> 유럽 시장 내 판매 실적이 전년 대비 12% 급감하고...
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Screen 2: Login */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${currentScreen === 2 ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 translate-x-8 blur-sm pointer-events-none'
                        }`}
                >
                    <div className="w-full max-w-sm text-center">
                        <h2 className="text-2xl font-bold mb-10 leading-snug break-keep text-gray-900">
                            매일 내 포트폴리오 맞춤<br />
                            <span className="text-red-600 relative inline-block">3분 브리핑<span className="absolute bottom-1 left-0 w-full h-2 bg-red-100 -z-10"></span></span>을 받아보세요
                        </h2>

                        <button
                            onClick={handleLogin}
                            className="w-full bg-gray-900 hover:bg-black active:scale-95 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 transition-all text-base shadow-lg hover:shadow-xl group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google로 계속하기
                        </button>
                    </div>
                </div>

            </main>

            {/* Footer Elements */}
            <footer className={`relative z-10 w-full mb-12 max-w-md mx-auto transition-opacity duration-500 opacity-100`}>
                {/* Dynamic Counter */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50/80 py-2 px-4 rounded-full w-fit mx-auto border border-gray-200 shadow-sm backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="tabular-nums font-bold text-gray-900">
                        {count.toLocaleString()}
                    </span>
                    <span>명의 투자자가 지금 확인하고 있습니다</span>
                </div>
            </footer>

            {/* Interaction Layer (Progress Dots) */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
                {[0, 1, 2].map((idx) => (
                    <button
                        key={idx}
                        onClick={() => goToScreen(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${currentScreen === idx ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to screen ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
