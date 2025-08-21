import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const [plan, setPlan] = useState<any>(null);
  const [pixSettings, setPixSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [order, setOrder] = useState<any>(null);
  
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');

  useEffect(() => {
    if (!user) {
      navigate(`/auth?planId=${planId}&returnTo=/checkout`);
      return;
    }
    
    if (planId) {
      fetchPlanAndSettings();
    } else {
      navigate('/');
    }
  }, [user, planId, navigate]);

  const fetchPlanAndSettings = async () => {
    try {
      // Fetch plan details
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) throw planError;
      setPlan(planData);

      // Fetch PIX settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['pix_key', 'pix_name', 'pix_bank']);

      if (settingsError) throw settingsError;
      
      const settings = settingsData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      
      setPixSettings(settings);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do plano.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!plan || !user) return;
    
    setIsCreatingOrder(true);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          amount: plan.price,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      setOrder(data);
      
      toast({
        title: "Pedido criado!",
        description: "Realize o pagamento PIX para ativar sua VPS.",
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o pedido.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixSettings.pix_key);
    toast({
      title: "PIX copiado!",
      description: "Chave PIX copiada para a área de transferência.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Plano não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Details */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.is_popular && (
                  <Badge variant="secondary">Mais Popular</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Resumo do plano selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4 border rounded-lg bg-muted/20">
                  <div className="text-3xl font-bold text-gradient">
                    R$ {plan.price.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground">por mês</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="font-semibold">{plan.ram}</div>
                    <div className="text-sm text-muted-foreground">RAM</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="font-semibold">{plan.cpu}</div>
                    <div className="text-sm text-muted-foreground">CPU</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="font-semibold">{plan.storage}</div>
                    <div className="text-sm text-muted-foreground">Storage</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="font-semibold">Ilimitada</div>
                    <div className="text-sm text-muted-foreground">Banda</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Recursos inclusos:</h4>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pagamento PIX
              </CardTitle>
              <CardDescription>
                Realize o pagamento para ativar sua VPS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!order ? (
                <>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Dados PIX:</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Favorecido:</span> {pixSettings.pix_name}
                      </div>
                      <div>
                        <span className="font-medium">Banco:</span> {pixSettings.pix_bank}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Chave PIX:</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyPixKey}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {pixSettings.pix_key}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-primary">Instruções:</p>
                        <p className="text-sm mt-1">
                          Faça o PIX no valor exato de <strong>R$ {plan.price.toFixed(2)}</strong> e aguarde até <strong>30 minutos</strong> para a configuração da sua VPS.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateOrder}
                    className="w-full btn-primary"
                    disabled={isCreatingOrder}
                  >
                    {isCreatingOrder ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Criando pedido...
                      </>
                    ) : (
                      'Confirmar Pedido'
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Pedido Criado!</h3>
                    <p className="text-muted-foreground">
                      Pedido #{order.id.slice(-8)}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Aguardando pagamento PIX</strong><br />
                      Realize o pagamento de R$ {plan.price.toFixed(2)} e sua VPS será configurada em até 30 minutos.
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary"
                  >
                    Ir para Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;