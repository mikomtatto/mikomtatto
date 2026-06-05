const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-darker via-dark to-black"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-700 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
          <span className="text-white">Mikom</span>
          <span className="text-accent">Tattoo</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Profesyonel dövme sanat stüdyosu. Her dövme bir sanat eseridir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/booking" className="btn-primary text-lg">
            Randevu Al
          </a>
          <a href="/gallery" className="btn-secondary text-lg">
            Galeriyi İncele
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
