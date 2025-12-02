import React from 'react';

export default function Contact() {
  return (
   
      <div className="card-header items-left-">
        <h2 className="text-3xl font-bold text-center mb-10">Contact Us</h2>
        
      
          <div className="space-y-8 text-left">
            <div className="flex items-center gap-4">
              <div className="text-2xl">📞</div>
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-2xl">✉️</div>
              <div>
                <p className="font-semibold">Email</p>
                <a href="mailto:hello@company.com" className="text-blue-600 hover:underline">
                  hello@company.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-2xl">📍</div>
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-gray-600">
                  123 Business Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="https://maps.google.com/?q=123+Business+Street,+New+York"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
    
   
  );
}