import React from 'react';
import { Server, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'VPS Linux', href: '#' },
      { name: 'VPS Windows', href: '#' },
      { name: 'Hospedagem Web', href: '#' },
      { name: 'Domínios', href: '#' }
    ],
    support: [
      { name: 'Central de Ajuda', href: '#' },
      { name: 'Documentação', href: '#' },
      { name: 'Status dos Serviços', href: '#' },
      { name: 'Contato', href: '#contact' }
    ],
    company: [
      { name: 'Sobre Nós', href: '#' },
      { name: 'Termos de Uso', href: '#' },
      { name: 'Política de Privacidade', href: '#' },
      { name: 'SLA', href: '#' }
    ]
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-accent p-2 rounded-lg">
                <Server className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">VyntraCloud</h3>
                <p className="text-primary-foreground/80">VPS Excellence</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Especialista em soluções VPS de alta performance. Oferecemos infraestrutura 
              robusta e confiável para impulsionar seus projetos com garantia de qualidade.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/90">impulsodigitalvendas@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/90">(44) 99923-4917</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/90">Suporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Guarantees Section */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-primary-foreground/80">Uptime Garantido</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-2">7 Dias</div>
              <div className="text-primary-foreground/80">Garantia Integral</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-2">24/7</div>
              <div className="text-primary-foreground/80">Suporte Técnico</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary-hover">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/80 text-sm">
              © {currentYear} VyntraCloud. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-primary-foreground/80">
              <span>🔒 Pagamentos Seguros</span>
              <span>⚡ Setup Rápido</span>
              <span>🛡️ Proteção DDoS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;