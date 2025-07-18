import { 
  Header, 
  Hero, 
  FeatureGrid, 
  HowItWorks, 
  CTA, 
  Footer 
} from "@workspace/ui"

export default function LandingPage() {
  return (
    <div className="bg-slate-900">
      <Header />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}
