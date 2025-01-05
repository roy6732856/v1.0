// utils.js
const Utils = {
    // 金額格式化
    formatCurrency: (amount) => {
        const formattedNumber = Utils.formatNumber(amount, 0);
        return `${CONFIG.CURRENCY.prefix}${formattedNumber}`;
    },

    // 數字格式化
    formatNumber: (number, decimals = 0) => {
        return new Intl.NumberFormat(CONFIG.CURRENCY.locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    },

    // PV格式化
    formatPV(value) {
        return new Intl.NumberFormat('en-US').format(value);
    },

    // 防抖函數
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 驗證數量
    validateQuantity: (quantity) => {
        const num = parseInt(quantity);
        return !isNaN(num) && 
               num >= CONFIG.CART.minQuantity && 
               num <= CONFIG.CART.maxQuantity;
    },

    // 驗證價格範圍
    validatePriceRange: (min, max) => {
        if (min && max && parseFloat(min) > parseFloat(max)) {
            return false;
        }
        return true;
    },

    // 計算總計
    calculateTotals: (items) => {
        return items.reduce((acc, item) => {
            return {
                totalAmount: acc.totalAmount + (item.price * item.quantity),
                totalPV: acc.totalPV + (item.pv * item.quantity),
                itemCount: acc.itemCount + item.quantity
            };
        }, { totalAmount: 0, totalPV: 0, itemCount: 0 });
    },

    // 更新統計資訊顯示
    updateStats: (totals) => {
        $('#totalAmount').text(Utils.formatCurrency(totals.totalAmount));
        $('#totalPV').text(Utils.formatNumber(totals.totalPV));
        $('#itemCount').text(Utils.formatNumber(totals.itemCount));
        $('#cartCount').text(Utils.formatNumber(totals.itemCount));
    },

    // 導出為 CSV
    exportToCSV: (items) => {
        const headers = ['商品編號', '商品名稱', '數量', '單價', 'PV', '小計', 'PV小計'];
        const rows = items.map(item => [
            item.id,
            item.name,
            item.quantity,
            item.price,
            item.pv,
            item.price * item.quantity,
            item.pv * item.quantity
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `產品清單_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }
};
