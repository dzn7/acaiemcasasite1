// ATENÇÃO: SUBSTITUA TODO O CONTEÚDO DO SEU ARQUIVO thank-you-script.js POR ESTE

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona um tempo para o usuário ver a mensagem antes de redirecionar
    setTimeout(() => {
        sendWhatsAppMessage();
    }, 4000); // 4 segundos de espera
});

function sendWhatsAppMessage() {
    const fullOrderDetailsString = localStorage.getItem('fullOrderDetails');
    if (!fullOrderDetailsString) {
        alert("Ops! Não encontramos os detalhes do seu pedido para enviar.");
        // Redireciona de volta para a página inicial se não houver dados
        window.location.href = '/'; 
        return;
    }

    try {
        const orderDetails = JSON.parse(fullOrderDetailsString);
        const whatsappNumber = "558699127297"; // CONFIRA SE ESTE É O SEU NÚMERO

        // --- INÍCIO DA NOVA LÓGICA DE MONTAGEM DA MENSAGEM ---
        let whatsappMessage = `Olá! 👋 *Pedido de:*\n${orderDetails.customerName}\n\n*Meu pedido: 🛍️*`;

        // Loop para adicionar cada item de açaí com complementos categorizados
        if (orderDetails.items && orderDetails.items.length > 0) {
            orderDetails.items.forEach((item, index) => {
                const basePriceFormatted = `R$ ${item.basePrice.toFixed(2).replace('.', ',')}`;
                whatsappMessage += `\n\n*Açaí ${index + 1}:* ${item.name} - ${basePriceFormatted}`;

                const groupedComplements = {};
                item.complements.forEach(comp => {
                    if (!groupedComplements[comp.category]) {
                        groupedComplements[comp.category] = [];
                    }
                    let complementText = comp.name;
                    if (comp.price > 0) {
                        complementText += ` (+R$ ${comp.price.toFixed(2).replace('.', ',')})`;
                    }
                    groupedComplements[comp.category].push(complementText);
                });

                const categoryOrder = {
                    'gratis': 'Complementos Grátis',
                    'cobertura': 'Coberturas',
                    'creme': 'Cremes',
                    'adicional': 'Adicionais Pagos'
                };

                for (const categoryKey in categoryOrder) {
                    if (groupedComplements[categoryKey] && groupedComplements[categoryKey].length > 0) {
                        whatsappMessage += `\n  *${categoryOrder[categoryKey]}:*`;
                        groupedComplements[categoryKey].forEach(compName => {
                            whatsappMessage += `\n    - ${compName}`;
                        });
                    }
                }
            });
        }
        
        whatsappMessage += `\n\n----------------------------------`;

        // Adiciona informações de entrega
        if (orderDetails.deliveryOption.type === 'Entrega') {
            whatsappMessage += `\n*Taxa de Entrega: 🛵* R$ 2,00`;
            whatsappMessage += `\n*Endereço de Entrega: 📍* ${orderDetails.deliveryOption.address}`;
        } else {
            whatsappMessage += `\n*Opção: 🏪* Retirada no local`;
        }

        // Adiciona informações de pagamento
        whatsappMessage += `\n*Forma de Pagamento: 💰* ${orderDetails.paymentMethod}`;
        if (orderDetails.trocoPara && orderDetails.trocoPara > 0) {
            whatsappMessage += `\n  - *Levar troco para:* R$ ${orderDetails.trocoPara.toFixed(2).replace('.', ',')}`;
        }
        
        whatsappMessage += `\n----------------------------------`;
        whatsappMessage += `\n*Total do Pedido: 🧾* R$ ${orderDetails.total.toFixed(2).replace('.', ',')}`;

        // --- FIM DA NOVA LÓGICA ---

        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Limpa o localStorage para não reenviar o mesmo pedido
        localStorage.removeItem('cart');
        localStorage.removeItem('fullOrderDetails');

        // Redireciona o usuário para o WhatsApp
        window.location.href = whatsappLink;

    } catch (error) {
        console.error("Erro ao gerar mensagem para WhatsApp:", error);
        alert("Ocorreu um erro ao preparar seu pedido para o WhatsApp. Por favor, tente novamente.");
    }
}