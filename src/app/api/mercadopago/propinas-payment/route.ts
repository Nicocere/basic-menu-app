import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('Body:', body);
        const { products } = body;

        // Mapear productos para Mercado Pago
        const mappedProducts = products.map((product: {
            id: string;
            title: string;
            description?: string;
            quantity: number;
            unit_price: number;
        }) => {
            return {
                id: product.id.toString(),
                title: product.title,
                description: product.description || "Propina",
                quantity: product.quantity,
                unit_price: product.unit_price
            };
        });

        // Configurar cliente de Mercado Pago con la nueva API
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado en variables de entorno');
        }
        
        // Inicializar el cliente de Mercado Pago con la nueva API
        const client = new MercadoPagoConfig({ accessToken });
        const preferenceClient = new Preference(client);

        // Crear objeto de preferencia
        const preferenceData = {
            binary_mode: true,
            items: mappedProducts,
            back_urls: {
                success: `https://barapp.vercel.app/propinas/mp-pago-exitoso`, 
                failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pago-fallido`,
                pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pago-pendiente`,
            },
            auto_return: "approved" as "approved" | "all",
            metadata: {
                product_type: "propina"
            }
        };

        // Crear la preferencia con la nueva API
        const response = await preferenceClient.create({ body: preferenceData });
        
        // Devolver el ID de preferencia al frontend
        return NextResponse.json({ 
            preferenceId: response.id,
            initPoint: response.init_point
        });

    } catch (error) {
        console.error('Error al procesar la solicitud de pago:', error);
        return NextResponse.json(
            { error: 'Error al procesar el pago' },
            { status: 500 }
        );
    }
}