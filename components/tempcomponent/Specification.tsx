import React from 'react';
import { Check } from 'lucide-react';

export default function Specification() {
  const features = [
    {
      title: 'Heart Rate Monitoring',
      desc: 'Keep track of your heart rate throughout the day – in real time with features like automatic detection.',
    },
    {
      title: 'Blood Oxygen (SpO2) Detection',
      desc: 'Monitor your oxygen levels for better health insights and early detection of potential issues.',
    },
    {
      title: 'Stress Testing',
      desc: 'Stay mindful of your stress levels and manage them effectively with guided breathing exercises.',
    },
    {
      title: 'Sleep Monitoring',
      desc: 'Get a complete analysis of your sleep patterns: deep sleep, light sleep, REM, and wake time.',
    },
    {
      title: 'Pedometer',
      desc: 'Track your steps, calories burned, and mileage to stay active and reach your fitness goals.',
    },
  ];

  return (
    <section className="card-header">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
         Product Specification
        </h2>

        <div className="space-y-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-5 group">
              {/* Checkmark Circle */}
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Check className="w-6 h-6 text-green-600" strokeWidth={3} />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}