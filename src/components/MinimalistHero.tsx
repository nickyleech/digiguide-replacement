import React from 'react';

interface MinimalistHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function MinimalistHero({
  title = "Premium TV Experience",
  subtitle = "Discover what's on",
  description = "A refined approach to television programming, designed with intentional simplicity and elegant focus.",
  ctaText = "Explore Guide",
  onCtaClick
}: MinimalistHeroProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main container with massive padding */}
      <div className="max-w-4xl mx-auto px-12 py-32">
        
        {/* Hero content section */}
        <div className="text-center space-y-24">
          
          {/* Primary heading with enormous spacing */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 tracking-tight leading-none">
                {title}
              </h1>
              <div className="w-px h-16 bg-gray-300 mx-auto"></div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-wide">
              {subtitle}
            </h2>
          </div>

          {/* Massive spacing between sections */}
          <div className="py-24">
            <div className="w-full h-px bg-gray-200"></div>
          </div>

          {/* Description section */}
          <div className="space-y-16">
            <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Another massive spacing section */}
          <div className="py-24">
            <div className="w-full h-px bg-gray-200"></div>
          </div>

          {/* CTA section */}
          <div className="space-y-16">
            <button
              onClick={onCtaClick}
              className="group bg-white text-gray-900 px-16 py-6 rounded-3xl border border-gray-200 
                         text-lg font-light tracking-wide transition-all duration-500
                         hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2
                         focus:outline-none focus:ring-4 focus:ring-gray-200"
            >
              {ctaText}
            </button>
          </div>
        </div>

        {/* Feature cards section with enormous spacing */}
        <div className="mt-32 pt-32">
          <div className="grid md:grid-cols-3 gap-24">
            
            {/* Feature card 1 */}
            <div className="group">
              <div className="bg-white p-12 rounded-3xl border border-gray-100 
                            transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30 
                            hover:-translate-y-1">
                <div className="space-y-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto"></div>
                  <h3 className="text-xl font-light text-gray-900 text-center">
                    Curated Content
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed text-center">
                    Thoughtfully selected programming for discerning viewers.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature card 2 */}
            <div className="group">
              <div className="bg-white p-12 rounded-3xl border border-gray-100 
                            transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30 
                            hover:-translate-y-1">
                <div className="space-y-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto"></div>
                  <h3 className="text-xl font-light text-gray-900 text-center">
                    Refined Interface
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed text-center">
                    Clean design that prioritizes content over complexity.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature card 3 */}
            <div className="group">
              <div className="bg-white p-12 rounded-3xl border border-gray-100 
                            transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/30 
                            hover:-translate-y-1">
                <div className="space-y-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto"></div>
                  <h3 className="text-xl font-light text-gray-900 text-center">
                    Seamless Experience
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed text-center">
                    Effortless navigation through your viewing preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final spacer */}
        <div className="py-32"></div>
      </div>
    </div>
  );
}