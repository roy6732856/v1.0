// config.js
const CONFIG = {
    // 表格配置
    TABLE: {
        height: "70vh",
        layout: "fitColumns",
        selectable: true,
        pagination: true,
        paginationSize: 20,
        columns: [
            { 
                title: "商品名稱", 
                field: "name", 
                width: "40%", // 使用百分比寬度
                minWidth: 150 // 設置最小寬度
            },
            { 
                title: "價格", 
                field: "price", 
                width: "20%",
                minWidth: 100,
                formatter: function(cell) {
                    return Utils.formatCurrency(cell.getValue());
                }
            },
            { 
                title: "PV", 
                field: "pv", 
                width: "20%",
                minWidth: 80,
                formatter: function(cell) {
                    return new Intl.NumberFormat('en-US').format(cell.getValue());
                }
            }
        ]
    },

    // 金額格式化
    CURRENCY: {
        locale: 'zh-TW',
        currency: 'TWD',
        prefix: 'NT$ ', // 添加前綴設定
        minimumFractionDigits: 0, // 設定小數位數為 0
        maximumFractionDigits: 0
    },

    // 購物車配置
    CART: {
        maxItems: 100,
        minQuantity: 1,
        maxQuantity: 999
    },

    // 過濾器配置
    FILTERS: {
        debounceTime: 300, // 搜尋延遲時間（毫秒）
        maxPrice: 999999,
        maxPV: 99999
    }
};

// 錯誤訊息
const ERROR_MESSAGES = {
    INVALID_QUANTITY: "請輸入有效的數量",
    MAX_ITEMS_EXCEEDED: "已達到最大商品數量限制",
    INVALID_PRICE_RANGE: "請輸入有效的價格範圍",
    INVALID_PV_RANGE: "請輸入有效的PV範圍"
};

// 事件名稱常量
const EVENTS = {
    CART_UPDATED: "cartUpdated",
    FILTERS_APPLIED: "filtersApplied",
    FILTERS_RESET: "filtersReset",
    TABLE_UPDATED: "tableUpdated"
};
