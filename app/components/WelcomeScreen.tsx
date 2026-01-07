'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to home after 2.5 seconds
    const timer = setTimeout(() => {
      router.push('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 animate-fade-in">
      {/* Logo with animation */}
      <div className="mb-8 animate-scale-in">
        <Image 
          src="https://i.ibb.co/Pkyx3k4/Group-32.png"
          alt="Dooit Logo"
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </div>

      {/* Title */}
      <h1 className="text-white text-4xl font-bold mb-3 animate-slide-up">
        Dooit
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-center text-base animate-slide-up-delay">
        Write what you need<br />to do. Everyday.
      </p>

      {/* Continue Button */}
      <button 
        onClick={() => router.push('/home')}
        className="mt-32 bg-white text-black px-12 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors animate-slide-up-delay-2"
      >
        Continue
      </button>
    </div>
  );
}