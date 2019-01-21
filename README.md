# 工研院計劃伺服器部分安裝説明
## 使用以太坊私有鏈版本
*  Geth/v1.8.20-stable
*  go1.10.1
*  web3@0.20.6
*  使用環境Ubuntu/mac


## 安裝go
```shell=
wget https://dl.google.com/go/go1.10.1.linux-armv6l.tar.gz

sudo tar -C /usr/local -xzf go1.10.1.linux-armv6l.tar.gz

export PATH=$PATH:/usr/local/go/bin
```

## 安裝geth(Linux or MAC)

```shell=
mkdir src

cd src

sudo apt-get install -y git build-essential libgmp3-dev golang

git clone -b release/1.8 https://github.com/ethereum/go-ethereum.git

cd go-ethereum

make

sudo cp build/bin/geth /usr/local/bin/

```


## 安裝以太坊私有鏈環境
* 先確認安裝好go與go-ethereum
* 建立一個empty資料夾
```shell=
$ mkdir chain
$ cd chain
```
* 在資料夾中建立genesis.json
```
$ vim genesis.json

//輸入創世區塊内文
{
  "config": {
    "chainId": 33,
    "homesteadBlock": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "ByzantiumBlock": 0 
  },
  "nonce": "0x0000000000000033",
  "timestamp": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x8000000",
  "difficulty": "0x1",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x3333333333333333333333333333333333333333",
  "alloc": {}
}

```

* 在終端機中安裝私有鏈資料
```shell=
geth --datadir ./data/ init genesis.json
```

* 在終端機中geth資料夾下，啓動私有鏈with web socket

```shell=
geth --datadir data --networkid 33 --ws --wsaddr "0.0.0.0" --wsapi "eth,web3,personal,debug,db,admin,miner,net,shh,txpool" --wsport 8546 --wsorigins "*" --rpc --rpcport 8545 --rpccorsdomain "*" --rpcapi " eth,web3,personal,debug,db,admin,miner,net,shh,txpool " --nodiscover console
```



## 主合約部署步驟(伺服器部分)
1. 啓動終端機，到`BP-web/migrate`的資料夾下，啓動私有鏈（預設8545 port）
```shell=
git clone https://github.com/nowvan/BP-web
cd BP-web/migrate
geth attach http://localhost:8545
```

2. 解鎖第0個賬戶`eth.account[0]`並start mining
```shell=
//賬戶解鎖
personal.unlockAccount()

//開始挖礦
miner.start()
```
4. 部署合約
```shell=
loadScript("deploy_test.js")
```

5. 將終端機中印出來的合約地址，更改到`MC_address`檔案中
![](https://i.imgur.com/TbZkMZV.png)

6. 退出到`BP-web`資料夾中-啓用系統
```shell=
npm start
```

## note
* 在此系統中，所有交易都使用`account[0]`送出

###### tags: `blockchain`

#  itri_BP計劃 補充
## 後端使用 node.js 
- express 後端框架
- mysql 連接資料庫
- web3 與geth_node溝通
- dotenv 隱藏隱私資訊
- request 在後端發送請求


## 前端使用 adminLTE 做為參考
- googleapis 顯示地圖並可標記地點
    >須先用自己google帳戶創出自己的key才能使用
範例 https://ithelp.ithome.com.tw/articles/10194345
marker 
範例 https://developers.google.com/maps/documentation/javascript/tutorial?hl=zh-tw
- daterangepicker.js 選取時間
    > 範例 http://www.daterangepicker.com/
- datatables.js 將資料條列出並具有格式和小功能
    > 範例 https://datatables.net/examples/data_sources/js_array.html
- Chart.js 繪出溫濕度折線圖表
    > 範例 http://www.chartjs.org/samples/latest/
- sweetalert.js 美化彈出的視窗
    > 範例 https://sweetalert.js.org/guides/

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

- 以上兩頁面都有使用到下列套件
    >googleapis 顯示地圖並可標記地點
    須先用自己google帳戶創出自己的key才能使用
範例 https://ithelp.ithome.com.tw/articles/10194345
marker 
範例 https://developers.google.com/maps/documentation/javascript/tutorial?hl=zh-tw
    >daterangepicker.js 選取時間
    範例 http://www.daterangepicker.com/
     
    > datatables.js 將資料條列出並具有格式和小功能
    範例 https://datatables.net/examples/data_sources/js_array.html
     
    > Chart.js 繪出溫濕度折線圖表
    範例 http://www.chartjs.org/samples/latest/
    
    > sweetalert.js 美化彈出的視窗
    範例 https://sweetalert.js.org/guides/

- /views/manager 列出所有container資料的頁面
    >使用到下列套件
    datatables.js 將資料條列出並具有格式和小功能
    範例 https://datatables.net/examples/data_sources/js_array.html

- /views/registerid 註冊id頁面
    >使用到下列套件
    sweetalert.js 美化彈出的視窗
    範例 https://sweetalert.js.org/guides/
