import Image from 'next/image';

interface CompanyHeaderProps {
  logo: string;
  name: string;
  tagline: string;
  description: string;
}

export default function CompanyHeader({
  logo,
  name,
  tagline,
  description,
}: CompanyHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 shadow-md overflow-hidden">
            <Image src={logo} alt={`${name} logo`} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{name}</h1>
            <p className="text-xs text-slate-600">{tagline}</p>
          </div>
        </div>

        <div className="hidden sm:block">
          {/* You can add badge, search, cart icon etc here later */}
        </div>
      </div>
    </header>
  );
}
