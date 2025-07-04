// src/simple-script.js

// Definições de Produtos e Complementos
const products = {
    tigela300: { name: 'Tigela de 300ml', price: 15, complements: 4 },
    tigela400: { name: 'Tigela de 400ml', price: 19, complements: 4 },
    tigela700: { name: 'Tigela de 700ml', price: 35, complements: 7 },
    copo250: { name: 'Copo de 250ml', price: 12, complements: 4 },
    copo300: { name: 'Copo de 300ml', price: 14, complements: 4 },
    copo400: { name: 'Copo de 400ml', price: 18, complements: 4 },
    barcaP: { name: 'Barca Pequena', price: 35, complements: 0 },
    barcaG: { name: 'Barca Grande', price: 65, complements: 0 }
};

const complements = {
    leite_po: { name: 'Leite em pó', price: 0, category: 'gratis' },
    castanha: { name: 'Castanha', price: 0, category: 'gratis' },
    amendoim: { name: 'Amendoim', price: 0, category: 'gratis' },
    granola: { name: 'Granola', price: 0, category: 'gratis' },
    sucrilhos: { name: 'Sucrilhos', price: 0, category: 'gratis' },
    tapioca: { name: 'Tapioca', price: 0, category: 'gratis' },
    pacoca: { name: 'Paçoca', price: 0, category: 'gratis' },
    cereja: { name: 'Cereja', price: 0, category: 'gratis' },
    choco_power: { name: 'Choco Power', price: 0, category: 'gratis' },
    flocos_arroz: { name: 'Flocos de arroz', price: 0, category: 'gratis' },
    marshmallow: { name: 'Marshmallow', price: 0, category: 'gratis' },
    jujuba: { name: 'Jujuba', price: 0, category: 'gratis' },
    mm: { name: 'M&M', price: 0, category: 'gratis' },
    bolacha: { name: 'Bolacha', price: 0, category: 'gratis' },
    bolacha_trit: { name: 'Bolacha (triturado)', price: 0, category: 'gratis' },
    bolacha_triunfo: { name: 'Bolacha (Triunfo)', price: 0, category: 'gratis' },
    chocolate_trit: { name: 'Chocolate (triturado)', price: 0, category: 'gratis' },
    granulado: { name: 'Granulado', price: 0, category: 'gratis' },
    banana: { name: 'Banana', price: 0, category: 'gratis' },
    uva: { name: 'Uva', price: 0, category: 'gratis' },
    cob_chocolate: { name: 'Chocolate', price: 0, category: 'cobertura' },
    cob_morango: { name: 'Morango', price: 0, category: 'cobertura' },
    cob_caramelo: { name: 'Caramelo', price: 0, category: 'cobertura' },
    cob_uva: { name: 'Uva', price: 0, category: 'cobertura' },
    cob_abacaxi: { name: 'Abacaxi', price: 0, category: 'cobertura' },
    leite_condensado: { name: 'Leite condensado', price: 0, category: 'cobertura' },
    cob_kiwi: { name: 'Kiwi', price: 0, category: 'cobertura' },
    nutella: { name: 'Nutella', price: 2, category: 'adicional' },
    doce_leite: { name: 'Doce de leite', price: 2, category: 'adicional' },
    kiwi: { name: 'Kiwi', price: 2, category: 'adicional' },
    creme_ninho: { name: 'Ninho', price: 2, category: 'creme' },
    creme_bacuri: { name: 'Bacuri', price: 2, category: 'creme' },
    creme_maracuja: { name: 'Maracujá', price: 2, category: 'creme' }
};

// Variáveis de estado do carrinho e seleção
let selectedProduct = null;
let selectedComplements = new Set();
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let complementsScrollListener = null;

// =========================================================
// VARIÁVEIS GLOBAIS DE ELEMENTOS
// =========================================================
const customerNameInput = document.getElementById('customer-name');
const deliveryCheckbox = document.getElementById('delivery-checkbox');
const pickupCheckbox = document.getElementById('pickup-checkbox');
const deliveryAddressSection = document.getElementById('delivery-address-section');
const deliveryAddressInput = document.getElementById('delivery-address');
const trocoSection = document.getElementById('troco-section');
const trocoValueInput = document.getElementById('troco-value');
const emailPhoneFields = document.getElementById('email-phone-fields');
const mainConfirmBtn = document.getElementById('confirm-all-btn');
const modalConfirmBtn = document.querySelector('#cart-modal-content .confirm-order');


