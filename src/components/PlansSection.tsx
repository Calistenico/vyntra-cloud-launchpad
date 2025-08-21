import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Cpu, HardDrive, Wifi, Shield, Zap } from 'lucide-react';

const PlansSection = () => {
  const plans = [
    {
      name: 'VPS Starter',
      ram: '1GB',
      price: 25.90,
      popular: false,
      features: [
        '1GB RAM DDR4',
        '60GB SSD NVMe',
        'Dual Xeon 5520 Custom',
        'Internet ilimitada',
        'IP dedicado',
        'Painel de controle',
        'Garantia 7 dias',
        'Suporte 24/7'
      ],
      specs: {
        cpu: '2 vCores',
        storage: '60GB SSD',
        bandwidth: 'Ilimitada',
        ip: '1 IP dedicado'
      }
    },
    {
      name: 'VPS Professional',
      ram: '4GB',
      price: 47.50,
      popular: true,
      features: [
        '4GB RAM DDR4',
        '60GB SSD NVMe',
        'Dual Xeon 5520 Custom',
        'Internet ilimitada',
        'IP dedicado',
        'Painel de controle',
        'Garantia 7 dias',
        'Suporte prioritário 24/7',
        'Backup automático'
      ],
      specs: {
        cpu: '4 vCores',
        storage: '60GB SSD',
        bandwidth: 'Ilimitada',
        ip: '1 IP dedicado'
      }
    },
    {
      name: 'VPS Enterprise',
      ram: '8GB',
      price: 82.50,
      popular: false,
      features: [
        '8GB RAM DDR4',
        '60GB SSD NVMe',
        'Dual Xeon 5520 Custom',
        'Internet ilimitada',
        'IP dedicado',
        'Painel de controle avançado',
        'Garantia 7 dias',
        'Suporte VIP 24/7',
        'Backup automático diário',
        'Monitoramento avançado'
      ],
      specs: {
        cpu: '6 vCores',
        storage: '60GB SSD',
        bandwidth: 'Ilimitada',
        ip: '1 IP dedicado'
      }
    }
  ];

  return (
    <section id="plans" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Planos <span className="text-gradient">VPS</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para seu projeto. Todos incluem internet ilimitada e garantia de 7 dias.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'card-plan-featured shadow-xl scale-105' 
                  : 'card-plan'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-accent to-secondary text-white text-center py-2 text-sm font-semibold">
                    ⭐ MAIS POPULAR
                  </div>
                </div>
              )}

              <CardHeader className={plan.popular ? 'pt-12' : 'pt-6'}>
                <CardTitle className="text-2xl font-bold text-center">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-center">
                  Ideal para projetos que precisam de {plan.ram} de RAM
                </CardDescription>
                
                {/* Price */}
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-gradient">
                    R$ {plan.price.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground">por mês</div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-card-border">
                  <div className="text-center">
                    <Cpu className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-sm font-semibold">{plan.specs.cpu}</div>
                  </div>
                  <div className="text-center">
                    <HardDrive className="h-6 w-6 text-secondary mx-auto mb-2" />
                    <div className="text-sm font-semibold">{plan.specs.storage}</div>
                  </div>
                  <div className="text-center">
                    <Wifi className="h-6 w-6 text-accent mx-auto mb-2" />
                    <div className="text-sm font-semibold">{plan.specs.bandwidth}</div>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-sm font-semibold">{plan.specs.ip}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 font-semibold text-lg ${
                    plan.popular 
                      ? 'btn-accent hover:scale-105' 
                      : 'btn-hero'
                  }`}
                  size="lg"
                >
                  Comprar Agora
                </Button>

                {/* Payment Info */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  💳 Pagamento via PIX • Setup em até 30 minutos
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
          <h3 className="text-xl font-semibold mb-2">🔒 Processamento Seguro</h3>
          <p className="text-muted-foreground">
            Faça o PIX do valor correspondente e aguarde até 30 minutos para a configuração da sua VPS.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;