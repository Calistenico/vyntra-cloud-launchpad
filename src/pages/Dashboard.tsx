import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Server, 
  CreditCard, 
  MessageSquare, 
  LogOut, 
  Settings, 
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import TicketDialog from '@/components/TicketDialog';

const Dashboard = () => {
  const [vpsData, setVpsData] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (isAdmin) {
      navigate('/admin');
      return;
    }
    
    fetchUserData();
  }, [user, navigate, isAdmin]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch user VPS
      const { data: vpsData, error: vpsError } = await supabase
        .from('vps')
        .select(`
          *,
          plans:plan_id (name, ram, cpu, storage, price)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (vpsError) throw vpsError;
      setVpsData(vpsData || []);

      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          plans:plan_id (name, ram, cpu, storage, price)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch user tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(ticketsData || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Ativo', variant: 'default' as const, color: 'text-green-600', icon: CheckCircle },
      pending: { label: 'Pendente', variant: 'secondary' as const, color: 'text-yellow-600', icon: Clock },
      suspended: { label: 'Suspenso', variant: 'destructive' as const, color: 'text-red-600', icon: AlertCircle },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{statusInfo.label}</span>
      </Badge>
    );
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">VyntraCloud</h1>
              <p className="text-muted-foreground">
                Bem-vindo, {profile?.full_name || user?.email}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Início
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vps" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vps" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>Minhas VPS</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Suporte</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vps" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Suas VPS</h2>
              <Button onClick={() => navigate('/')} className="btn-primary">
                Contratar Nova VPS
              </Button>
            </div>

            {vpsData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma VPS contratada</h3>
                  <p className="text-muted-foreground mb-4">
                    Contrate sua primeira VPS para começar!
                  </p>
                  <Button onClick={() => navigate('/')} className="btn-primary">
                    Ver Planos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {vpsData.map((vps) => (
                  <Card key={vps.id} className="card-elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Server className="h-5 w-5" />
                          <span>{vps.name}</span>
                        </CardTitle>
                        {getStatusBadge(vps.status)}
                      </div>
                      <CardDescription>
                        {vps.plans?.name} - {vps.plans?.ram} RAM, {vps.plans?.cpu}, {vps.plans?.storage}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Detalhes Técnicos</h4>
                          <div className="space-y-1 text-sm">
                            <div><strong>IP:</strong> {vps.ip_address || 'Configurando...'}</div>
                            <div><strong>RAM:</strong> {vps.plans?.ram}</div>
                            <div><strong>CPU:</strong> {vps.plans?.cpu}</div>
                            <div><strong>Storage:</strong> {vps.plans?.storage}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium">Ações</h4>
                          <div className="flex flex-wrap gap-2">
                            {vps.status === 'active' && (
                              <>
                                {vps.control_panel_url && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={vps.control_panel_url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      Painel
                                    </a>
                                  </Button>
                                )}
                                {vps.remote_access_url && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={vps.remote_access_url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      Console
                                    </a>
                                  </Button>
                                )}
                              </>
                            )}
                            
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Reiniciar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-xl font-semibold">Histórico de Pedidos</h2>
            
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-muted-foreground">
                    Seus pedidos aparecerão aqui quando você contratar uma VPS.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{order.plans?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Pedido #{order.id.slice(-8)} • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">R$ {order.amount.toFixed(2)}</div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Suporte Técnico</h2>
              <Button
                onClick={() => setIsTicketDialogOpen(true)}
                className="btn-primary"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Novo Ticket
              </Button>
            </div>

            {tickets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum ticket de suporte</h3>
                  <p className="text-muted-foreground mb-4">
                    Precisa de ajuda? Abra um ticket de suporte!
                  </p>
                  <Button
                    onClick={() => setIsTicketDialogOpen(true)}
                    className="btn-primary"
                  >
                    Abrir Primeiro Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {ticket.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(ticket.created_at).toLocaleString()}
                          </p>
                          
                          {ticket.admin_response && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium text-primary">Resposta da equipe:</p>
                              <p className="text-sm mt-1">{ticket.admin_response}</p>
                            </div>
                          )}
                        </div>
                        <Badge 
                          variant={ticket.status === 'open' ? 'default' : 'secondary'}
                        >
                          {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TicketDialog
        isOpen={isTicketDialogOpen}
        onClose={() => setIsTicketDialogOpen(false)}
        onTicketCreated={() => {
          setIsTicketDialogOpen(false);
          fetchUserData();
        }}
      />
    </div>
  );
};

export default Dashboard;