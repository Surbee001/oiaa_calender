import { ExternalLink } from 'lucide-react'

export default function Footer() {
  const quickLinks = [
    { name: 'OIAA Website', url: 'https://oiaa.ajman.ac.ae' },
    { name: 'AU Request', url: 'https://aur.ajman.ac.ae/' },
    { name: 'AU Branding Guidelines', url: 'https://www.ajman.ac.ae/en/omc/branding-guidelines' },
    { name: 'Academic Calendar', url: 'https://www.ajman.ac.ae/en/academics/academic-calendar' },
    { name: 'Edit OIAA Page', url: 'https://oiaa.ajman.ac.ae/admin/login' },
  ]

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center">
          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Quick Links</h3>
            <ul className="flex flex-wrap justify-center gap-6">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribution */}
          <div className="text-sm text-slate-500">
            Made with ❤️ by Hadi
          </div>
        </div>
      </div>
    </footer>
  )
}