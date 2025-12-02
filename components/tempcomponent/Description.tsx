import React from 'react';

export default function Description() {
  return (
 
      <div  className="card-header">
        {/* Short & Powerful Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
          Your Health Companion,<br />
          Always by Your Side
        </h2>

        {/* Professional Short Description */}
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Track your heart rate, sleep quality, stress levels, and daily activity with medical-grade accuracy. 
          Designed for modern lifestyles — waterproof, lightweight, and with up to 14 days of battery life.
        </p>

        {/* Optional subtle callout */}
        <p className="mt-8 text-sm text-gray-500 font-medium uppercase tracking-wider">
          Trusted by over 2 million users worldwide
        </p>
      </div>
  
  );
}