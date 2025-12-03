import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin,
  MessageCircle 
} from 'lucide-react';

export default function Social({ data }) {

  // Extract dynamic field values
  const getValue = (name: string) =>
    data?.find((f: any) => f.name === name)?.value?.trim() || "";

  const socialLinks = [
    { name: "Facebook", icon: Facebook, link: getValue("facebook"), color: "bg-blue-600" },
    { name: "Instagram", icon: Instagram, link: getValue("instagram"), color: "bg-gradient-to-tr from-purple-600 to-pink-600" },
    { name: "Twitter", icon: Twitter, link: getValue("twitter"), color: "bg-black" },
    { name: "YouTube", icon: Youtube, link: getValue("youtube"), color: "bg-red-600" },

    // Optional platforms — only appear if you add them in data
    { name: "LinkedIn", icon: Linkedin, link: getValue("linkedin"), color: "bg-blue-700" },
    { name: "WhatsApp", icon: MessageCircle, link: getValue("whatsapp"), color: "bg-green-500" },
  ];

  return (
    <div className="card-header">

      <h3 className="core-header-title">Connect With Us</h3>
      <div className="w-12 h-1 bg-gray-100 mx-auto mb-6 rounded-full"></div>

      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        
        {socialLinks
          .filter(social => social.link !== "")   // show only if link exists
          .map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full 
                  group flex items-center justify-center gap-4 
                  px-6 py-5 rounded-xl 
                  ${social.color} 
                  text-white font-semibold text-base
                  transition-all duration-300 
                  hover:shadow-xl hover:-translate-y-1
                  active:scale-95
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="hidden md:block text-sm">{social.name}</span>
              </a>
            );
         })}
      </div>

      <p className="text-center text-gray-500 text-sm mt-6">
        Follow us for updates & exclusive offers
      </p>

    </div>
  );
}
