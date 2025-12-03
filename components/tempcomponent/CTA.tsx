import React from 'react';

export default function CTA({ data }) {
  // Get values from your dynamic fields
  const ctaText = data?.find(f => f.name === "ctaText")?.value || "Ready to Get Started?";
  const ctaUrl = data?.find(f => f.name === "ctaUrl")?.value || "/register";

  return (
    <section className="card-header py-16">
      <div className="max-w-3xl mx-auto text-center px-4">

        {/* Dynamic Heading */}
        <h5 className="core-header-title">
          {ctaText}
        </h5>
        <div className="w-12 h-1 bg-gray-100 mx-auto mb-4 rounded-full"></div>
        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href={ctaUrl}
            className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold text-xl 
                       px-10 py-5 rounded-2xl shadow-xl hover:bg-blue-700 
                       transform hover:scale-105 transition-all duration-300"
          >
            <span>Start Now</span>

            <svg xmlns="http://www.w3.org/2000/svg" 
                 className="w-7 h-7" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke="currentColor">
              <path strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Optional subtext */}
        <p className="mt-6 text-gray-600 text-sm">
          No credit card required • Free trial available
        </p>

      </div>
    </section>
  );
}
