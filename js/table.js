// table.js
class ProductTable {
    constructor() {
        this.table = null;
        this.selectedProducts = new Map();
        this.init();
        this.bindEvents(); // 添加這行
    }

    bindEvents() {
        // 監聽購物車更新事件
        document.addEventListener(EVENTS.CART_UPDATED, (e) => {
            // 更新本地的 selectedProducts
            this.selectedProducts = new Map(e.detail.items.map(item => [item.id, item]));
            
            // 更新表格顯示
            e.detail.items.forEach(item => {
                const row = this.table.getRow(item.id);
                if (row) {
                    // 強制重新渲染操作列
                    row.reformat();
                }
            });

            // 處理被移除的商品
            Array.from(this.selectedProducts.keys()).forEach(productId => {
                if (!e.detail.items.find(item => item.id === productId)) {
                    const row = this.table.getRow(productId);
                    if (row) {
                        row.reformat();
                    }
                }
            });
        });
    }

    init() {
        this.table = new Tabulator("#productTable", {
            ...CONFIG.TABLE,
            data: PRODUCTS,
            rowClick: (e, row) => this.handleRowClick(e, row),
            columns: [
                ...CONFIG.TABLE.columns,
                {
                    title: "操作",
                    width: "20%",
                    minWidth: 120, // 確保最小寬度
                    responsive: 0, // 保證在響應式布局中始終顯示
                    formatter: (cell) => {
                        const row = cell.getRow();
                        const data = row.getData();
                        const quantity = this.selectedProducts.get(data.id)?.quantity || 0;
                        return `
                            <div class="quantity-control-wrapper">
                                <div class="d-flex align-items-center justify-content-start gap-2">
                                    <button class="btn btn-sm btn-danger quantity-btn decrease">-</button>
                                    <span class="quantity-display">${quantity}</span>
                                    <button class="btn btn-sm btn-success quantity-btn increase">+</button>
                                </div>
                            </div>
                        `;
                    },
                    cellClick: (e, cell) => {
                        const target = e.target;
                        if (!target.classList.contains('quantity-btn')) {
                            return;
                        }
                
                        const row = cell.getRow();
                        const data = row.getData();
                        
                        if (target.classList.contains('increase')) {
                            this.updateQuantity(data, 1);
                        } else if (target.classList.contains('decrease')) {
                            this.updateQuantity(data, -1);
                        }
                    }
                    
                }
            ]
        });
    }

    updateQuantity(product, change) {
        const currentItem = this.selectedProducts.get(product.id);
        const currentQuantity = currentItem ? currentItem.quantity : 0;
        const newQuantity = Math.max(0, Math.min(currentQuantity + change, CONFIG.CART.maxQuantity));
    
        if (newQuantity === 0) {
            this.selectedProducts.delete(product.id);
        } else {
            this.selectedProducts.set(product.id, {
                ...product,
                quantity: newQuantity
            });
        }
    
        // 獲取行和單元格
        const row = this.table.getRow(product.id);
        if (row) {
            // 強制重新渲染操作列
            row.reformat();
            // 或者只重新渲染特定的單元格
            const cell = row.getCell("操作");
            if (cell) {
                cell.reformat();
            }
        }
    
        // 更新總計
        this.notifyCartUpdate();
    }

    updateTableDisplay() {
        this.table.redraw(true);
    }

    notifyCartUpdate() {
        const cartItems = Array.from(this.selectedProducts.values());
        const event = new CustomEvent(EVENTS.CART_UPDATED, {
            detail: { items: cartItems }
        });
        document.dispatchEvent(event);
    }

    applyFilters(filters) {
        const filteredData = ProductService.filterProducts(filters);
        this.table.setData(filteredData);
    }

    resetFilters() {
        this.table.setData(PRODUCTS);
    }

    getSelectedProducts() {
        return Array.from(this.selectedProducts.values());
    }
}
