import { NextResponse } from 'next/server';
import { supabase } from '@/config/supabaseClient';

export async function POST(request: Request) {
  try {
    const { idPedido } = await request.json();
    
    console.log("Validando pedido:", idPedido);
    
    // Intentar parsear el idPedido, ya que podría ser un JSON stringificado
    let orderData;
    try {
      orderData = JSON.parse(idPedido);
    } catch (e) {
      // Si no es un JSON válido, asumimos que es un ID simple
      return NextResponse.json({
        estado: "error",
        mensaje: "Formato de QR inválido: No es un JSON válido"
      }, { status: 400 });
    }
    
    // Validar que tengamos un orderId
    if (!orderData.orderId) {
      return NextResponse.json({
        estado: "error",
        mensaje: "El código QR no contiene un ID de pedido válido"
      }, { status: 400 });
    }
    
    // Consultar la base de datos para verificar el pedido
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderData.orderId)
      .single();
    
    if (error || !data) {
      console.error('Error al buscar pedido:', error);
      return NextResponse.json({
        estado: "error",
        mensaje: "Pedido no encontrado en la base de datos"
      }, { status: 404 });
    }
    
    // Verificar si el pedido ya fue entregado
    if (data.delivered) {
      return NextResponse.json({
        estado: "advertencia",
        mensaje: "Este pedido ya fue marcado como entregado anteriormente",
        pedido: {
          numero: data.order_id,
          cliente: data.customer_name,
          telefono: data.customer_phone,
          mesa: data.table_number,
          retirar: data.pickup,
          total: data.total_amount,
          items: data.items,
          fecha: data.created_at,
          entregado: true
        }
      });
    }
    
    // Actualizar el pedido marcándolo como entregado
    const { error: updateError } = await supabase
      .from('orders')
      .update({ delivered: true })
      .eq('order_id', orderData.orderId);
    
    if (updateError) {
      console.error('Error al actualizar pedido:', updateError);
      return NextResponse.json({
        estado: "error",
        mensaje: "Error al marcar el pedido como entregado"
      }, { status: 500 });
    }
    
    // Pedido validado y actualizado correctamente
    return NextResponse.json({
      estado: "exitoso",
      mensaje: "Pedido validado y marcado como entregado",
      pedido: {
        numero: data.order_id,
        cliente: data.customer_name,
        telefono: data.customer_phone,
        mesa: data.table_number,
        retirar: data.pickup,
        total: data.total_amount,
        items: data.items,
        fecha: data.created_at,
        entregado: true
      }
    });
    
  } catch (error) {
    console.error("Error al validar pedido:", error);
    return NextResponse.json({
      estado: "error",
      mensaje: "Error al procesar la validación del pedido"
    }, { status: 500 });
  }
}