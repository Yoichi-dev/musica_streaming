<template>
  <div class="bgimg" id="gift">
    <Counter :pon="pon" />
    <Time v-if="showFlg" :startTime="startTime" />
    <Comment :commentData="commentData" />
    <Kaso :sansyuCount="sansyuCount" />
    <!-- <Telop :telop="telop" /> -->
  </div>
</template>

<script>
import axios from "axios";
import { gsap } from "gsap";

export default {
  data() {
    return {
      roomId: "373889",
      telop: "",
      commentData: [],
      giftData: [],
      freeGiftList: [],
      streamData: null,
      socket: null,
      checkStreaming: null,
      startTime: null,
      showFlg: true,
      fallFlg: false,
      pon: 0,
      sansyu: [],
      sansyuCount: 0,
    };
  },
  head() {
    return {
      title: "塔野ムジカ専用コメントビューワー",
    };
  },
  mounted() {
    // パラメータがある場合はテスト
    if (this.$route.query.id != undefined) {
      this.roomId = this.$route.query.id;
    }
    if (this.$route.query.watch != undefined) {
      this.showFlg = false;
    }
    // 疎通確認
    this.checkStreaming = setInterval(() => {
      this.checkLive();
    }, 1500);
  },
  methods: {
    async checkLive() {
      let flg = false;
      let preFlg = false;
      // 配信しているか確認
      await axios
        .get(`${process.env.API_URL}/api/users/${this.roomId}`)
        .then((response) => {
          if (response.data.is_onlive) {
            // プレミアライブ中か？
            if (response.data.premium_room_type == 1) {
              preFlg = true;
            } else {
              flg = true;
              clearInterval(this.checkStreaming);
            }
            this.startTime = response.data.current_live_started_at;
          } else {
            console.log("配信停止中");
          }
        });

      if (preFlg) {
        await axios
          .get(`${process.env.API_URL}/api/users/onlive/${this.roomId}`)
          .then((response) => {
            if (response.data.length != undefined) {
              if (response.data) {
                this.streamData = response.data[0];
                clearInterval(this.checkStreaming);
                // 接続
                this.connectSocket();
              }
            }
          });
      } else if (flg) {
        // 配信情報取得
        await this.getLiveData();
        // 接続
        this.connectSocket();
      }
    },
    async getLiveData() {
      await axios
        .get(`${process.env.API_URL}/api/users/live/${this.roomId}`)
        .then((response) => {
          this.streamData = response.data;
          this.title = response.data.room_name;
        });
    },
    connectSocket() {
      console.log("接続開始");
      // 接続
      this.socket = new WebSocket("wss://online.showroom-live.com");
      // 接続確認
      this.socket.onopen = (e) => {
        this.socket.send("SUB\t" + this.streamData.bcsvr_key);
        console.log("コネクションを開始しました");
      };
      // エラー発生時
      this.socket.onerror = (error) => {
        // alert("エラーが発生しました\nページをリロードしてください");
        location.reload();
      };
      // 疎通確認
      setInterval(() => {
        this.socket.send("PING\tshowroom");
        this.fallFlg = true;
      }, 60000);
      // メッセージ受信
      this.socket.onmessage = (data) => {
        // 死活監視
        if (data.data === "ACK\tshowroom") {
          console.log("死活監視OK");
          return;
        }

        if (data.data === "ERR") {
          // alert("エラーが発生しました\nページをリロードしてください");
          location.reload();
          return;
        }

        // JSON変換
        let getJson = JSON.parse(
          data.data.split("MSG\t" + this.streamData.bcsvr_key)[1]
        );

        if (Object.keys(getJson).length === 9) {
          // コメントログ
          // カウント
          let commentFormat = getJson.cm.replace(/[０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
          });
          if (
            Number.isFinite(Number(commentFormat)) &&
            Number(commentFormat) <= 50
          ) {
            // this.getCount(getJson);
          } else {
            this.getComment(getJson);
          }
        } else if (Object.keys(getJson).length === 12) {
          // ギフトログ
          if (getJson.gt == 2) {
            // 投票
            if (Number(getJson.g) > 10000 && Number(getJson.g) <= 10070) {
            } else if (getJson.g == 1601) {
              // 虹星
              this.fallGift(getJson);
            } else {
              // 無料
              if (this.fallFlg) {
                this.fallGiftFree(getJson);
              }
              // 3周カウント
              this.addFreeGift(getJson);
            }
          } else {
            // 有料
            this.fallGift(getJson);
          }

          // this.fallGift(getJson);
        } else if (Object.keys(getJson).length === 5) {
          // テロップ
          this.telop = getJson.telop;
        } else if (Object.keys(getJson).length === 4) {
          if (getJson.t == 101) {
            this.socket.close();
            // alert("配信が終了しました");
            location.reload();
          }
        } else {
        }
      };
    },
    getComment(commentObj) {
      if (commentObj.cm != undefined) {
        if (commentObj.u == "3699368") {
          // 管理者機能
          let msg = commentObj.cm.split("_");
          if (msg[0] === "g") {
            this.fallAdminGift(commentObj.u, msg[1], msg[2]);
          } else {
            this.commentData = {
              id: commentObj.u,
              name: commentObj.ac,
              comment: commentObj.cm,
              flg: commentObj.ua,
              avatar: commentObj.av,
            };
          }
        } else {
          this.commentData = {
            id: commentObj.u,
            name: commentObj.ac,
            comment: commentObj.cm,
            flg: commentObj.ua,
            avatar: commentObj.av,
          };
        }
      }
      // ぽんエフェクト
      if (
        commentObj.cm == "ぽん" ||
        commentObj.cm == "ポン" ||
        commentObj.cm == "ぽん！" ||
        commentObj.cm == "ポン！" ||
        commentObj.cm == "pon"
      ) {
        this.fallPon(commentObj.u, "fallPon", 30, 100);
        this.pon++;
      }
      if (commentObj.cm == "ぽん.") {
        this.fallPon(commentObj.u, "fallPon_bk", 30, 100);
        this.pon++;
      }
      // 草エフェクト
      if (
        commentObj.cm == "草" ||
        commentObj.cm == "www" ||
        commentObj.cm == "ｗｗｗ"
      ) {
        this.fallAther(commentObj.u, "kusa", 100, 100);
      }
      // 大草原エフェクト
      if (
        commentObj.cm == "大草原" ||
        commentObj.cm == "wwwwww" ||
        commentObj.cm == "ｗｗｗｗｗｗｗｗ"
      ) {
        this.fallAther(commentObj.u, "daisougen", 100, 200);
      }
      // 拍手
      if (commentObj.cm == "88888888" || commentObj.cm == "８８８８８８８８") {
        this.fallAther(commentObj.u, "8_0", 25, 100);
        this.fallAther(commentObj.u, "8_1", 10, 50);
        this.fallAther(commentObj.u, "8_2", 10, 50);
        this.fallAther(commentObj.u, "8_3", 10, 50);
      }
      // きゅうり
      if (
        commentObj.cm == 'ŧ‹"🥒ŧ‹"' ||
        commentObj.cm == "🥒" ||
        commentObj.cm == "きゅうり" ||
        commentObj.cm == "キュウリ"
      ) {
        this.fallAther(commentObj.u, "cucumber1", 25, 100);
        this.fallAther(commentObj.u, "cucumber2", 25, 100);
        this.fallAther(commentObj.u, "cucumber3", 25, 100);
        this.fallAther(commentObj.u, "cucumber4", 25, 100);
        this.fallAther(commentObj.u, "cucumber5", 25, 100);
      }
      // 生首
      if (
        commentObj.cm == "生首" ||
        commentObj.cm == "首" ||
        commentObj.cm == "なまくび" ||
        commentObj.cm == "くび"
      ) {
        this.fallAther(commentObj.u, "kubi", 25, 100);
      }
    },
    fallGiftFree(gift) {
      // 画面幅を取得
      let width = window.innerWidth;
      let height = window.innerHeight;

      // ギフトの数分ループ
      for (let i = 0; i < gift.n; i++) {
        // 要素のID
        let id = `gift_${gift.u}_${gift.g}_${i}`;
        // ギフト画像の要素を作成
        let giftImgElement = document.createElement("img");
        // 画像を設定
        if (i <= 9) {
          // giftImgElement.src = `~/assets/image/${i}.png`;
          giftImgElement.src = require(`@/assets/image/${i}.png`);
          giftImgElement.style.width = "50px";
        } else if (i == 10) {
          giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/image/avatar/${gift.av}.png?v=85`;
          giftImgElement.style.width = "50px";
        } else {
          giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/assets/img/gift/${gift.g}_s.png`;
        }

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
    fallGift(gift) {
      // 画面幅を取得
      let width = window.innerWidth;
      let height = window.innerHeight;

      // ギフトの数分ループ
      for (let i = 0; i < gift.n; i++) {
        // 要素のID
        let id = `gift_${gift.u}_${gift.g}_${i}`;
        // ギフト画像の要素を作成
        let giftImgElement = document.createElement("img");
        // 画像を設定
        giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/assets/img/gift/${gift.g}_s.png`;
        giftImgElement.style.width = "100px";
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
    fallAdminGift(userId, gid, num) {
      // 画面幅を取得
      let width = window.innerWidth;
      let height = window.innerHeight;

      // ギフトの数分ループ
      for (let i = 0; i < num; i++) {
        // 要素のID
        let id = `gift_${userId}_${i}`;
        // ギフト画像の要素を作成
        let giftImgElement = document.createElement("img");
        // 画像を設定
        giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/assets/img/gift/${gid}_s.png`;
        giftImgElement.style.width = "100px";
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
    getRandomNum(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.random() * (max - min + 1) + min;
    },
    addFreeGift(giftObj) {
      // 既に存在するか確認
      if (this.freeGiftList.some((e) => e.id == giftObj.u)) {
        for (let i in this.freeGiftList) {
          if (this.freeGiftList[i].id === giftObj.u) {
            this.freeGiftList[i].num += Number(giftObj.n);
            this.freeGiftList[i].gitId = giftObj.g;
            this.freeGiftList[i].name = giftObj.ac;
            this.freeGiftList[i].avatar = giftObj.av;
            // 3周(本来は1435)
            if (this.freeGiftList[i].num > 1240) {
              console.log(
                `${this.freeGiftList[i].name}:${this.freeGiftList[i].num}pt`
              );
              this.kasoCounter(this.freeGiftList[i]);
            }
          }
        }
      } else {
        this.freeGiftList.unshift({
          id: giftObj.u,
          name: giftObj.ac,
          gitId: giftObj.g,
          num: Number(giftObj.n),
          flg: giftObj.ua,
          avatar: giftObj.av,
        });
      }
    },
    kasoCounter(userData) {
      if (this.sansyu.indexOf(userData.id) == -1) {
        this.sansyu.push(userData.id);
        // 3周カウント
        if (this.sansyuCount < 20) {
          this.sansyuCount++;
        }
      }
    },
  },
};
</script>

<style scoped>
.bgimg {
  width: 100vw;
  height: 100vh;
  background-image: url("~/assets/image/bg.png");
}
</style>