// =========================================================
// FUNÇÕES PARA O POP-UP DE ALERTA PERSONALIZADO (Modificada para debug)
// =========================================================
function showCustomAlert(message, type = '') {
    console.log("showCustomAlert called with message:", message, "type:", type); // Debug
    const alertOverlay = document.getElementById('custom-alert-overlay');
    const alertBox = document.getElementById('custom-alert-box'); // Captura a caixa do alerta
    const alertMessage = document.getElementById('custom-alert-message');
    
    if (alertOverlay && alertMessage && alertBox) {
        alertMessage.textContent = message;
        alertOverlay.classList.add('is-visible');
        document.body.classList.add('modal-open'); // Mantém o body sem scroll

        // Adiciona/remove a classe 'error' para estilização vermelha
        if (type === 'error') {
            alertBox.classList.add('error');
        } else {
            alertBox.classList.remove('error');
        }
        console.log("Custom alert should be visible now."); // Debug
    } else {
        console.error("Custom alert elements not found in DOM! Check index.html for #custom-alert-overlay, #custom-alert-box, #custom-alert-message."); // Debug: Crucial se o HTML estiver errado
    }
}

function closeCustomAlert() {
    console.log("closeCustomAlert called."); // Debug
    const alertOverlay = document.getElementById('custom-alert-overlay');
    const alertBox = document.getElementById('custom-alert-box');
    if (alertOverlay && alertBox) {
        alertOverlay.classList.remove('is-visible');
        alertBox.classList.remove('error');
        
        // A lógica de remoção de 'modal-open' foi movida para toggleModal,
        // para gerenciar múltiplos modais corretamente.
        // É importante que `toggleModal` saiba se *outros* modais estão abertos.
        // Esta função apenas fecha o alerta personalizado.
        
        // Chame toggleModal para garantir que modal-open seja removido apenas se não houver outros modais
        toggleModal('custom-alert-overlay', false); 
        console.log("Custom alert should be hidden now."); // Debug
    } else {
        console.warn("Custom alert elements not found when trying to close."); // Debug
    }
}

// =========================================================
// FUNÇÕES PARA DESTAQUE E TREMOR (Modificada para debug)
// =========================================================

function highlightField(elementId) {
    console.log("highlightField called for:", elementId); // Debug
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('highlight-error');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log("Element highlighted and scrolled:", elementId); // Debug
    } else {
        console.warn(`Elemento com ID '${elementId}' não encontrado para destaque.`); // Debug: se o ID estiver errado
    }
}

function removeHighlightField(elementId) {
    // console.log("removeHighlightField called for:", elementId); // Debug (muito verbose)
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('highlight-error');
        const parentLabel = document.querySelector(`label[for="${elementId}"]`);
        if (parentLabel) parentLabel.classList.remove('highlight-error');
        const parentDiv = element.closest('.payment-options') || element.closest('.delivery-options-wrapper') || element.closest('.payment-mode-group') || element.closest('#main-payment-choice-section');
        if (parentDiv) parentDiv.classList.remove('highlight-error');
    }
}

function shakeButton(buttonElement) {
    console.log("shakeButton called for:", buttonElement ? buttonElement.id || buttonElement.className : 'null'); // Debug
    if (buttonElement) {
        buttonElement.classList.add('shake-animation');
        buttonElement.addEventListener('animationend', () => {
            buttonElement.classList.remove('shake-animation');
        }, { once: true });
    }
}


// --- FUNÇÕES GERAIS PARA MODAIS (Refinada para gerenciar modal-open com mais de um modal) ---
function toggleModal(modalId, show) {
    console.log(`toggleModal called for ${modalId}, show: ${show}`); // Debug
    const modalOverlay = document.getElementById(modalId);
    if (modalOverlay) {
        if (show) {
            modalOverlay.classList.add('is-visible');
            document.body.classList.add('modal-open'); // Sempre adiciona quando mostra um modal
        } else {
            modalOverlay.classList.remove('is-visible');
            // Remove 'modal-open' do body APENAS se nenhum outro modal estiver visível.
            // Verifica todos os overlays conhecidos.
            const cartModal = document.getElementById('cart-modal-overlay');
            const complementsModal = document.getElementById('complements-modal-overlay');
            const customAlert = document.getElementById('custom-alert-overlay'); // O pop-up de alerta é um tipo de modal

            const anyOtherModalStillVisible = 
                (cartModal && cartModal.classList.contains('is-visible')) ||
                (complementsModal && complementsModal.classList.contains('is-visible')) ||
                (customAlert && customAlert.classList.contains('is-visible'));

            if (!anyOtherModalStillVisible) {
                document.body.classList.remove('modal-open');
            }
        }
    }
}

