import React from 'react';

export default function Contact({ data }) {

  const getValue = (name: string) =>
    data?.find((f: any) => f.name === name)?.value || "";

  const phone = getValue("phone");
  const email = getValue("email");
  const address = getValue("address");
  const directionText = getValue("directionButtonText") || "Get Directions";
  const directionUrl = getValue("directionUrl") || "#";

  return (
    <div className="card-header">

      {/* Centered Heading */}
      <div className="text-center">
        <h2 className="core-header-title">Contact Us</h2>
        <div className="w-12 h-1 bg-gray-100 mx-auto mb-6 rounded-full"></div>
      </div>

      {/* Left Aligned Content */}
      <div className="space-y-8 text-left">

        {/* Phone */}
        {phone && (
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">📞</div>
            <div className="min-w-0">
              <p className="font-semibold">Phone</p>
              <a
                href={`tel:${phone}`}
                className="text-gray-600 break-all hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">✉️</div>
            <div className="min-w-0">
              <p className="font-semibold">Email</p>
              <a
                href={`mailto:${email}`}
                className="text-blue-600 break-all hover:underline"
              >
                {email}
              </a>
            </div>
          </div>
        )}

        {/* Address */}
        {address && (
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">📍</div>
            <div className="min-w-0">
              <p className="font-semibold">Address</p>
              <p className="text-gray-600 whitespace-pre-line break-words">
                {address}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Centered Button */}
      {directionUrl && directionText && (
        <div className="pt-6 flex justify-center">
          <a
            href={directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg 
                       font-medium hover:bg-blue-700 transition"
          >
            {directionText} →
          </a>
        </div>
      )}

    </div>
  );
}
