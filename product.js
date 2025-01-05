// products.js
const PRODUCTS = [
    {
        id: "P001",
        name: "基礎保養組合",
        price: 3600,
        pv: 100
    },
    {
        id: "P002",
        name: "進階保養組合",
        price: 4800,
        pv: 150
    },
    {
        id: "P003",
        name: "專業保養組合",
        price: 6000,
        pv: 200
    },
    // ... 可以繼續添加更多產品
];

// 產品查詢函數
const ProductService = {
    // 獲取所有產品
    getAllProducts: () => PRODUCTS,

    // 根據 ID 獲取產品
    getProductById: (id) => PRODUCTS.find(p => p.id === id),

    // 過濾產品
    filterProducts: (filters) => {
        return PRODUCTS.filter(product => {
            // 關鍵字過濾
            if (filters.keyword && !product.name.includes(filters.keyword)) {
                return false;
            }

            // 價格範圍過濾
            if (filters.minPrice && product.price < filters.minPrice) {
                return false;
            }
            if (filters.maxPrice && product.price > filters.maxPrice) {
                return false;
            }

            // PV範圍過濾
            if (filters.minPV && product.pv < filters.minPV) {
                return false;
            }
            if (filters.maxPV && product.pv > filters.maxPV) {
                return false;
            }
            

            return true;
        });
    },
    
    // 排序產品
    sortProducts: (products, sortField, sortDirection) => {
        return [...products].sort((a, b) => {
            if (sortDirection === "asc") {
                return a[sortField] > b[sortField] ? 1 : -1;
            } else {
                return a[sortField] < b[sortField] ? 1 : -1;
            }
        });
    }
};
