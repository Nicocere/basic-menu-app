import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { products, mp_data } = body;

        // Validar que tengamos datos de pago
        if (!mp_data || !mp_data.data) {
            return NextResponse.json(
                { error: 'Datos de pago no proporcionados' },
                { status: 400 }
            );
        }

        // Validar token de acceso
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado en variables de entorno');
        }

        // Inicializar el cliente de Mercado Pago con la nueva API
        const client = new MercadoPagoConfig({ accessToken });
        const paymentClient = new Payment(client);

        // Crear el pago usando la nueva API
        const paymentResponse = await paymentClient.create({
            body: mp_data.data
        });

        // Manejar diferentes estados de pago
        const { status, status_detail, id } = paymentResponse;

        if (status === 'approved') {
            // Pago aprobado
            console.log('Pago aprobado');
            return NextResponse.json({ 
                status, 
                status_detail, 
                id,
                message: 'El pago ha sido aprobado.'
            });
        } else if (status === 'in_process') {
            // Pago en proceso
            console.log('Pago en proceso');
            return NextResponse.json({ 
                status, 
                status_detail, 
                id,
                message: 'El pago está en proceso. Por favor, espere a que se complete la revisión.'
            });
        } else {
            // Otros estados de pago
            console.log('Pago no aprobado');
            return NextResponse.json({ 
                status, 
                status_detail, 
                id,
                message: 'El pago no fue aprobado. Por favor, intente nuevamente.'
            });
        }
    } catch (error: any) {
        console.error('Hubo un error al procesar la solicitud: ', error);
        return NextResponse.json({
            error: 'Hubo un error al procesar la solicitud.',
            details: error.message
        }, {
            status: 500
        });
    }
}