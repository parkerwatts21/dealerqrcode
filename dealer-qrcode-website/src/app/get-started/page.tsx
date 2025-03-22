import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'

export default function GetStarted() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Get Started with Dealer QRCode
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Follow these simple steps to start using Dealer QRCode in your dealership.
          </p>
          <div className="space-y-6 text-left">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">1. Install the Extension</h2>
              <p className="text-muted-foreground mb-4">
                Visit the Chrome Web Store and install the Dealer QRCode extension.
              </p>
              <Button asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Install from Chrome Web Store
                </a>
              </Button>
            </div>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">2. Configure Your Settings</h2>
              <p className="text-muted-foreground">
                Click the extension icon in your browser toolbar to access settings and customize your QR code preferences.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">3. Start Generating QR Codes</h2>
              <p className="text-muted-foreground">
                Navigate to your inventory page, and the extension will automatically generate QR codes for your vehicles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 