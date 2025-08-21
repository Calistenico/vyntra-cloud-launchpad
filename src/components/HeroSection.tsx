import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap, Shield, Server } from 'lucide-react';
import heroImage from '@/assets/hero-servers.jpg';

const HeroSection = () => {
  const features = [
    { icon: Zap, text: 'Internet ilimitada' },
    { icon: Server, text: '60GB SSD' },
    { icon: CheckCircle, text: 'Dual Xeon 5520 Custom 2.26GHz' },
    { icon: Shield, text: 'Garantia de 7 dias' },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="VPS Infrastructure" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-secondary/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            VPS de <span className="text-accent">Alta Performance</span>
            <br />
            com Internet Ilimitada
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
            Servidores virtuais profissionais com 7 dias de garantia e suporte técnico especializado
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-3 group">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <p className="text-sm md:text-base font-medium text-center">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Ver Planos Disponíveis
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg rounded-xl">
              Falar com Especialista
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>Setup em até 30 minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>SLA 99.9% de uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-accent" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full animate-float hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary/20 rounded-full animate-float animation-delay-1000 hidden lg:block" />
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full animate-pulse-soft hidden lg:block" />
    </section>
  );
};

export default HeroSection;