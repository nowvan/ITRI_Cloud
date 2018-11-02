#  itri_BP計劃 補充

## 後端使用 node.js 
- express 後端框架
- mysql 連接資料庫
- web3 與geth_node溝通
- dotenv 隱藏隱私資訊
- request 在後端發送請求


## 前端使用 adminLTE 做為參考
- googleapis 顯示地圖並可標記地點
- daterangepicker.js 選取時間
- datatables.js 將資料條列出並具有格式和小功能
- Chart.js 繪出溫濕度折線圖表
- sweetalert.js 美化彈出的視窗

## 後端功能描述
- 顯示頁面的router 寫在 routes/index.js裡
- 並且引用了作為功能的model 寫在 models資料夾裡
    - /models/createNewcontainer 負責創建新的子合約
    - /models/server_DB 負責開啟監聽區塊鏈並將資料寫入資料庫裡
    - /models/backend 裡有對外的api
        >backend.getDataById 
        輸入id將回傳所有此id所有資料 
        如果加上輸入timestamp就會回傳特定時間區間的資料
            
        >backend.containerlist
        回傳所有已註冊的id以及address
        
        >backend.getAddressById
        輸入id回傳address

        >backend.save
        資料儲存至資料庫的api


## 前端功能描述 /views

- /views/index 顯示地圖圖表資料等的頁面
- /views/searchbyidtime 顯示地圖圖表資料等的頁面（有輸入時間區間）
> 以上兩頁面都有使用到下列套件
> googleapis 顯示地圖並可標記地點
> daterangepicker.js 選取時間
> datatables.js 將資料條列出並具有格式和小功能
> Chart.js 繪出溫濕度折線圖表
> sweetalert.js 美化彈出的視窗

- /views/manager 列出所有container資料的頁面
>使用到下列套件
>datatables.js 將資料條列出並具有格式和小功能

- /views/registerid 註冊id頁面
>使用到下列套件
>sweetalert.js 美化彈出的視窗
