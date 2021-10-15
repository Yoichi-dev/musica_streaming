# 塔野ムジカ専用配信ページ

本アプリケーションは個人製作アプリになります

[![Github issues](https://img.shields.io/github/issues/Yoichi-dev/musica_streaming)](https://github.com/Yoichi-dev/musica_streaming/issues)
[![Github forks](https://img.shields.io/github/forks/Yoichi-dev/musica_streaming)](https://github.com/Yoichi-dev/musica_streaming/network/members)
[![Github stars](https://img.shields.io/github/stars/Yoichi-dev/musica_streaming)](https://github.com/Yoichi-dev/musica_streaming/stargazers)
[![Github top language](https://img.shields.io/github/languages/top/Yoichi-dev/musica_streaming)](https://github.com/Yoichi-dev/musica_streaming/)
[![Github license](https://img.shields.io/github/license/Yoichi-dev/musica_streaming)](https://github.com/Yoichi-dev/musica_streaming/)

## ビルド方法

```bash
# インストール
$ npm install

# localhost:3000で起動
$ npm run dev

# 本番用ビルド
$ npm run build
$ npm run start

# 静的プロジェクトを生成
$ npm run generate
```

## 利用方法

1. OBSのソースよりブラウザを選択して追加
2. アプリURLを貼り付け、幅`1920`、高さ`1080`と入力

配信が始まれば自動でルームに接続開始し、コメントが画面に表示されギフトが降ってきます  
また、配信中にエラーが発生した際は自動でリロードされ再度配信に接続されます

## おまけ機能

### エフェクト

- 「ぽん」、「ぽん！」、「ポン」、「ポン！」、「pon」と入力すると[ぽん](./assets/image/fallPon.png)が降ってきます
- 「ぽん.」と入力すると過去使っていた[ぽん](./assets/image/fallPon_bk.png)が降ってきます
- 「草」、「www」、「ｗｗｗ」と入力すると[草](./assets/image/kusa.png)が降ってきます
- 「大草原」、「wwwwww」、「ｗｗｗｗｗｗｗｗ」と入力すると[大草原](./assets/image/daisougen.png)が降ってきます
- 「88888888」、「８８８８８８８８」と入力すると[88888888](./assets/image/888.png)と[拍手](./assets/image/8888.png)が降ってきます

### コメント

- 「ぽん」、「ぽん！」、「ポン」、「ポン！」と入力すると[ぽん](./assets/image/pon.png)がコメントに出てきます
- 「ぽん.」と入力すると過去使っていた[ぽん](./assets/image/pon_bk.png)がコメントに出てきます
- 「しか」、「シカ」、「鹿」と入力すると[シカイラスト](./assets/image/sika.png)がコメントに出てきます
- 「くま」、「クマ」、「熊」と入力すると[クマイラスト](./assets/image/8.png)がコメントに出てきます

# 製作者

* よーいちろー [@TYoichiro](https://twitter.com/TYoichiro)

# ライセンス

[MIT license](https://en.wikipedia.org/wiki/MIT_License).