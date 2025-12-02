import React from 'react';

export default function CTA() {
  return (
    <section className="card-header">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h5 className="text-4xl md:text-5xl font-bold  mb-6">
          Ready to Get Started?
        </h5>

        {/* Description - appears AFTER the button */}
       

        {/* Large CTA Button */}
        <div className="flex justify-center">
          <a
            href="/register"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700  font-bold text-xl px-10 py-6 rounded-xl shadow-2xl  transform hover:scale-105 transition-all duration-300"
          >
            <span>Start Free Registration</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Optional small text under button */}
        <p className="mt-8 text-sm ">
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
}