// --- FUNÇÕES DO MODAL DO CARRINHO ---
function openCartModal() {
    console.log("openCartModal called."); // Debug
    renderModalCart();
    toggleModal('cart-modal-overlay', true);
}

function closeCartModal() {
    console.log("closeCartModal called."); // Debug
    toggleModal('cart-modal-overlay', false);
}

// --- FUNÇÕES DO MODAL DE COMPLEMENTOS ---
function checkComplementsScrollPosition() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    const actionButtons = document.querySelector('.complement-modal-actions');
    if (!scrollArea || !actionButtons) return;

    if (scrollArea.scrollHeight <= scrollArea.clientHeight) {
        actionButtons.classList.add('is-scrolled-to-bottom');
        return;
    }
    const scrolledToBottom = (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 5);
    if (scrolledToBottom) {
        actionButtons.classList.add('is-scrolled-to-bottom');
    } else {
        actionButtons.classList.remove('is-scrolled-to-bottom');
    }
}

function setupComplementsModalScrollListener() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    if (scrollArea) {
        if (complementsScrollListener) {
            scrollArea.removeEventListener('scroll', complementsScrollListener);
        }
        complementsScrollListener = checkComplementsScrollPosition;
        scrollArea.addEventListener('scroll', complementsScrollListener);
        checkComplementsScrollPosition();
    }
}

function cleanupComplementsModalScrollListener() {
    const scrollArea = document.querySelector('.complements-scroll-area');
    const actionButtons = document.querySelector('.complement-modal-actions');
    if (scrollArea && complementsScrollListener) {
        scrollArea.removeEventListener('scroll', complementsScrollListener);
        complementsScrollListener = null;
    }
    if (actionButtons) {
        actionButtons.classList.remove('is-scrolled-to-bottom');
    }
}

