import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Users,
  Server,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [vpsData, setVpsData] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketResponse, setTicketResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchAllData();
  }, [user, navigate, isAdmin]);

  const fetchAllData = async () => {
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch all VPS
      const { data: vpsData, error: vpsError } = await supabase
        .from('vps')
        .select(`
          *,
          plans:plan_id (name, ram, cpu, storage, price),
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (vpsError) throw vpsError;
      setVpsData(vpsData || []);

      // Fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          plans:plan_id (name, ram, cpu, storage, price),
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch all tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(ticketsData || []);

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('key, value');

      if (settingsError) throw settingsError;
      
      const settingsObj = settingsData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      
      setSettings(settingsObj);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados administrativos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // If order is approved, create VPS
      if (newStatus === 'paid') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          const { error: vpsError } = await supabase
            .from('vps')
            .insert({
              user_id: order.user_id,
              plan_id: order.plan_id,
              name: `${order.plans.name} - ${order.profiles.full_name}`,
              status: 'active',
              ip_address: generateIP(),
              control_panel_url: 'https://panel.vyntracloud.com',
              remote_access_url: 'https://console.vyntracloud.com'
            });

          if (vpsError) throw vpsError;
        }
      }

      toast({
        title: "Status atualizado!",
        description: `Pedido ${newStatus === 'paid' ? 'aprovado e VPS criada' : 'atualizado'}.`,
      });
      
      fetchAllData();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const respondToTicket = async () => {
    if (!selectedTicket || !ticketResponse.trim()) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          admin_response: ticketResponse,
          status: 'closed'
        })
        .eq('id', selectedTicket.id);

      if (error) throw error;

      toast({
        title: "Resposta enviada!",
        description: "O cliente será notificado sobre a resposta.",
      });
      
      setSelectedTicket(null);
      setTicketResponse('');
      fetchAllData();
    } catch (error) {
      console.error('Error responding to ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePixSettings = async () => {
    try {
      const updates = [
        { key: 'pix_key', value: settings.pix_key },
        { key: 'pix_name', value: settings.pix_name },
        { key: 'pix_bank', value: settings.pix_bank },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert(update);
        
        if (error) throw error;
      }

      toast({
        title: "Configurações salvas!",
        description: "As configurações PIX foram atualizadas.",
      });
    } catch (error) {
      console.error('Error updating PIX settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const generateIP = () => {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Ativo', variant: 'default' as const },
      pending: { label: 'Pendente', variant: 'secondary' as const },
      suspended: { label: 'Suspenso', variant: 'destructive' as const },
      paid: { label: 'Pago', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const },
      open: { label: 'Aberto', variant: 'default' as const },
      closed: { label: 'Fechado', variant: 'secondary' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
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
              <h1 className="text-2xl font-bold text-gradient">VyntraCloud Admin</h1>
              <p className="text-muted-foreground">Painel Administrativo</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Site
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Server className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{vpsData.length}</p>
                  <p className="text-sm text-muted-foreground">VPS Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pedidos Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
                  <p className="text-sm text-muted-foreground">Tickets Abertos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="vps">VPS</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold">Gerenciar Pedidos</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{order.plans?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {order.profiles?.full_name} ({order.profiles?.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Pedido #{order.id.slice(-8)} • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-lg font-semibold">R$ {order.amount.toFixed(2)}</div>
                        {getStatusBadge(order.status)}
                        
                        {order.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'paid')}
                              className="btn-primary"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vps" className="space-y-4">
            <h2 className="text-xl font-semibold">Gerenciar VPS</h2>
            
            <div className="space-y-4">
              {vpsData.map((vps) => (
                <Card key={vps.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{vps.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {vps.profiles?.full_name} ({vps.profiles?.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          IP: {vps.ip_address} • {vps.plans?.ram} RAM, {vps.plans?.cpu}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        {getStatusBadge(vps.status)}
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reiniciar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <h2 className="text-xl font-semibold">Gerenciar Tickets</h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Tickets de Suporte</h3>
                {tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{ticket.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {ticket.profiles?.full_name} ({ticket.profiles?.email})
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(ticket.created_at).toLocaleString()}
                          </p>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedTicket && (
                <Card>
                  <CardHeader>
                    <CardTitle>Responder Ticket</CardTitle>
                    <CardDescription>
                      {selectedTicket.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Mensagem do cliente:</Label>
                      <div className="p-3 bg-muted/50 rounded-lg mt-1">
                        <p className="text-sm">{selectedTicket.message}</p>
                      </div>
                    </div>

                    {selectedTicket.status === 'open' && (
                      <>
                        <div>
                          <Label htmlFor="response">Sua resposta:</Label>
                          <Textarea
                            id="response"
                            placeholder="Digite sua resposta..."
                            value={ticketResponse}
                            onChange={(e) => setTicketResponse(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <Button
                          onClick={respondToTicket}
                          className="w-full btn-primary"
                          disabled={isUpdating || !ticketResponse.trim()}
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            'Enviar Resposta'
                          )}
                        </Button>
                      </>
                    )}

                    {selectedTicket.admin_response && (
                      <div>
                        <Label>Resposta enviada:</Label>
                        <div className="p-3 bg-primary/10 rounded-lg mt-1">
                          <p className="text-sm">{selectedTicket.admin_response}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h2 className="text-xl font-semibold">Usuários Cadastrados</h2>
            
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Cadastrado em: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        {user.is_admin && (
                          <Badge variant="secondary">Administrador</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Configurações PIX</CardTitle>
                <CardDescription>
                  Configure os dados PIX que serão exibidos para os clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pix_key">Chave PIX</Label>
                    <Input
                      id="pix_key"
                      value={settings.pix_key || ''}
                      onChange={(e) => setSettings({...settings, pix_key: e.target.value})}
                      placeholder="Chave PIX (CPF, CNPJ, Email, etc.)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pix_name">Nome do Favorecido</Label>
                    <Input
                      id="pix_name"
                      value={settings.pix_name || ''}
                      onChange={(e) => setSettings({...settings, pix_name: e.target.value})}
                      placeholder="Nome do favorecido"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pix_bank">Banco</Label>
                    <Input
                      id="pix_bank"
                      value={settings.pix_bank || ''}
                      onChange={(e) => setSettings({...settings, pix_bank: e.target.value})}
                      placeholder="Nome do banco"
                    />
                  </div>
                </div>

                <Button onClick={updatePixSettings} className="btn-primary">
                  <Settings className="h-4 w-4 mr-2" />
                  Salvar Configurações PIX
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;