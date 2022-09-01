<template>
  <div class="bgimg" id="gift">
    <video
      id="bg-video"
      src="~/assets/video/musica.mp4"
      muted
      autoplay
      playsinline
      loop
    ></video>
    <img id="logo" src="~/assets/image/logo.png" />
    <Counter :pon="pon" />
    <Timey v-if="showFlg" :startTime="startTime" />
    <Commenty class="header-title" :commentData="commentData" />
  </div>
</template>

<script>
import axios from "axios";
import { gsap } from "gsap";
// import constants from "~/constants";

export default {
  data() {
    return {
      channelId: "UCFdcDkKQJbK76e_1zxYXsDA",
      commentData: [],
      socket: null,
      startTime: null,
      showFlg: true,
      fallFlg: false,
      pon: 0,
    };
  },
  head() {
    return {
      title: "塔野ムジカ専用コメントビューワー",
    };
  },
  mounted() {
    // 配信始まっているか確認
    let checkYoutube = setInterval(() => {
      this.getApi("https://yoichiro-api-v1.site:61808/youtube/check?key=musica")
        .then((res) => {
          console.log(res.data);
          if (res.data.streaming) {
            console.log("配信中");
            clearInterval(checkYoutube);
            this.connectSocket();
          } else {
            console.log("配信無し");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }, 5000);
  },
  methods: {
    getApi(url) {
      return axios.get(url);
    },
    connectSocket() {
      console.log("接続開始");

      // 接続
      this.socket = new WebSocket("ws://minecraft.showroom-app.com:61809");
      // 接続確認
      this.socket.onopen = (e) => {
        console.log("コネクションを開始しました");
      };
      // エラー発生時
      this.socket.onerror = (error) => {
        location.reload();
      };
      // 疎通確認
      setInterval(() => {
        this.socket.send("PING");
      }, 60000);
      // メッセージ受信
      this.socket.onmessage = (data) => {
        // JSON変換
        let getJson = JSON.parse(data.data);
        this.getComment(getJson);
      };
    },
    getComment(commentObj) {
      this.commentData = {
        name: commentObj.author.name,
        comment: commentObj.message[0].text,
        avatar: commentObj.author.thumbnail.url,
      };
      const cmId = Math.random().toString(32).substring(2);
      const comment = commentObj.message[0].text;
      // ぽんエフェクト
      if (
        comment == "ぽん" ||
        comment == "ポン" ||
        comment == "ぽん！" ||
        comment == "ポン！" ||
        comment == "pon"
      ) {
        this.fallPon(cmId, "fallPon", 30, 100);
        this.pon++;
      }
      if (comment == "ぽん.") {
        this.fallPon(cmId, "fallPon_bk", 30, 100);
        this.pon++;
      }
      // 草エフェクト
      if (comment == "草" || comment == "www" || comment == "ｗｗｗ") {
        this.fallAther(cmId, "kusa", 100, 100);
      }
      // 大草原エフェクト
      if (
        comment == "大草原" ||
        comment == "wwwwww" ||
        comment == "ｗｗｗｗｗｗｗｗ"
      ) {
        this.fallAther(cmId, "daisougen", 100, 200);
      }
      // 拍手
      if (comment == "88888888" || comment == "８８８８８８８８") {
        this.fallAther(cmId, "8_0", 25, 100);
        this.fallAther(cmId, "8_1", 10, 50);
        this.fallAther(cmId, "8_2", 10, 50);
        this.fallAther(cmId, "8_3", 10, 50);
      }
      // きゅうり
      if (
        comment == 'ŧ‹"🥒ŧ‹"' ||
        comment == "🥒" ||
        comment == "きゅうり" ||
        comment == "キュウリ"
      ) {
        this.fallAther(cmId, "cucumber1", 25, 100);
        this.fallAther(cmId, "cucumber2", 25, 100);
        this.fallAther(cmId, "cucumber3", 25, 100);
        this.fallAther(cmId, "cucumber4", 25, 100);
        this.fallAther(cmId, "cucumber5", 25, 100);
      }
      // なす
      if (
        comment == "なすぅ…" ||
        comment == "🍆" ||
        comment == "なす" ||
        comment == "ナス"
      ) {
        this.fallAther(cmId, "nasu", 25, 100);
        this.fallAther(cmId, "nasu1", 25, 100);
      }
      // 生首
      if (
        comment == "生首" ||
        comment == "首" ||
        comment == "なまくび" ||
        comment == "くび"
      ) {
        this.fallAther(cmId, "kubi", 25, 100);
      }
      // むじかりこ
      if (comment == "むじかりこ") {
        this.fallAther(cmId, "jagarico-icon", 25, 100);
      }
    },
    fallAther(userId, img, num, size) {
      // 画面幅を取得
      let width = window.innerWidth;
      let height = window.innerHeight;

      // ギフトの数分ループ
      for (let i = 0; i < num; i++) {
        // 要素のID
        let id = `pon_${userId}_${i}`;
        // ギフト画像の要素を作成
        let giftImgElement = document.createElement("img");
        // 画像を設定
        giftImgElement.src = require(`@/assets/image/${img}.png`);
        giftImgElement.style.width = `${size}px`;
        giftImgElement.style.zIndex = 100;
        // IDを設定
        giftImgElement.setAttribute("id", id);
        // 配置位置を設定
        giftImgElement.style.position = "absolute";
        giftImgElement.style.top = "-25px"; // 画面外に配置
        giftImgElement.style.left = this.getRandomNum(10, width - 70) + "px"; // ランダムに配置
        // ギフト要素を画面に追加
        document.getElementById("gift").append(giftImgElement);

        // 動きを追加
        // 動かす要素IDを指定
        gsap.to(`#${id}`, {
          duration: this.getRandomNum(2, 5), // 2秒～5秒の間で移動
          rotation: this.getRandomNum(90, 720), // 回転角度
          y: height - 60, // 落ちる高さ
          onComplete: () => {
            document.getElementById(id).remove(); // 終わったら要素を削除
          },
        });
      }
    },
    fallPon(userId, img, num, size) {
      // 画面幅を取得
      let width = window.innerWidth;
      let height = window.innerHeight;

      // ギフトの数分ループ
      for (let i = 0; i < num; i++) {
        // 要素のID
        let id = `pon_${userId}_${i}`;
        // ギフト画像の要素を作成
        let giftImgElement = document.createElement("img");
        // 画像を設定
        giftImgElement.src = require(`@/assets/image/${img}.png`);
        giftImgElement.style.width = `${size}px`;
        giftImgElement.style.zIndex = 100;
        // IDを設定
        giftImgElement.setAttribute("id", id);
        // 配置位置を設定
        giftImgElement.style.position = "absolute";
        giftImgElement.style.top = "-25px"; // 画面外に配置
        giftImgElement.style.left = this.getRandomNum(300, width - 70) + "px"; // ランダムに配置
        // ギフト要素を画面に追加
        document.getElementById("gift").append(giftImgElement);

        // 動きを追加
        // 動かす要素IDを指定
        gsap.to(`#${id}`, {
          duration: this.getRandomNum(2, 5), // 2秒～5秒の間で移動
          rotation: this.getRandomNum(90, 720), // 回転角度
          y: height - 60, // 落ちる高さ
          onComplete: () => {
            document.getElementById(id).remove(); // 終わったら要素を削除
          },
        });
      }
    },
    getRandomNum(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.random() * (max - min + 1) + min;
    },
  },
};
</script>

<style scoped>
#bg-video {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: -100;
}

.header-title {
  position: relative;
  z-index: 2;
}

#logo {
  position: absolute;
  height: 25vh;
  top: -5.5vh;
}
</style>