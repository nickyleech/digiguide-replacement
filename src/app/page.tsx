'use client'

import { 
  Tv, 
  Clock,
  ArrowRight,
  Pause
} from 'lucide-react'

export default function HomePage() {
  const principles = [
    {
      title: 'Thoughtful viewing',
      description: 'Take time to choose programmes that truly interest you. Quality over quantity in your viewing choices.',
    },
    {
      title: 'Mindful scheduling',
      description: 'Plan your viewing with intention. Create space for reflection between programmes.',
    },
    {
      title: 'Purposeful selection',
      description: 'Every programme should serve a purpose—whether to inform, inspire, or genuinely entertain.',
    },
  ]

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Navigation */}
      <nav className="px-6 py-8 bg-primary-50 border-b border-primary-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-800 rounded-sm">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-light text-primary-800 tracking-wide">digiguide</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-primary-600 hover:text-primary-800 font-light text-sm tracking-wide">Sign in</button>
            <button 
              onClick={() => window.location.href = '/guide'}
              className="btn-primary text-sm"
            >
              View guide
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="minimal-section">
        <div className="focus-area px-6">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-light text-primary-800 leading-tight tracking-tight">
                A moment to pause
              </h1>
              <div className="w-16 h-px bg-primary-300 mx-auto"></div>
            </div>
            
            <p className="contemplative-text max-w-lg mx-auto">
              Before the screen draws you in, take a moment to consider what truly deserves your attention today.
            </p>
            
            <div className="pt-8">
              <button 
                onClick={() => window.location.href = '/guide'}
                className="btn-primary inline-flex items-center"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause and reflect
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Principles Section */}
      <section className="minimal-section bg-white border-t border-primary-200">
        <div className="focus-area px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-light text-primary-800 mb-4">
              Three principles for thoughtful viewing
            </h2>
            <div className="w-8 h-px bg-primary-300 mx-auto"></div>
          </div>
          
          <div className="space-y-12">
            {principles.map((principle, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-1 h-1 bg-primary-400 rounded-full mx-auto"></div>
                <h3 className="text-lg font-light text-primary-800">{principle.title}</h3>
                <p className="contemplative-text max-w-md mx-auto">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className="minimal-section bg-primary-50 border-t border-primary-200">
        <div className="focus-area px-6">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-primary-800">
                Simple access
              </h2>
              <div className="w-8 h-px bg-primary-300 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="card p-8 text-center space-y-4">
                <h3 className="text-lg font-light text-primary-800">Essential</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-light text-primary-800">Free</div>
                  <div className="text-sm text-primary-600">Always</div>
                </div>
                <div className="space-y-2 text-sm text-primary-600">
                  <p>Core viewing guide</p>
                  <p>Seven day schedule</p>
                  <p>Mindful reminders</p>
                </div>
                <button className="btn-secondary w-full">Begin</button>
              </div>
              
              <div className="card p-8 text-center space-y-4 ring-1 ring-primary-300">
                <h3 className="text-lg font-light text-primary-800">Complete</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-light text-primary-800">£3</div>
                  <div className="text-sm text-primary-600">Monthly</div>
                </div>
                <div className="space-y-2 text-sm text-primary-600">
                  <p>Full programme details</p>
                  <p>Extended schedule</p>
                  <p>Personal curation</p>
                </div>
                <button className="btn-primary w-full">Try for free</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reflection Section */}
      <section className="minimal-section bg-white border-t border-primary-200">
        <div className="focus-area px-6">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Clock className="w-8 h-8 text-primary-400 mx-auto" />
              <p className="contemplative-text max-w-md mx-auto">
                In a world of endless content, choose what truly matters to you.
              </p>
            </div>
            
            <button 
              onClick={() => window.location.href = '/guide'}
              className="btn-primary inline-flex items-center"
            >
              Begin your journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-100 border-t border-primary-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary-800 rounded-sm">
                  <Tv className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-light text-primary-800 tracking-wide">digiguide</span>
              </div>
              <p className="text-sm text-primary-600 font-light">
                Thoughtful television for mindful viewing.
              </p>
            </div>
            <div>
              <h4 className="font-light mb-4 text-primary-800">Information</h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li><a href="#" className="hover:text-primary-800 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-800 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary-800 transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-light mb-4 text-primary-800">Support</h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li><a href="#" className="hover:text-primary-800 transition-colors">Help</a></li>
                <li><a href="#" className="hover:text-primary-800 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-200 mt-8 pt-8 text-center">
            <p className="text-sm text-primary-600 font-light">&copy; 2024 digiguide. Made with intention.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}