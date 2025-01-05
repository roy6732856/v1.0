// main.js
let productTable;
let cart;
let filters;

// 初始化應用
function initializeApp() {
    // 初始化各個組件
    productTable = new ProductTable();
    cart = new ShoppingCart();
    filters = new ProductFilters();

    // 綁定全局事件
    bindGlobalEvents();

    // 初始化導出功能
    initializeExport();
}

// 綁定全局事件
function bindGlobalEvents() {
    // 過濾器事件
    document.addEventListener(EVENTS.FILTERS_APPLIED, (e) => {
        productTable.applyFilters(e.detail.filters);
    });

    document.addEventListener(EVENTS.FILTERS_RESET, () => {
        productTable.resetFilters();
    });

    // 視窗大小改變事件
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            const mobileModal = bootstrap.Modal.getInstance('#mobileCartModal');
            if (mobileModal) {
                mobileModal.hide();
            }
        }
    });
}

// 初始化導出功能
function initializeExport() {
    $('#exportBtn').click(() => {
        const items = productTable.getSelectedProducts();
        if (items.length > 0) {
            Utils.exportToCSV(items);
        } else {
            alert('請先選擇商品');
        }
    });
}

// 當 DOM 載入完成後初始化應用
$(document).ready(() => {
    initializeApp();
});

// 將必要的實例暴露到全局作用域
window.cart = cart;
