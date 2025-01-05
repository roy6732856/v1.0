// filters.js
class ProductFilters {
    constructor() {
        this.currentFilters = {
            keyword: '',
            minPrice: '',
            maxPrice: '',
            minPV: '',
            maxPV: ''
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupDebounce();
    }

    bindEvents() {
        $('#searchInput').on('input', () => this.debouncedSearch());
        $('#applyFilters').click(() => this.applyFilters());
        $('#resetFilters').click(() => this.resetFilters());
    }

    setupDebounce() {
        this.debouncedSearch = Utils.debounce(() => {
            this.currentFilters.keyword = $('#searchInput').val();
            this.applyFilters();
        }, CONFIG.FILTERS.debounceTime);
    }

    applyFilters() {
        // 獲取過濾值
        this.currentFilters = {
            keyword: $('#searchInput').val(),
            minPrice: $('#minPrice').val(),
            maxPrice: $('#maxPrice').val(),
            minPV: $('#minPV').val(),
            maxPV: $('#maxPV').val()
        };

        // 驗證價格範圍
        if (!Utils.validatePriceRange(this.currentFilters.minPrice, this.currentFilters.maxPrice)) {
            alert(ERROR_MESSAGES.INVALID_PRICE_RANGE);
            return;
        }

        // 觸發過濾事件
        const event = new CustomEvent(EVENTS.FILTERS_APPLIED, {
            detail: { filters: this.currentFilters }
        });
        document.dispatchEvent(event);
    }

    resetFilters() {
        // 重置所有輸入欄位
        $('#searchInput').val('');
        $('#minPrice').val('');
        $('#maxPrice').val('');
        $('#minPV').val('');
        $('#maxPV').val('');

        // 重置過濾器狀態
        this.currentFilters = {
            keyword: '',
            minPrice: '',
            maxPrice: '',
            minPV: '',
            maxPV: ''
        };

        // 觸發重置事件
        document.dispatchEvent(new Event(EVENTS.FILTERS_RESET));
    }
}
