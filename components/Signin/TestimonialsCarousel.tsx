import React from "react";
const testimonials = [
    {
      name: "Taylor Nguyen",
      role: "Engineering Lead",
      company: "Acme Corp",
      image: "https://cultivatedculture.com/wp-content/uploads/2019/12/LinkedIn-Profile-Picture-Example-Madeline-Mann.jpeg",
      quote:
        "EngageIQ instantly showed us where users were dropping off."
    },
    {
      name: "Aarav Mehta",
      role: "Product Manager",
      company: "Flowly",
      image: "https://cultivatedculture.com/wp-content/uploads/2019/12/LinkedIn-Profile-Picture-Example-Rachel-Montan%CC%83ez.jpeg",
      quote:
        "Setup was effortless and insights were actionable from day one."
    }
  ];
  
 export default function TestimonialsCarousel() {
    const [index, setIndex] = React.useState(0);
  
    React.useEffect(() => {
      const id = setInterval(
        () => setIndex((i) => (i + 1) % testimonials.length),
        4000
      );
      return () => clearInterval(id);
    }, []);
  
    const t = testimonials[index];
  
    return (
      <div className="mb-10">
        <div className="rounded-2xl bg-white  p-6  backdrop-blur transition-all">
          <p className="text-md mb-4"><span className="font-bold text-gray-500 text-2xl">“</span>{t.quote}<span className="font-bold text-gray-500 text-2xl">”</span></p>
  
          <div className="flex items-center gap-4">
            <img
              src={t.image}
              alt={t.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500 font-medium">
                {t.role}, {t.company}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  