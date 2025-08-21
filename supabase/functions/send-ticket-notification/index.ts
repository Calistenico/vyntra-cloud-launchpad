import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TicketNotificationRequest {
  title: string;
  message: string;
  priority: string;
  user_email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, message, priority, user_email }: TicketNotificationRequest = await req.json();

    // Priority labels in Portuguese
    const priorityLabels = {
      low: 'Baixa',
      medium: 'Média', 
      high: 'Alta'
    };

    const priorityLabel = priorityLabels[priority as keyof typeof priorityLabels] || 'Média';
    const priorityColor = priority === 'high' ? '#dc2626' : priority === 'medium' ? '#f59e0b' : '#16a34a';

    const emailResponse = await resend.emails.send({
      from: "VyntraCloud <noreply@vyntracloud.com>",
      to: ["impulsodigitalvendas@gmail.com"],
      subject: `[TICKET] ${title} - Prioridade: ${priorityLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #0B3D91 0%, #1E90FF 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">VyntraCloud</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Novo Ticket de Suporte</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <span style="background-color: ${priorityColor}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                ${priorityLabel}
              </span>
              <span style="color: #64748b; font-size: 14px;">
                de ${user_email}
              </span>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 8px 0; font-weight: 600;">
                ${title}
              </h2>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #0B3D91; margin-bottom: 25px;">
              <h3 style="color: #475569; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                Mensagem do Cliente:
              </h3>
              <p style="color: #334155; margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
                ${message}
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fadcugciqhwezitwuulo.supabase.co" 
                 style="background: linear-gradient(135deg, #0B3D91 0%, #1E90FF 100%); 
                        color: white; 
                        padding: 14px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: 600; 
                        display: inline-block; 
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                Acessar Painel Admin
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <div style="color: #64748b; font-size: 12px; text-align: center; line-height: 1.5;">
              <p style="margin: 0;">
                Este ticket foi criado automaticamente pelo sistema VyntraCloud.<br>
                Responda o mais rápido possível para manter a satisfação do cliente.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Ticket notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-ticket-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);