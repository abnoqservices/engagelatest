import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 

  MessageCircle 
} from 'lucide-react';

export default function Social() {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, link: 'https://facebook.com/yourpage', color: 'bg-blue-600' },
    { name: 'Instagram', icon: Instagram, link: 'https://instagram.com/yourhandle', color: 'bg-gradient-to-tr from-purple-600 to-pink-600' },
    { name: 'Twitter', icon: Twitter, link: '', color: 'bg-black' },
    { name: 'YouTube', icon: Youtube, link: '', color: 'bg-red-600' },
    { name: 'LinkedIn', icon: Linkedin, link: 'https://linkedin.com/company/yourcompany', color: 'bg-blue-700' },
   
    { name: 'WhatsApp', icon: MessageCircle, link: '', color: 'bg-green-500' },
  ];

  return (
   
      <div className="card-header">
        {/* Title (optional) */}
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Connect With Us
        </h3>

        {/* Horizontal Social Card - Row Layout */}
        
          <div className="flex flex-wrap  items-center gap-4 md:gap-6">
          {socialLinks
  .filter(social => social.link && social.link.trim() !== '') // Only show if link exists
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
       

          {/* Mobile: Show only icons, Desktop: Show icon + text */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Follow us for updates & exclusive offers
          </p>
        </div>
      </div>
  
  );
}