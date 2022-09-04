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
    <Commentsy :commentData="commentData" />
    <Kaso v-if="kasoFlg" :sansyuCount="sansyuCount" />
    <!-- <Telop :telop="telop" /> -->
  </div>
</template>

<script>
import axios from "axios";
import { gsap } from "gsap";
import constants from "~/constants";

export default {
  data() {
    return {
      roomId: "373889",
      roomUrl: "/PianistMusica",
      ws: "wss://online.showroom-live.com",
      telop: "",
      bcsvr_key: "",
      commentData: [],
      giftData: [],
      freeGiftList: [],
      streamData: null,
      socket: null,
      sockety: null,
      checkStreaming: null,
      checkPing: null,
      startTime: null,
      showFlg: true,
      fallFlg: false,
      pon: 0,
      sansyuCount: 0,
      kasoFlg: false,
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
    if (this.$route.query.counter != undefined) {
      this.kasoFlg = true;
    }

    // 疎通確認
    // this.checkStreaming = setInterval(() => {
    //   this.checkLive();
    // }, 5000);

    this.connectSockety();

    // 配信始まっているか確認
    let checkYoutube = setInterval(() => {
      this.getApi(
        `${constants.url.main}${constants.url.other.broadcast}${this.roomUrl}`
      )
        .then((res) => {
          if (!Object.keys(res.data).length) {
            clearInterval(checkYoutube);
            this.premiumLive();
          } else if (res.data.split(":").length === 2) {
            // 配信中
            this.bcsvr_key = res.data;
            clearInterval(checkYoutube);
            this.normalLive();
          } else {
            console.log("未配信");
          }
        })
        .catch((e) => {
          console.log(e);
          console.log("プレミアム配信かも？");
          clearInterval(checkYoutube);
          this.premiumLive();
        });
    }, 5000);

    // ソケット接続
    // setTimeout(() => {
    //   this.getApi(
    //     `${constants.url.main}${constants.url.other.broadcast}${this.roomUrl}`
    //   )
    //     .then((res) => {
    //       if (!Object.keys(res.data).length) {
    //         this.premiumLive();
    //       } else if (res.data.split(":").length === 2) {
    //         // 配信中
    //         this.bcsvr_key = res.data;
    //         this.normalLive();
    //       } else {
    //         this.prConnectSocket(res.data);
    //       }
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       console.log("プレミアム配信かも？");
    //       this.premiumLive();
    //     });
    // }, 1000);
  },
  methods: {
    async normalLive() {
      await axios
        .get(`${constants.url.main}${constants.url.room.profile}${this.roomId}`)
        .then((response) => {
          if (response.data.is_onlive) {
            this.startTime = response.data.current_live_started_at;
            // 配信情報取得
            this.getLiveData();
            // 接続
            this.connectSocket();
          }
        });
    },
    premiumLive() {
      this.checkStreaming = setInterval(() => {
        axios
          .get(`${constants.url.main}${constants.url.live.premium}`)
          .then((response) => {
            if (response.data.length !== 0) {
              for (let data of response.data) {
                if (data.room_id === Number(this.roomId)) {
                  this.bcsvr_key = data.bcsvr_key;
                  this.streamData = data;
                  clearInterval(this.checkStreaming);
                  // 接続
                  this.connectSocket();
                }
              }
            }
          });
      }, 5000);
    },
    // async checkLive() {
    //   let flg = false;
    //   let preFlg = false;
    //   // 配信しているか確認
    //   await axios
    //     .get(`${constants.url.main}${constants.url.room.profile}${this.roomId}`)
    //     .then((response) => {
    //       if (response.data.is_onlive) {
    //         // プレミアライブ中か？
    //         if (response.data.premium_room_type == 1) {
    //           preFlg = true;
    //         } else {
    //           flg = true;
    //           // clearInterval(this.checkStreaming);
    //         }
    //         this.startTime = response.data.current_live_started_at;
    //       } else {
    //         console.log("配信停止中");
    //       }
    //     });

    //   if (preFlg) {
    //     this.checkStreaming = setInterval(() => {
    //       axios
    //         .get(`${process.env.API_URL}/api/users/onlive/${this.roomId}`)
    //         .then((response) => {
    //           if (response.data.length != undefined) {
    //             if (response.data) {
    //               this.streamData = response.data[0];
    //               clearInterval(this.checkStreaming);
    //               // 接続
    //               this.connectSocket();
    //             }
    //           }
    //         });
    //     }, 5000);
    //   } else if (flg) {
    //     // 配信情報取得
    //     await this.getLiveData();
    //     // 接続
    //     this.connectSocket();
    //   }
    // },
    async getLiveData() {
      await axios
        .get(
          `${constants.url.main}${constants.url.live.liveInfo}${this.roomId}`
        )
        .then((response) => {
          this.streamData = response.data;
          this.title = response.data.room_name;
        });
    },
    getApi(url) {
      return axios.get(url);
    },
    prConnectSocket(broadcastKey) {
      // 接続
      const prSocket = new WebSocket(this.ws);
      // 接続確認
      prSocket.onopen = (e) => {
        prSocket.send(`SUB\t${broadcastKey}`);
      };
      // エラー発生時
      prSocket.onerror = (e) => {
        prSocket.close();
        location.reload();
      };
      // 疎通確認
      this.checkPing = setInterval(() => {
        prSocket.send("PING\tshowroom");
      }, 60000);
      // メッセージ受信
      prSocket.onmessage = (data) => {
        // 死活監視
        if (data.data === "ACK\tshowroom") {
          return;
        }
        // エラー
        if (
          data.data === "ERR" ||
          data.data === "Could not decode a text frame as UTF-8."
        ) {
          return;
        }
        // JSON変換
        const getJson = JSON.parse(data.data.split(`MSG\t${broadcastKey}`)[1]);

        if (getJson.t === 104) {
          prSocket.close();
          clearInterval(this.checkPing);
          // 配信開始
          location.reload();
        }
      };
    },
    connectSocket() {
      console.log("接続開始");
      // 接続
      this.socket = new WebSocket(constants.ws);
      // 接続確認
      this.socket.onopen = (e) => {
        this.socket.send("SUB\t" + this.bcsvr_key);
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
        if (this.kasoFlg) {
          this.getRanking();
        }
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
        let getJson = JSON.parse(data.data.split("MSG\t" + this.bcsvr_key)[1]);

        if (Object.keys(getJson).length === 10) {
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
        } else if (Object.keys(getJson).length === 13) {
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
            }
          } else {
            // 有料
            this.fallGift(getJson);
          }

          // this.fallGift(getJson);
        } else if (Object.keys(getJson).length === 6) {
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
    connectSockety() {
      console.log("接続開始");

      // 接続
      this.sockety = new WebSocket("wss://yoichiro-api-v1.site:61808/ws/");
      // 接続確認
      this.sockety.onopen = (e) => {
        console.log("yコネクションを開始しました");
      };
      // エラー発生時
      this.sockety.onerror = (error) => {
        location.reload();
      };
      // 疎通確認
      setInterval(() => {
        this.sockety.send("PING");
      }, 60000);
      // メッセージ受信
      this.sockety.onmessage = (data) => {
        // JSON変換
        let getJson = JSON.parse(data.data);
        this.getCommenty(getJson);
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
              avatar: `https://image.showroom-cdn.com/showroom-prod/image/avatar/${commentObj.av}.png?v=85`,
              kbn: "showroom",
            };
          }
        } else {
          if (commentObj.cm === "me") {
            this.fallMe(commentObj.u, commentObj.av, 100);
          } else {
            this.commentData = {
              id: commentObj.u,
              name: commentObj.ac,
              comment: commentObj.cm,
              flg: commentObj.ua,
              avatar: `https://image.showroom-cdn.com/showroom-prod/image/avatar/${commentObj.av}.png?v=85`,
              kbn: "showroom",
            };
          }
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
      // なす
      if (
        commentObj.cm == "なすぅ…" ||
        commentObj.cm == "🍆" ||
        commentObj.cm == "なす" ||
        commentObj.cm == "ナス"
      ) {
        this.fallAther(commentObj.u, "nasu", 25, 100);
        this.fallAther(commentObj.u, "nasu1", 25, 100);
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
      // むじかりこ
      if (commentObj.cm == "むじかりこ") {
        this.fallAther(commentObj.u, "jagarico-icon", 25, 100);
      }
    },
    getCommenty(commentObj) {
      let comment = "";
      let customEmoji = false;

      for (let i = 0; i < commentObj.message.length; i++) {
        if ("text" in commentObj.message[i]) {
          if (
            commentObj.author.name === undefined ||
            commentObj.message[i].text === undefined
          ) {
            return;
          } else {
            comment += commentObj.message[i].text;
          }
        } else if (commentObj.message[i].isCustomEmoji) {
          // カスタム絵文字
          comment += `<img src="${commentObj.message[i].url}" class="customEmoji">`;
          customEmoji = commentObj.message[i].isCustomEmoji;
        } else if (!commentObj.message[i].isCustomEmoji) {
          // 普通の絵文字
          comment += commentObj.message[i].emojiText;
        } else {
          console.log(commentObj);
        }
      }

      this.commentData = {
        name: commentObj.author.name,
        comment: comment,
        avatar: commentObj.author.thumbnail.url,
        customEmoji: customEmoji,
        kbn: "youtube",
      };
      const cmId = Math.random().toString(32).substring(2);

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
          // giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/image/avatar/${gift.av}.png?v=85`;
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
    fallMe(userId, img, num) {
      // 画面幅を取得
      let width = window.innerWidth;
      let height = window.innerHeight;

      // ギフトの数分ループ
      for (let i = 0; i < num; i++) {
        // 要素のID
        let id = `me_${userId}_${i}`;
        // ギフト画像の要素を作成
        let giftImgElement = document.createElement("img");
        // 画像を設定
        giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/image/avatar/${img}.png?v=85`;
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
    kasoCounter(userData) {
      if (this.sansyu.indexOf(userData.id) == -1) {
        this.sansyu.push(userData.id);
        // 3周カウント
        if (this.sansyuCount < 20) {
          this.sansyuCount++;
        }
      }
    },
    getRanking() {
      // axios
      //   .get(`${process.env.API_URL}/api/live/ranking-point/PianistMusica`)
      //   .then((response) => {
      //     let sansyu = 0;
      //     for (let i = 0; i < response.data.length; i++) {
      //       if (sansyu < 20 && response.data[i].point >= 1730) {
      //         sansyu++;
      //       }
      //     }
      //     this.sansyuCount = sansyu;
      //   });
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