<template>
  <div id="gift" class="bgimg">
    <img id="piano-logo" src="~/assets/image/logo.png" />
    <Counter :pon="pon" />
    <Comment class="pianoCommentArea scrollbar" :comment="commentData" />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import axios from '~/plugins/axios'
import constants from '~/constants'

export default {
  name: 'PianoPage',
  data() {
    return {
      pon: 0,
      commentData: {
        id: null,
        name: null,
        comment: null,
        flg: null,
        avatar: null,
        kbn: null,
      },
      srSocket: null,
      roomStatus: null,
      srSocketPing: null,
      bcsvr_key: null,
      fallFlg: false,
      youtubeFlg: false,
      youtubeCount: 0,
      sockety: null,
      youtubeKey: null,
      ytCheckPing: null,
      yuCommentPing: null,
    }
  },
  mounted() {
    // YouTube接続
    this.getYoutubeKey()

    axios
      .post(constants.url.showroom_api, {
        category: 'room',
        type: 'status',
        key: constants.roomUrl,
      })
      .then((res) => {
        if ('errors' in res.data) {
          if ('redirect_url' in res.data.errors[0]) {
            console.log('プレミアム配信かも？')
            this.premiumLive()
          }
        } else {
          this.roomStatus = res.data
          this.bcsvr_key = res.data.broadcast_key
          this.srConnect(res.data.broadcast_key)
        }
      })
  },
  methods: {
    premiumLive() {
      const checkStreaming = setInterval(() => {
        axios
          .post(constants.url.showroom_api, {
            category: 'live',
            type: 'onlives',
            key: new Date().getTime(),
          })
          .then((res) => {
            const premiumList = []
            for (let i = 0; i < res.data.onlives.length; i++) {
              if (
                res.data.onlives[i].genre_id >= 100 &&
                res.data.onlives[i].genre_id <= 200
              ) {
                const check = res.data.onlives[i].lives.find(
                  (e) => e.premium_room_type === 1
                )
                if (check !== undefined) {
                  premiumList.push(check)
                }
              }
            }
            if (premiumList.length !== 0) {
              for (const data of premiumList) {
                if (data.room_id === constants.roomId) {
                  this.bcsvr_key = data.bcsvr_key
                  this.roomStatus = data

                  clearInterval(checkStreaming)
                  // 接続
                  this.srConnect(data.bcsvr_key)
                  break
                }
              }
            }
          })
      }, 5000)
    },
    srConnect(bcsvrKey) {
      // 接続
      this.srSocket = new WebSocket(constants.ws)
      // 接続確認
      this.srSocket.onopen = (e) => {
        console.log('接続')
        this.srSocket.send(`SUB\t${bcsvrKey}`)
      }
      // 疎通確認
      this.srSocketPing = setInterval(() => {
        this.srSocket.send('PING\tshowroom')
        this.fallFlg = true
      }, 60000)
      // エラー発生時
      this.srSocket.onerror = (e) => {
        this.srSocket.close()
        clearInterval(this.srSocketPing)
        // 再接続
        this.srConnect(this.bcsvr_key)
      }
      // メッセージ受信
      this.srSocket.onmessage = (data) => {
        // 死活監視
        if (
          data.data === 'ACK\tshowroom' ||
          data.data === 'Could not decode a text frame as UTF-8.'
        ) {
          return
        }
        // エラー
        if (data.data === 'ERR') {
          this.srSocket.close()
          clearInterval(this.srSocketPing)
          // 再接続
          this.srConnect(this.bcsvr_key)
        }

        // JSON変換
        const msgJson = JSON.parse(data.data.split(`MSG\t${bcsvrKey}`)[1])

        switch (msgJson.t) {
          case '1':
            if (this.commentCountCheck(msgJson)) {
              // コメント追加
              this.commentData = {
                id: msgJson.u,
                name: msgJson.ac,
                comment: msgJson.cm,
                flg: msgJson.ua,
                avatar: `https://image.showroom-cdn.com/showroom-prod/image/avatar/${msgJson.av}.png?v=85`,
                kbn: 'showroom',
              }
              // エフェクト
              this.commentEffect(msgJson)
            }
            break
          case '2':
            // ギフト
            if (this.giftCheck(msgJson)) {
              // 無料
              if (this.fallFlg) {
                this.fallGiftFree(msgJson)
              }
            } else {
              // 有料
              this.fallGift(msgJson)
            }
            break
          case 101:
            console.log('配信終了')
            console.log(msgJson.created_at)
            this.srSocket.close()
            clearInterval(this.srSocketPing)
            console.log('切断')
            location.reload()
            break
          case 104:
            this.srSocket.close()
            clearInterval(this.srSocketPing)
            // 再接続
            location.reload()
            break
          default:
          // console.log(msgJson)
        }
      }
    },
    getYoutubeKey() {
      // 15分反応が無ければチェック終了
      let limitCount = 0
      if (this.ytCheckPing === null) {
        this.ytCheckPing = setInterval(() => {
          if (limitCount > 10) {
            clearInterval(this.ytCheckPing)
            this.ytCheckPing = null
            console.log('YouTubeでの配信は無し')
            return
          }
          axios
            .get(
              `${constants.url.sub}${constants.url.youtube.channel}${constants.channelId}`
            )
            .then((res) => {
              this.youtubeKey = res.data
              if (res.data.flg) {
                // 配信枠有り
                clearInterval(this.ytCheckPing)
                this.ytCheckPing = null
                this.getYoutubeComment()
              }
            })
            .catch((e) => {
              console.log(e)
            })
          limitCount++
        }, 5000)
      }
    },
    getYoutubeComment() {
      const nowDateTime = new Date().getTime()
      // コメント取得
      if (this.yuCommentPing === null) {
        this.yuCommentPing = setInterval(() => {
          axios
            .post(`${constants.url.sub}${constants.url.youtube.comment}`, {
              key: this.youtubeKey.key,
              continuation: this.youtubeKey.continuation,
            })
            .then((res) => {
              if (res.data.flg) {
                for (const oneCom of res.data.item) {
                  if (new Date(oneCom.timestamp).getTime() > nowDateTime) {
                    this.getComment(oneCom)
                  }
                }
                this.youtubeKey.continuation = res.data.nextContinuation
              } else {
                clearInterval(this.yuCommentPing)
                this.yuCommentPing = null
                this.getYoutubeKey()
              }
            })
            .catch((e) => {
              clearInterval(this.yuCommentPing)
              this.yuCommentPing = null
              this.getYoutubeKey()
            })
        }, 5000)
      }
    },
    ytConnect() {
      if (this.sockety === null) {
        // 接続
        this.sockety = new WebSocket(constants.ytws)
        // 接続確認
        this.sockety.onopen = (e) => {
          console.log('YTコネクションを開始しました')
        }
        // 疎通確認
        const checkYt = setInterval(() => {
          this.sockety.send('PING')
        }, 60000)
        // エラー発生時
        this.sockety.onerror = (error) => {
          console.log(error)
        }
        // close時
        this.sockety.onclose = (close) => {
          console.log(close)
          clearInterval(checkYt)
          this.sockety.close()
          this.sockety = null
          if (this.youtubeFlg) {
            console.log('配信中に切断の可能性有り、再接続開始')
            this.ytConnect()
          }
        }
        // メッセージ受信
        this.sockety.onmessage = (data) => {
          if (data.data === 'live') {
            console.log('配信が開始されている')
            this.youtubeFlg = true
            return
          }
          this.getComment(JSON.parse(data.data))
        }
      }
    },
    commentCountCheck(msgJson) {
      // 全角数字を半角に変換
      const numberFormat = msgJson.cm.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      })
      if (
        !isNaN(numberFormat) &&
        Number(numberFormat) >= 0 &&
        Number(numberFormat) <= 50
      ) {
        // カウント
        return false
      } else {
        // コメント
        return true
      }
    },
    getComment(commentObj) {
      let comment = ''
      let customEmoji = false

      for (let i = 0; i < commentObj.comment.length; i++) {
        if ('text' in commentObj.comment[i]) {
          comment += commentObj.comment[i].text
        } else if (commentObj.comment[i].isCustomEmoji) {
          // カスタム絵文字
          comment += `<img src="${commentObj.comment[i].emoji}" class="customEmoji">`
          customEmoji = commentObj.comment[i].isCustomEmoji
        } else if (!commentObj.comment[i].isCustomEmoji) {
          // 普通の絵文字
          comment += commentObj.comment[i].emoji
        } else {
          // console.log(commentObj)
        }
      }

      const waitTime =
        new Date().getTime() - new Date(commentObj.timestamp).getTime()

      setTimeout(() => {
        this.commentData = {
          name: commentObj.name,
          comment,
          avatar: commentObj.img,
          customEmoji,
          kbn: 'youtube',
        }

        this.commentEffect({
          cm: comment,
          u: Math.random().toString(32).substring(2),
        })
      }, waitTime)
    },
    giftCheck(msgJson) {
      // ギフトチェック
      if (msgJson.gt === 2) {
        // 投票
        if (Number(msgJson.g) > 10000 && Number(msgJson.g) <= 10070) {
          // 投票ボール
        } else if (msgJson.g === 1601) {
          // 虹星
          return false
        } else if (
          msgJson.g === 1 ||
          msgJson.g === 1001 ||
          msgJson.g === 1002 ||
          msgJson.g === 1003 ||
          msgJson.g === 2 ||
          msgJson.g === 1501 ||
          msgJson.g === 1502 ||
          msgJson.g === 1503 ||
          msgJson.g === 1504 ||
          msgJson.g === 1505
        ) {
          // 無料
          return true
        } else {
          // 星以外のフリーギフト
          return false
        }
      } else {
        // 有料
        return false
      }
    },
    commentEffect(commentObj) {
      switch (commentObj.cm) {
        case 'ぽん':
        case 'ポン':
        case 'ぽん！':
        case 'ポン！':
          this.fallPon(commentObj.u, 'fallPon', 30, 100)
          this.pon++
          break
        case 'ぽん.':
        case 'ポン.':
        case 'ぽん！.':
        case 'ポン！.':
          this.fallPon(commentObj.u, 'fallPon_bk', 30, 100)
          this.pon++
          break
        case '草':
        case 'www':
        case 'ｗｗｗ':
          this.fallAther(commentObj.u, 'kusa', 100, 100)
          break
        case '大草原':
        case 'wwwwww':
        case 'ｗｗｗｗｗｗｗｗ':
          this.fallAther(commentObj.u, 'daisougen', 100, 200)
          break
        case '88888888':
        case '８８８８８８８８':
        case '👏👏👏👏👏👏👏👏':
          this.fallAther(commentObj.u, '8_0', 25, 100)
          this.fallAther(commentObj.u, '8_1', 10, 50)
          this.fallAther(commentObj.u, '8_2', 10, 50)
          this.fallAther(commentObj.u, '8_3', 10, 50)
          break
        case 'きゅうり':
        case 'キュウリ':
        case '🥒':
          this.fallAther(commentObj.u, 'cucumber1', 25, 100)
          this.fallAther(commentObj.u, 'cucumber2', 25, 100)
          this.fallAther(commentObj.u, 'cucumber3', 25, 100)
          this.fallAther(commentObj.u, 'cucumber4', 25, 100)
          this.fallAther(commentObj.u, 'cucumber5', 25, 100)
          break
        case 'なすぅ…':
        case 'なす':
        case 'ナス':
        case '🍆':
          this.fallAther(commentObj.u, 'nasu', 25, 100)
          this.fallAther(commentObj.u, 'nasu1', 25, 100)
          break
        case '生首':
        case '首':
        case 'なまくび':
        case 'くび':
          this.fallAther(commentObj.u, 'kubi', 25, 100)
          break
        case 'むじかりこ':
          this.fallAther(commentObj.u, 'jagarico-icon', 25, 100)
          break
        default:
        // console.log('other')
      }
    },
    fallGiftFree(gift) {
      // 画面幅を取得
      const width = window.innerWidth
      const elmId = Math.random().toString(32).substring(2)

      // ギフトの数分ループ
      for (let i = 0; i < gift.n; i++) {
        // 要素のID
        const id = `gift_${gift.u}_${gift.g}_${i}_${elmId}`
        // ギフト画像の要素を作成
        const giftImgElement = document.createElement('img')
        // 画像を設定
        if (i <= 9) {
          giftImgElement.src = require(`@/assets/image/${i}.png`)
          giftImgElement.style.width = '50px'
        } else if (i === 10) {
          giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/image/avatar/${gift.av}.png?v=85`
          giftImgElement.style.width = '50px'
        } else {
          giftImgElement.src = require(`@/assets/image/${Math.floor(
            this.getRandomNum(0, 9)
          )}.png`)
          giftImgElement.style.width = '50px'
        }

        // IDを設定
        giftImgElement.setAttribute('id', id)
        // 配置位置を設定
        giftImgElement.style.position = 'absolute'
        giftImgElement.style.top = '1100px' // 画面外に配置
        giftImgElement.style.left = this.getRandomNum(10, width - 70) + 'px' // ランダムに配置
        // ギフト要素を画面に追加
        document.getElementById('gift').append(giftImgElement)

        // 動きを追加
        this.gsaoExe(id)
      }
    },
    fallGift(gift) {
      // 画面幅を取得
      const width = window.innerWidth
      const elmId = Math.random().toString(32).substring(2)

      // ギフトの数分ループ
      for (let i = 0; i < gift.n; i++) {
        // 要素のID
        const id = `gift_${gift.u}_${gift.g}_${i}_${elmId}`
        // ギフト画像の要素を作成
        const giftImgElement = document.createElement('img')
        // 画像を設定
        giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/assets/img/gift/${gift.g}_s.png`
        giftImgElement.style.width = '100px'
        // IDを設定
        giftImgElement.setAttribute('id', id)
        // 配置位置を設定
        giftImgElement.style.position = 'absolute'
        giftImgElement.style.top = '1100px' // 画面外に配置
        giftImgElement.style.left = this.getRandomNum(10, width - 70) + 'px' // ランダムに配置
        // ギフト要素を画面に追加
        document.getElementById('gift').append(giftImgElement)

        // 動きを追加
        this.gsaoExe(id)
      }
    },
    fallAther(userId, img, num, size) {
      // 画面幅を取得
      const width = window.innerWidth
      const elmId = Math.random().toString(32).substring(2)

      // ギフトの数分ループ
      for (let i = 0; i < num; i++) {
        // 要素のID
        const id = `pon_${userId}_${i}_${elmId}`
        // ギフト画像の要素を作成
        const giftImgElement = document.createElement('img')
        // 画像を設定
        giftImgElement.src = require(`@/assets/image/${img}.png`)
        giftImgElement.style.width = `${size}px`
        giftImgElement.style.zIndex = 100
        // IDを設定
        giftImgElement.setAttribute('id', id)
        // 配置位置を設定
        giftImgElement.style.position = 'absolute'
        giftImgElement.style.top = '1100px' // 画面外に配置
        giftImgElement.style.left = this.getRandomNum(10, width - 70) + 'px' // ランダムに配置
        // ギフト要素を画面に追加
        document.getElementById('gift').append(giftImgElement)

        // 動きを追加
        this.gsaoExe(id)
      }
    },
    fallPon(userId, img, num, size) {
      // 画面幅を取得
      const width = window.innerWidth
      const elmId = Math.random().toString(32).substring(2)

      // ギフトの数分ループ
      for (let i = 0; i < num; i++) {
        // 要素のID
        const id = `pon_${userId}_${i}_${elmId}`
        // ギフト画像の要素を作成
        const giftImgElement = document.createElement('img')
        // 画像を設定
        giftImgElement.src = require(`@/assets/image/${img}.png`)
        giftImgElement.style.width = `${size}px`
        giftImgElement.style.zIndex = 100
        // IDを設定
        giftImgElement.setAttribute('id', id)
        // 配置位置を設定
        giftImgElement.style.position = 'absolute'
        giftImgElement.style.top = '1100px' // 画面外に配置
        giftImgElement.style.left = this.getRandomNum(300, width - 70) + 'px' // ランダムに配置
        // ギフト要素を画面に追加
        document.getElementById('gift').append(giftImgElement)

        // 動きを追加
        this.gsaoExe(id)
      }
    },
    gsaoExe(elementId) {
      gsap.to(`#${elementId}`, {
        duration: this.getRandomNum(6, 9), // 2秒～5秒の間で移動
        rotation: this.getRandomNum(90, 720), // 回転角度
        y: -1300, // 落ちる高さ
        onComplete: () => {
          if (document.getElementById(elementId) !== null) {
            document.getElementById(elementId).remove() // 終わったら要素を削除
          }
        },
      })
      setTimeout(() => {
        if (document.getElementById(elementId) !== null) {
          document.getElementById(elementId).remove()
        }
      }, 10000)
    },
    getRandomNum(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.random() * (max - min + 1) + min
    },
  },
}
</script>

<style scoped>
#piano-bg-video {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: -100;
}

.header-title {
  position: relative;
  z-index: 2;
}

#piano-logo {
  position: absolute;
  height: 20vh;
  top: 79.5vh;
  left: -45px;
}

.pianoCommentArea {
  margin-top: 15vh;
  /* margin-right: 182px; */
  float: right;
  width: 15.5vw;
  height: 49vh;
}

.scrollbar {
  overflow: scroll;
}

.scrollbar::-webkit-scrollbar {
  display: none;
}
</style>