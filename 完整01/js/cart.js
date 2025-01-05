// cart.js
class ShoppingCart {
    constructor() {
        this.items = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeCartToggle();
    }

    bindEvents() {
        // 購物車更新事件監聽
        document.addEventListener(EVENTS.CART_UPDATED, (e) => {
            this.updateCart(e.detail.items);
        });

        // 購物車開關按鈕事件
        const closeCartBtn = document.getElementById('closeCart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.toggleCart(false));
        }

        const cartToggleBtn = document.getElementById('cartToggle');
        if (cartToggleBtn) {
            cartToggleBtn.addEventListener('click', () => this.toggleCart(true));
        }

        // 監聽視窗大小變化
        window.addEventListener('resize', () => this.handleResponsiveDisplay());
    }

    initializeCartToggle() {
        // 初始化移動端 Modal
        const mobileCartModal = document.getElementById('mobileCartModal');
        if (mobileCartModal && !mobileCartModal.classList.contains('modal-initialized')) {
            new bootstrap.Modal(mobileCartModal);
            mobileCartModal.classList.add('modal-initialized');
        }

        // 初始化時執行一次響應式處理
        this.handleResponsiveDisplay();
    }

    handleResponsiveDisplay() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (window.innerWidth < 768) {
            // 移動端：隱藏側邊欄
            cartSidebar?.classList.remove('show');
        }
    }

    updateCart(items) {
        this.items = new Map(items.map(item => [item.id, item]));
        this.updateCartDisplay();
        this.updateTotals();
    }

    updateCartDisplay() {
        const cartItems = Array.from(this.items.values());
        const cartHTML = cartItems.map(item => this.createCartItemHTML(item)).join('');
        
        // 更新兩個容器的內容
        const desktopList = document.getElementById('selectedItemsList');
        const mobileList = document.getElementById('mobileSelectedItemsList');
        
        if (desktopList) desktopList.innerHTML = cartHTML;
        if (mobileList) mobileList.innerHTML = cartHTML;
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">
                            ${Utils.formatCurrency(item.price)} × ${item.quantity} = 
                            ${Utils.formatCurrency(item.price * item.quantity)}
                        </small>
                        <div class="text-muted">
                            PV: ${Utils.formatPV(item.pv)} × ${item.quantity} = ${Utils.formatPV(item.pv * item.quantity)} PV
                        </div>
                    </div>
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="cart.adjustQuantity('${item.id}', -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-success" 
                                onclick="cart.adjustQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    }

    adjustQuantity(productId, change) {
        const item = this.items.get(productId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity >= 0 && newQuantity <= CONFIG.CART.maxQuantity) {
                if (newQuantity === 0) {
                    this.items.delete(productId);
                } else {
                    this.items.set(productId, { ...item, quantity: newQuantity });
                }
                this.notifyCartUpdate();
            }
        }
    }

    updateTotals() {
        const cartItems = Array.from(this.items.values());
        const totals = Utils.calculateTotals(cartItems);
        Utils.updateStats(totals);
    }

    toggleCart(show) {
        if (window.innerWidth < 768) {
            // 移動端使用 Modal
            const mobileCartModal = document.getElementById('mobileCartModal');
            if (mobileCartModal) {
                const modal = bootstrap.Modal.getInstance(mobileCartModal) 
                    || new bootstrap.Modal(mobileCartModal);
                if (show) {
                    modal.show();
                } else {
                    modal.hide();
                }
            }
        } else {
            // 桌面端使用側邊欄
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                if (show) {
                    cartSidebar.classList.add('show');
                } else {
                    cartSidebar.classList.remove('show');
                }
            }
        }
    }

    notifyCartUpdate() {
        const event = new CustomEvent(EVENTS.CART_UPDATED, {
            detail: { items: Array.from(this.items.values()) }
        });
        document.dispatchEvent(event);
    }
}


