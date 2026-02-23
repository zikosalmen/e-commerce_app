import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';


    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json(
        { error: 'Vous envoyez trop de messages. Réessayez dans quelques secondes.' },
        { status: 429 }
      );
    }


    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL not configured');
      return NextResponse.json(
        { error: 'Configuration du serveur manquante' },
        { status: 500 }
      );
    }

    let webhookData;
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, timestamp: new Date().toISOString() }),
        signal: AbortSignal.timeout(20000), 
      });

      if (!webhookResponse.ok) {
        console.error(`Webhook returned status ${webhookResponse.status}`);
        throw new Error(`Service indisponible temporairement`);
      }

      webhookData = await webhookResponse.json();
    } catch (fetchError) {
      console.error('Webhook connection error:', fetchError);
      return NextResponse.json({
        reply: "Désolé, je ne peux pas me connecter au serveur d'intelligence pour le moment. Veuillez vérifier votre connexion ou réessayer plus tard."
      });
    }

    return NextResponse.json({
      reply: webhookData.reply || 'what?',
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message' },
      { status: 500 }
    );
  }
}