function openComplementsModal() {
    console.log("openComplementsModal called."); // Debug

    // LIMPA TODOS OS CHECKBOXES DE COMPLEMENTOS VISUALMENTE
    document.querySelectorAll('input[data-complement-id]').forEach(input => {
        input.checked = false;
    });

    // LIMPA CLASSES SELECIONADAS VISUALMENTE (caso use botões ao invés de checkbox)
    document.querySelectorAll('.select-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });

    selectedComplements.clear(); // LIMPA O ESTADO INTERNO TAMBÉM

    toggleModal('complements-modal-overlay', true);

    const product = products[selectedProduct];
    if (product && product.complements > 0) {
        document.getElementById('complement-limit-info-modal').innerText = `Escolha até ${product.complements} complementos grátis`;
    } else {
        document.getElementById('complement-limit-info-modal').innerText = `Sem complementos grátis para este item.`;
    }

    setTimeout(setupComplementsModalScrollListener, 100);
}

function closeComplementsModal() {
    console.log("closeComplementsModal called."); // Debug
    toggleModal('complements-modal-overlay', false);
    cleanupComplementsModalScrollListener();
}

// --- LÓGICA DE SELEÇÃO E ADIÇÃO DE PRODUTOS/COMPLEMENTOS ---
function selectProduct(productId) {
    console.log("selectProduct called for:", productId); // Debug
    const productInfo = products[productId];
    if (!productInfo) {
        console.error("Produto não encontrado:", productId);
        return;
    }

    if (productInfo.complements === 0) {
        cart.push({
            productId: productId,
            complements: [] 
        });
        saveCart();
        updateTotal();
        updateCartCount();
        openCartModal();
    } else {
        selectedProduct = productId;
        selectedComplements.clear();
        openComplementsModal();
    }
}

// toggleComplement - Modificada para usar showCustomAlert com tipo 'error' E CORRIGIDO Array.from
function toggleComplement(id, checked) {
    console.log(`toggleComplement called for ${id}, checked: ${checked}`); // Debug
    if (!selectedProduct) return;
    const product = products[selectedProduct];
    const comp = complements[id];
    if (checked) {
        if (comp.category === 'gratis') {
            const current = Array.from(selectedComplements).filter(cid => complements[cid].category === 'gratis');
            if (current.length >= product.complements) {
                showCustomAlert(`Só pode escolher até ${product.complements} complementos grátis.`, 'error');
                document.getElementById(id).checked = false;
                return;
            }
        }
        if (comp.category === 'cobertura') {
            const has = Array.from(selectedComplements).some(cid => complements[cid].category === 'cobertura');
            if (has) {
                showCustomAlert('Você só pode escolher uma cobertura.', 'error');
                document.getElementById(id).checked = false;
                return;
            }
        }
        selectedComplements.add(id);
    } else {
        selectedComplements.delete(id);
    }
}

function confirmComplementsAndAddToCart() {
    console.log("confirmComplementsAndAddToCart called."); // Debug
    if (!selectedProduct) {
        console.error("Nenhum produto selecionado para adicionar ao carrinho.");
        return; 
    }

    const cartItem = {
        productId: selectedProduct,
        complements: Array.from(selectedComplements)
    };

    cart.push(cartItem);
    saveCart();
    updateTotal();
    updateCartCount();
    closeComplementsModal();
}

function cancelComplementsSelection() {
    console.log("cancelComplementsSelection called."); // Debug
    selectedProduct = null;
    selectedComplements.clear();
    document.querySelectorAll('input[data-complement-id]').forEach(input => input.checked = false);
    document.querySelectorAll('.select-btn.selected').forEach(btn => btn.classList.remove('selected'));
    closeComplementsModal();
}

// --- PERSISTÊNCIA DO CARRINHO NO LOCALSTORAGE ---
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// --- FUNÇÕES DE RENDERIZAÇÃO E ATUALIZAÇÃO DE TOTAIS ---
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
        cartCountEl.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

function updateModalTotal() {
    const modalTotalEl = document.getElementById('modal-total-price');
    if (!modalTotalEl) return;
    let total = 0; // Variável local para o total do modal
    cart.forEach(item => {
        const product = products[item.productId]; // Obtém o produto correto
        if (product) {
            total += product.price;
            item.complements.forEach(id => {
                if (complements[id]) {
                    total += complements[id].price; // Adiciona ao total do modal
                }
            });
        } else {
            console.warn("Produto no carrinho não encontrado na lista de produtos para o modal:", item.productId);
        }
    });
    modalTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function renderCart() {
    validateOrder(false);
    updateCartCount();
}

function renderModalCart() {
    const list = document.getElementById('cart-modal-list');
    if (!list) return;
    list.innerHTML = "";

    if (cart.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Seu carrinho está vazio.";
        li.style.textAlign = "center";
        li.style.fontStyle = "italic";
        li.style.color = "#888";
        li.style.borderBottom = "none";
        list.appendChild(li);
    } else {
        cart.forEach((item, index) => {
            const product = products[item.productId]; // Obtém o produto correto
            if (!product) {
                console.error("Produto no carrinho não encontrado na lista de produtos para renderização:", item.productId);
                return;
            }
            let complementsTotalPrice = 0;
            const complementNames = item.complements.map(id => {
                const compInfo = complements[id]; // Obtém as informações do complemento
                if (compInfo) {
                    complementsTotalPrice += compInfo.price;
                    return compInfo.name;
                }
                return '';
            }).filter(Boolean).join(", ");
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap;">
                    <span>${product.name}</span>
                    <span style="font-weight: bold;">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button class="remove-item-btn" data-index="${index}" onclick="removeItemFromCart(${index})">X</button>
                </div>
                ${complementNames ? `<small style="flex-basis: 100%; font-size: 0.85em; color: #555;">+ Complementos: ${complementNames}</small>` : ''}
            `;
            list.appendChild(li);
        });
    }
    updateModalTotal();
}

// --- FUNÇÃO PARA REMOVER ITEM DO CARRINHO ---
function removeItemFromCart(index) {
    console.log("removeItemFromCart called."); // Debug
    cart.splice(index, 1);
    saveCart();
    updateTotal();
    updateCartCount();
    renderModalCart();
    validateOrder(false);
}

// --- FUNÇÃO ATUALIZADA DO TOTAL GERAL (CORRIGIDA) ---
function updateTotal() {
    let currentTotal = 0; // Variável para o total geral

    cart.forEach(item => {
        const product = products[item.productId]; // Obtém o produto correto
        if (product) {
            currentTotal += product.price; // Acumula no currentTotal
            item.complements.forEach(id => {
                const compInfo = complements[id]; // Obtém as informações do complemento
                if (compInfo) {
                    currentTotal += compInfo.price; // CORREÇÃO AQUI: Usa currentTotal
                }
            });
        } else {
            console.warn("Produto no carrinho (via item.productId) não encontrado na lista de produtos para updateTotal:", item.productId);
        }
    });

    if (document.getElementById('delivery-checkbox')?.checked) {
        currentTotal += 2;
    }

    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `R$ ${currentTotal.toFixed(2).replace('.', ',')}`;
    }
    
    updateModalTotal(); 
}

// --- FUNÇÕES DE ENTREGA E PAGAMENTO ---
function handleDeliveryChange(checkbox) {
    console.log("handleDeliveryChange called, checked:", checkbox.checked); // Debug
    if (checkbox.checked) {
        if (pickupCheckbox) pickupCheckbox.checked = false;
        if (deliveryAddressSection) {
            deliveryAddressSection.style.display = 'block';
            if (deliveryAddressInput) {
                deliveryAddressInput.removeEventListener('input', updateUI); 
                deliveryAddressInput.addEventListener('input', updateUI);
            }
        }
    } else {
        if (deliveryAddressSection) {
            deliveryAddressSection.style.display = 'none';
            if (deliveryAddressInput) {
                deliveryAddressInput.removeEventListener('input', updateUI);
            }
        }
    }
    updateUI(); 
    removeHighlightField('delivery-options-wrapper');
    removeHighlightField('delivery-address');
}

function handlePickupChange(checkbox) {
    console.log("handlePickupChange called, checked:", checkbox.checked); // Debug
    if (checkbox.checked) {
        if (deliveryCheckbox) deliveryCheckbox.checked = false;
        if (deliveryAddressSection) {
            deliveryAddressSection.style.display = 'none';
            if (deliveryAddressInput) {
                deliveryAddressInput.removeEventListener('input', updateUI);
            }
        }
    }
    updateUI(); 
    removeHighlightField('delivery-options-wrapper');
    removeHighlightField('delivery-address');
}

function selectPaymentMethod(method) {
    console.log("selectPaymentMethod called for:", method); // Debug
    document.querySelectorAll('.payment-card').forEach(el => {
        el.classList.remove('selected');
    });

    const clickedCard = document.querySelector(`.payment-card[data-method="${method}"]`);
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }

    const radioInput = document.querySelector(`input[name="payment"][value="${method}"]`);
    if (radioInput) {
        radioInput.checked = true;
    }

    if (trocoSection) {
        trocoSection.style.display = method === "whatsapp-especie" ? "block" : "none";
    }

    if (emailPhoneFields) {
        if (method === 'online-pix') {
            emailPhoneFields.style.display = 'block';
        } else {
            emailPhoneFields.style.display = 'none';
            const customerEmailInput = document.getElementById('customer-email');
            const customerPhoneInput = document.getElementById('customer-phone');
            if (customerEmailInput) customerEmailInput.value = '';
            if (customerPhoneInput) customerPhoneInput.value = '';
        }
    }

    removeHighlightField('main-payment-choice-section');
    removeHighlightField('troco-value');

    updateTotal();
    validateOrder(false);
    updatePaymentSelectionVisual();
}

// highlightField - Já foi modificada na seção de "Funções para Destaque e Tremor" acima.

function validateOrder(shouldHighlight = true) {
    // console.log("validateOrder called, shouldHighlight:", shouldHighlight); // Debug (muito verbose)
    let isValid = true;
    let firstInvalidElement = null;

    if (shouldHighlight) {
        document.querySelectorAll('.highlight-error').forEach(el => el.classList.remove('highlight-error'));
    }
    if(mainConfirmBtn) mainConfirmBtn.classList.remove('shake-animation');
    if(modalConfirmBtn) modalConfirmBtn.classList.remove('shake-animation');


    if (cart.length === 0) {
        isValid = false;
    }

    if (!customerNameInput?.value.trim()) {
        isValid = false;
        if (shouldHighlight) {
            highlightField('customer-name');
            firstInvalidElement ||= customerNameInput;
        }
    }

    if (!deliveryCheckbox?.checked && !pickupCheckbox?.checked) {
        isValid = false;
        const wrapper = document.querySelector('.delivery-options-wrapper');
        if (shouldHighlight && wrapper) {
            highlightField('delivery-options-wrapper');
            firstInvalidElement ||= wrapper;
        }
    }

    if (deliveryCheckbox?.checked && !deliveryAddressInput?.value.trim()) {
        isValid = false;
        if (shouldHighlight) {
            highlightField('delivery-address');
            firstInvalidElement ||= deliveryAddressInput;
        }
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        isValid = false;
        const paymentWrapper = document.getElementById('main-payment-choice-section');
        if (shouldHighlight && paymentWrapper) {
            highlightField('main-payment-choice-section');
            firstInvalidElement ||= paymentWrapper;
        }
    }

    if (shouldHighlight && firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // REMOVIDAS AS LINHAS QUE DESABILITAVAM OS BOTÕES (mantidas removidas)
    // if (mainConfirmBtn) mainConfirmBtn.disabled = !isValid;
    // if (modalConfirmBtn) modalConfirmBtn.disabled = !isValid;

    return isValid;
}


// --- FUNÇÃO FINAL DE CONFIRMAÇÃO E ENVIO DO PEDIDO (Corrigida e Aprimorada) ---
// ATENÇÃO: SUBSTITUA A SUA FUNÇÃO `confirmAllOrders` INTEIRA POR ESTA

async function confirmAllOrders() {
    console.log("confirmAllOrders called!");
    // Remove todos os destaques de erro antes de validar novamente
    removeHighlightField('customer-name');
    removeHighlightField('delivery-options-wrapper');
    removeHighlightField('delivery-address');
    removeHighlightField('main-payment-choice-section');
    removeHighlightField('troco-value');
    if(mainConfirmBtn) mainConfirmBtn.classList.remove('shake-animation');
    if(modalConfirmBtn) modalConfirmBtn.classList.remove('shake-animation');

    updateTotal();
    
    let errorMessage = "";
    let fieldToHighlightId = "";
    let buttonToShake = null;
    const cartModalOverlayElement = document.getElementById('cart-modal-overlay');
    const cartModalIsVisible = cartModalOverlayElement && cartModalOverlayElement.classList.contains('is-visible');

    if (cartModalIsVisible) {
        buttonToShake = modalConfirmBtn;
    } else {
        buttonToShake = mainConfirmBtn;
    }

    // Validações (sem alterações aqui)
    if (cart.length === 0) {
        errorMessage = "Seu carrinho está vazio! Adicione itens antes de enviar.";
        fieldToHighlightId = 'cart-icon';
    } else if (!customerNameInput.value.trim()) {
        errorMessage = "Por favor, digite seu nome para continuar.";
        fieldToHighlightId = 'customer-name';
    } else if (!deliveryCheckbox.checked && !pickupCheckbox.checked) {
        errorMessage = "Por favor, selecione uma opção de entrega ou retirada.";
        fieldToHighlightId = 'delivery-options-wrapper';
    } else if (deliveryCheckbox.checked && !deliveryAddressInput.value.trim()) {
        errorMessage = "Por favor, preencha o endereço de entrega.";
        fieldToHighlightId = 'delivery-address';
    } else {
        const selectedPaymentRadio = document.querySelector('input[name="payment"]:checked');
        if (!selectedPaymentRadio) {
            errorMessage = "Por favor, selecione uma forma de pagamento.";
            fieldToHighlightId = 'main-payment-choice-section';
        } else if (selectedPaymentRadio.value === 'whatsapp-especie' && trocoValueInput.value.trim() !== '') {
            const totalPedidoElement = document.getElementById("total-price");
            let totalPedido = parseFloat(totalPedidoElement.innerText.replace('R$ ', '').replace(',', '.'));
            const trocoPara = parseFloat(trocoValueInput.value.replace(',', '.'));
            if (isNaN(trocoPara) || trocoPara < totalPedido) {
                errorMessage = "O valor do troco não pode ser menor que o total do pedido ou inválido.";
                fieldToHighlightId = 'troco-value';
            }
        }
    }

    if (errorMessage) {
        if (cartModalIsVisible) {
            closeCartModal();
            if (fieldToHighlightId) highlightField(fieldToHighlightId);
        } else {
            if (fieldToHighlightId) highlightField(fieldToHighlightId);
        }
        showCustomAlert(errorMessage, 'error');
        if (buttonToShake) shakeButton(buttonToShake);
        return;
    }

    console.log("All validations passed. Proceeding to save order details.");

    // --- INÍCIO DA PARTE MODIFICADA ---
    
    // Captura os dados do formulário
    const customerName = customerNameInput?.value.trim() || '';
    const deliveryType = deliveryCheckbox?.checked ? 'Entrega' : 'Retirada';
    const deliveryAddress = deliveryAddressInput?.value.trim();
    const paymentMethodRadio = document.querySelector('input[name="payment"]:checked');
    const paymentMethodValue = paymentMethodRadio ? paymentMethodRadio.value : 'N/A';
    const totalValue = parseFloat(document.getElementById('total-price').innerText.replace('R$ ', '').replace(',', '.')) || 0;
    let trocoPara = 0;
    if (paymentMethodValue === 'whatsapp-especie' && trocoValueInput?.value) {
        trocoPara = parseFloat(trocoValueInput.value.replace(',', '.'));
    }

    // **MUDANÇA PRINCIPAL AQUI**
    // Gera uma lista de itens com dados de complementos estruturados para salvar
    const itemsWithStructuredComplements = cart.map(item => {
        const productInfo = products[item.productId];
        if (!productInfo) return null;

        const complementsData = item.complements.map(compId => {
            const comp = complements[compId];
            return comp ? { name: comp.name, price: comp.price, category: comp.category } : null;
        }).filter(Boolean); // Filtra complementos que não foram encontrados

        return {
            name: productInfo.name,
            basePrice: productInfo.price,
            complements: complementsData
        };
    }).filter(Boolean); // Filtra produtos que não foram encontrados

    // Monta o objeto final para ser salvo no localStorage
    const fullOrderDetails = {
        customerName: customerName,
        items: itemsWithStructuredComplements,
        total: totalValue,
        deliveryOption: {
            type: deliveryType,
            address: deliveryAddress
        },
        paymentMethod: {
            'whatsapp-pix': 'Pix',
            'whatsapp-especie': 'Dinheiro',
            'whatsapp-cartao': 'Cartão',
        }[paymentMethodValue],
        trocoPara: trocoPara
    };

    // Salva no localStorage para a página thank-you-pix usar
    localStorage.setItem('fullOrderDetails', JSON.stringify(fullOrderDetails));
    
    // Limpa o carrinho da página atual
    clearCart();

    // Redireciona para a página de carregamento
    window.location.href = 'thank-you-pix.html';
}

// --- FUNÇÃO LIMPAR TUDO (Aprimorada para remover destaques) ---
function clearCart() {
    console.log("clearCart called."); // Debug
    cart.length = 0;
    saveCart();

    if (customerNameInput) customerNameInput.value = '';
    if (deliveryAddressInput) deliveryAddressInput.value = '';
    if (document.getElementById('customer-email')) document.getElementById('customer-email').value = '';
    if (document.getElementById('customer-phone')) document.getElementById('customer-phone').value = '';
    if (trocoValueInput) trocoValueInput.value = '';
    
    if (deliveryCheckbox) deliveryCheckbox.checked = false;
    if (pickupCheckbox) pickupCheckbox.checked = false;
    document.querySelectorAll('input[name="payment"]').forEach(input => input.checked = false);

    if (deliveryAddressSection) deliveryAddressSection.style.display = 'none';
    if (trocoSection) trocoSection.style.display = 'none';
    if (emailPhoneFields) emailPhoneFields.style.display = 'none';

    removeHighlightField('customer-name');
    removeHighlightField('delivery-options-wrapper');
    removeHighlightField('delivery-address');
    removeHighlightField('main-payment-choice-section');
    removeHighlightField('troco-value');
    if (mainConfirmBtn) mainConfirmBtn.classList.remove('shake-animation');
    if (modalConfirmBtn) modalConfirmBtn.classList.remove('shake-animation');
    
    updateTotal();
    updateCartCount();
    renderModalCart();
    closeCartModal();
}

// --- FUNÇÃO DE PESQUISA DE COMPLEMENTOS ---
function filterComplements() {
    const input = document.getElementById('complement-search-input');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const complementCategories = document.querySelectorAll('.complement-category');

    complementCategories.forEach(category => {
        const complementItems = category.querySelectorAll('.complement-item');
        let categoryHasVisibleItems = false;

        complementItems.forEach(item => {
            const label = item.querySelector('label');
            const text = label.textContent || label.innerText;

            if (text.toLowerCase().includes(filter)) {
                item.style.display = "";
                categoryHasVisibleItems = true;
            } else {
                item.style.display = "none";
            }
        });

        const categoryTitle = category.querySelector('h4');
        if (categoryTitle) {
            if (categoryHasVisibleItems || filter === '') {
                categoryTitle.style.display = "";
            } else {
                categoryTitle.style.display = "none";
            }
        }
    });
}

// --- INICIALIZAÇÃO AO CARREGAR A PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired."); // Debug
    // O problema de abrir o WhatsApp na carga da página pode estar relacionado
    // a algum estado persistente no navegador ou outra parte do código/extensão.
    // O ideal é que confirmAllOrders SÓ seja chamado por um clique do usuário.
    // Se ainda assim ele for chamado, o problema não está no script que forneci.

    setTimeout(() => {
        cart = JSON.parse(localStorage.getItem('cart')) || [];

        updateTotal(); 
        updateCartCount();
        validateOrder(false); // Validar o estado inicial do botão de confirmação
        closeCartModal();
        closeComplementsModal();

        const cartModalOverlay = document.getElementById('cart-modal-overlay');
        if (cartModalOverlay) {
            cartModalOverlay.addEventListener('click', function (event) {
                if (event.target === cartModalOverlay) {
                    closeCartModal();
                }
            });
        }
        const complementsModalOverlay = document.getElementById('complements-modal-overlay');
        if (complementsModalOverlay) {
            complementsModalOverlay.addEventListener('click', function (event) {
                if (event.target === complementsModalOverlay) {
                    cancelComplementsSelection();
                }
            });
        }

        // LISTENERS PARA REMOVER DESTAQUES AO INTERAGIR E ATUALIZAR O TOTAL (CORRIGIDOS)
        customerNameInput?.addEventListener('input', () => { removeHighlightField('customer-name'); updateUI(); });
        deliveryAddressInput?.addEventListener('input', () => { removeHighlightField('delivery-address'); updateUI(); });
        trocoValueInput?.addEventListener('input', () => { removeHighlightField('troco-value'); updateUI(); });
        
        // Os handlers de change para checkboxes de entrega/retirada já chamam updateUI()
        // removeHighlightField para os wrappers de entrega/pagamento já é chamado dentro handleDeliveryChange/selectPaymentMethod

        document.querySelectorAll('.payment-card').forEach(card => {
            card.addEventListener('click', function() {
                const radio = this.querySelector('input[name="payment"]');
                if (radio && !radio.checked) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                } else if (radio && radio.checked) {
                    updatePaymentSelectionVisual();
                    validateOrder(false);
                }
                removeHighlightField('main-payment-choice-section');
            });
        });

        // CÓDIGO PARA ESCONDER O BANNER AO ROLAR
        const mobileBanner = document.getElementById('mobile-banner');
        const scrollThreshold = 150; 

        if (mobileBanner) {
            function handleBannerScroll() {
                if (window.scrollY > scrollThreshold) {
                    mobileBanner.classList.add('hidden');
                } else {
                    mobileBanner.classList.remove('hidden');
                }
            }
            window.addEventListener('scroll', handleBannerScroll);
            handleBannerScroll();
        }
    }, 100);
});
function updateUI() {
    console.log("updateUI chamada."); // Apenas para debug

    // Exemplo: atualizar botões de envio com base nos campos preenchidos
    validateOrder(false); // Atualiza visual sem dar erro
}

function updatePaymentSelectionVisual() {
    console.log("updatePaymentSelectionVisual chamada."); // Para debug

    document.querySelectorAll('.payment-card').forEach(card => {
        const input = card.querySelector('input[name="payment"]');
        if (input?.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}