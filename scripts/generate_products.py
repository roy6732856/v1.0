from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import json

def setup_driver():
    chrome_options = Options()
    # chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def scroll_to_bottom(driver):
    current_products = len(driver.find_elements(By.CLASS_NAME, "gdInfo"))
    
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        
        new_products = len(driver.find_elements(By.CLASS_NAME, "gdInfo"))
        print(f"目前商品數量: {new_products}")
        
        if new_products == current_products:
            print("已到達頁面底部，沒有更多商品")
            break
            
        current_products = new_products

def get_product_info():
    driver = setup_driver()
    products_data = []
    
    try:
        url = "https://tw.atomy.com/category?sortType=POPULAR"
        driver.get(url)
        
        time.sleep(5)
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "gdInfo"))
        )
        
        scroll_to_bottom(driver)
        
        products = driver.find_elements(By.CLASS_NAME, "gdInfo")
        print(f"總共找到 {len(products)} 個商品")
        
        for index, product in enumerate(products, 1):
            try:
                name = product.find_element(By.CLASS_NAME, "title").text
                price = product.find_element(By.CSS_SELECTOR, ".prc_ori b").text
                pv = product.find_element(By.CSS_SELECTOR, ".pv_ori b").text
                
                # 移除價格中的逗號和其他非數字字元
                price_clean = int(price.replace(',', '').replace('$', '').strip())
                # 移除 PV 中的逗號和其他非數字字元
                pv_clean = int(pv.replace(',', '').replace('PV', '').strip())
                
                products_data.append({
                    'id': f"P{str(index).zfill(3)}",  # 生成 P001, P002 等格式的 ID
                    'name': name,
                    'price': price_clean,
                    'pv': pv_clean
                })
                
            except Exception as e:
                print(f"處理商品時發生錯誤: {str(e)}")
                continue
        
        # 生成 JavaScript 檔案內容
        js_content = "const PRODUCTS = " + json.dumps(products_data, ensure_ascii=False, indent=4) + ";"
        
        # 寫入 products.js 檔案
        with open('data/product.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print("資料已儲存至 product.js")
        
        return products_data
        
    except Exception as e:
        print(f"發生錯誤: {str(e)}")
        return None
        
    finally:
        driver.quit()

if __name__ == "__main__":
    products = get_product_info()
    if products:
        print("\n抓取到的商品資料：")
        for product in products:
            print(f"ID: {product['id']}")
            print(f"商品名稱: {product['name']}")
            print(f"價格: {product['price']}元")
            print(f"PV值: {product['pv']} PV")
            print("-" * 50)
