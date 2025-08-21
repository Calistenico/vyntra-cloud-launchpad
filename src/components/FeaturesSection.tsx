import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Shield, 
  Server, 
  Headphones, 
  Clock, 
  CheckCircle,
  Cpu,
  HardDrive,
  Globe,
  Lock
} from 'lucide-react';

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: Zap,
      title: 'Alta Performance',
      description: 'Processadores Dual Xeon 5520 Custom 2.26GHz com 8 cores e 16 threads para máximo desempenho.',
      color: 'text-accent'
    },
    {
      icon: Globe,
      title: 'Internet Ilimitada',
      description: 'Banda larga ilimitada com conexão estável e de alta velocidade para seus projetos.',
      color: 'text-secondary'
    },
    {
      icon: Shield,
      title: 'Garantia de 7 Dias',
      description: 'Satisfação garantida ou seu dinheiro de volta. Teste nossos serviços sem riscos.',
      color: 'text-primary'
    },
    {
      icon: Headphones,
      title: 'Suporte 24/7',
      description: 'Equipe técnica especializada disponível todos os dias da semana para te ajudar.',
      color: 'text-accent'
    }
  ];

  const techSpecs = [
    { icon: Cpu, label: 'Processador', value: 'Dual Xeon 5520 Custom 2.26GHz' },
    { icon: HardDrive, label: 'Armazenamento', value: '60GB SSD NVMe' },
    { icon: Zap, label: 'Cores/Threads', value: '2 Processors, 8 Cores / 16 Threads' },
    { icon: Globe, label: 'Banda', value: 'Internet Ilimitada' },
    { icon: Clock, label: 'Uptime', value: 'SLA 99.9%' },
    { icon: Lock, label: 'Segurança', value: 'IP Dedicado + Firewall' }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Por que escolher a <span className="text-gradient">VyntraCloud</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos a melhor infraestrutura VPS do mercado com tecnologia de ponta e suporte especializado.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="card-elevated group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Specifications */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Especificações Técnicas</h3>
            <p className="text-muted-foreground">
              Hardware de última geração para garantir o melhor desempenho
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techSpecs.map((spec, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-card-border">
                <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <spec.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    {spec.label}
                  </div>
                  <div className="font-bold text-foreground">
                    {spec.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Vantagens Exclusivas</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-accent/10 rounded-full">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h4 className="font-semibold">Setup Rápido</h4>
              <p className="text-muted-foreground text-sm">
                Sua VPS ficará pronta em até 30 minutos após a confirmação do pagamento
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-secondary/10 rounded-full">
                <Server className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="font-semibold">Infraestrutura Robusta</h4>
              <p className="text-muted-foreground text-sm">
                Servidores em datacenter tier 3 com redundância e monitoramento 24/7
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold">Segurança Avançada</h4>
              <p className="text-muted-foreground text-sm">
                Proteção DDoS, firewall configurável e backups automáticos diários
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;