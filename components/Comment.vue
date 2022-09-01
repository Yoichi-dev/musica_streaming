<template>
  <div>
    <div class="commentArea scrollbar">
      <div id="comment"></div>

      <!-- <div
        v-for="(comment, index) in commentData"
        :key="index"
        :class="'slidein kaiwa line comm' + index"
      >
        <div class="name">{{ comment.name }}</div>
        <div class="fukidasi left">
          <img
            class="icon"
            :src="
              'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
              comment.avatar +
              '.png?v=85'
            "
            alt=""
          />{{ comment.comment }}
        </div>
      </div> -->
    </div>
    <div id="hidspace">
      <img width="1px" :src="require('@/assets/image/tuna.png')" />
      <img width="1px" :src="require('@/assets/image/sika.png')" />
      <img width="1px" :src="require('@/assets/image/pon_bk.png')" />
      <img width="1px" :src="require('@/assets/image/pon.png')" />
      <img width="1px" :src="require('@/assets/image/neko.png')" />
      <img width="1px" :src="require('@/assets/image/fish.png')" />
      <img width="1px" :src="require('@/assets/image/fallPon_bk.png')" />
      <img width="1px" :src="require('@/assets/image/fallPon.png')" />
      <img width="1px" :src="require('@/assets/image/8.png')" />
      <img width="1px" :src="require('@/assets/image/8_0.png')" />
      <img width="1px" :src="require('@/assets/image/musica.png')" />
      <img width="1px" :src="require('@/assets/image/kubi.png')" />
      <img width="1px" :src="require('@/assets/image/maguro.png')" />
      <img width="1px" :src="require('@/assets/image/kyuri.png')" />
      <img width="1px" :src="require('@/assets/image/higase.png')" />
      <img width="1px" :src="require('@/assets/image/kp.png')" />
      <img width="1px" :src="require('@/assets/image/kubi.gif')" />
      <img width="1px" :src="require('@/assets/image/nasu.png')" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["commentData"],
  watch: {
    commentData: function (newData, oldData) {
      this.addComment(newData);
    },
  },
  methods: {
    addComment(comment) {
      switch (comment.comment) {
        case "ぽん":
        case "ポン":
        case "ぽん！":
        case "ポン！":
          this.createElement(comment, "200", "pon.png");
          break;
        case "ぽん.":
          this.createElement(comment, "200", "pon_bk.png");
          break;
        case "シカ":
        case "しか":
        case "鹿":
          this.createElement(comment, "200", "sika.png");
          break;
        case "シカ.":
        case "しか.":
        case "鹿.":
          this.createElement(comment, "200", "higase.png");
          break;
        case "クマ":
        case "くま":
        case "熊":
          this.createElement(comment, "125", "8.png");
          break;
        case "ネコ":
        case "ねこ":
        case "猫":
          this.createElement(comment, "200", "neko.png");
          break;
        case "88888888":
        case "８８８８８８８８":
        case "はち":
        case "ハチ":
        case "蜂":
          this.createElement(comment, "200", "8_0.png");
          break;
        case "つな":
        case "ツナ":
        case "ツナ缶":
          this.createElement(comment, "200", "tuna.png");
          break;
        case "つな.":
        case "ツナ.":
          this.createElement(comment, "200", "fish.png");
          break;
        case "出陣":
        case "ほら貝":
        case "法螺貝":
        case "ホラ貝":
          this.createElement(comment, "200", "hora.png");
          break;
        case "生首":
        case "くび":
        case "なまくび":
        case "クビ":
          this.createElement(comment, "200", "kubi.png");
          break;
        case "生首.":
        case "くび.":
        case "なまくび.":
        case "クビ.":
          this.createElement(comment, "200", "kubi.gif");
          break;
        case "マグロときゅうりの女":
        case "マグロときゅうり":
          this.createElement(comment, "200", "maguro.png");
          break;
        case "マグロときゅうりの女.":
        case "マグロときゅうり.":
          this.createElement(comment, "200", "maguro2.png");
          break;
        case "ゴールデンムジカ":
        case "ごーるでんむじか":
          this.createElement(comment, "200", "gold.png");
          break;
        case "KP.":
        case "kp.":
          this.createElement(comment, "200", "kp.png");
          break;
        case "きゅうり":
        case "キュウリ":
          this.createElement(comment, "200", "kyuri.png");
          break;
        case "きゅうり.":
        case "キュウリ.":
          this.createElement(comment, "200", "baribari.png");
          break;
        case "なす":
        case "ナス":
        case "なすぅ…":
          this.createElement(comment, "200", "nasu.png");
          break;
        case "カツオ":
        case "鰹":
          this.createElement(comment, "200", "sushi/sushi_katsuo.png");
          break;
        case "カツオ.":
        case "鰹.":
          this.createElement(comment, "200", "sushi/sashimi_katsuo_tataki.png");
          break;
        case "サーモン":
          this.createElement(comment, "200", "sushi/sushi_salmon.png");
          break;
        case "サーモン.":
          this.createElement(comment, "200", "sushi/sashimi_salmon.png");
          break;
        case "ねぎとろ軍艦":
        case "ねぎとろ":
          this.createElement(comment, "200", "sushi/sushi_negitoro.png");
          break;
        case "大トロ":
          this.createElement(comment, "200", "sushi/sushi_ootoro.png");
          break;
        case "大トロ.":
          this.createElement(comment, "200", "sushi/sashimi_maguro_ootoro.png");
          break;
        case "タイ":
        case "鯛":
          this.createElement(comment, "200", "sushi/sushi_tai.png");
          break;
        case "タイ.":
        case "鯛.":
          this.createElement(comment, "200", "sushi/sashimi_tai.png");
          break;
        case "ガリ":
          this.createElement(comment, "200", "sushi/gari.png");
          break;
        case "ウニの軍艦":
        case "ウニ軍艦":
          this.createElement(comment, "200", "sushi/sushi_uni2.png");
          break;
        case "いなり寿司":
        case "いなり":
          this.createElement(comment, "200", "sushi/inarizushi.png");
          break;
        case "玉子":
          this.createElement(comment, "200", "sushi/sushi_tamago.png");
          break;
        case "かっぱ巻き":
          this.createElement(comment, "200", "sushi/makimono_kappa.png");
          break;
        case "海老":
        case "エビ":
          this.createElement(comment, "200", "sushi/sushi_ebi.png");
          break;
        case "かんぴょう巻き":
        case "かんぴょう":
          this.createElement(comment, "200", "sushi/makimono_kanpyo.png");
          break;
        case "えんがわ":
          this.createElement(comment, "200", "sushi/sushi_engawa.png");
          break;
        case "ネギトロ":
          this.createElement(comment, "200", "sushi/makimono_negitoro.png");
          break;
        case "ホタテ":
          this.createElement(comment, "200", "sushi/sushi_hotate.png");
          break;
        case "いくら":
        case "イクラ":
          this.createElement(comment, "200", "sushi/sushi_ikura.png");
          break;
        case "イカ":
          this.createElement(comment, "200", "sushi/sushi_ika.png");
          break;
        case "イカ.":
          this.createElement(comment, "200", "sushi/sashimi_ika.png");
          break;
        case "鉄火巻き":
          this.createElement(comment, "200", "sushi/makimono_tekkamaki.png");
          break;
        case "イワシ":
        case "鰯":
          this.createElement(comment, "200", "sushi/sushi_iwashi.png");
          break;
        case "赤貝":
          this.createElement(comment, "200", "sushi/sushi_akagai.png");
          break;
        case "数の子":
          this.createElement(comment, "200", "sushi/sushi_kazunoko.png");
          break;
        case "マグロ":
        case "鮪":
          this.createElement(comment, "200", "sushi/sushi_akami.png");
          break;
        case "マグロ.":
        case "鮪.":
          this.createElement(comment, "200", "sushi/sashimi_maguro_akami.png");
          break;
        case "甘エビ":
          this.createElement(comment, "200", "sushi/sushi_amaebi.png");
          break;
        case "こはだ":
        case "小鰭":
          this.createElement(comment, "200", "sushi/sushi_kohada.png");
          break;
        case "バッテラ":
        case "鯖寿司":
          this.createElement(comment, "200", "sushi/sushi_battera.png");
          break;
        case "ブリ":
        case "鰤":
          this.createElement(comment, "200", "sushi/sushi_buri.png");
          break;
        case "ブリ.":
        case "鰤.":
          this.createElement(comment, "200", "sushi/sashimi_buri.png");
          break;
        case "アナゴ":
        case "穴子":
          this.createElement(comment, "200", "sushi/sushi_anago.png");
          break;
        case "中トロ":
          this.createElement(comment, "200", "sushi/sushi_chutoro.png");
          break;
        case "中トロ.":
          this.createElement(
            comment,
            "200",
            "sushi/sashimi_maguro_chutoro.png"
          );
          break;
        case "ツナの軍艦":
        case "ツナ軍艦":
          this.createElement(comment, "200", "sushi/sushi_tsuna.png");
          break;
        case "ハマチ":
        case "魬":
          this.createElement(comment, "200", "sushi/sushi_hamachi.png");
          break;
        case "ハマチ.":
        case "魬.":
          this.createElement(comment, "200", "sushi/sashimi_hamachi.png");
          break;
        case "タコ":
        case "蛸":
          this.createElement(comment, "200", "sushi/sushi_tako.png");
          break;
        case "タコ.":
        case "蛸.":
          this.createElement(comment, "200", "sushi/sashimi_tako.png");
          break;
        case "カンパチ":
          this.createElement(comment, "200", "sushi/sashimi_kanpachi.png");
          break;
        case "アジ":
          this.createElement(comment, "200", "sushi/sashimi_aji.png");
          break;
        case "プリン":
          this.createElement(comment, "200", "sushi/sweets_purin.png");
          break;
        case "むじかりこ":
          this.createElement(comment, "200", "jagarico.png");
          break;
        case "鳩に豆鉄砲":
        case "ハト":
        case "鳩":
          this.createElement(comment, "200", "hato.png");
          break;
        case "確定申告":
          this.createElement(comment, "200", "zei_kakuteishinkoku.png");
          break;
        case "源泉徴収票":
          this.createElement(comment, "200", "document_gensen_chousyuhyou.png");
          break;
        default:
          this.createElement(comment, "none", "");
      }
    },
    createElement(comment, width, img) {
      let element1 = document.createElement("div");
      element1.classList.add("slidein");
      element1.classList.add("kaiwa");
      element1.classList.add("line");

      let element2 = document.createElement("div");
      element2.classList.add("name");
      element2.textContent = comment.name;

      let element3 = document.createElement("div");
      element3.classList.add("fukidasi");
      element3.classList.add("left");

      let giftImgElement = document.createElement("img");
      giftImgElement.classList.add("icon");
      giftImgElement.classList.add("jump");
      giftImgElement.src = comment.avatar;

      if (width === "none") {
        element3.textContent = comment.comment;
        element1.append(element2);
        element1.append(element3);
        element3.append(giftImgElement);
      } else {
        element3.classList.add("stamp");
        let stampElement = document.createElement("img");
        stampElement.width = width;
        stampElement.src = require(`@/assets/image/${img}`);
        element1.append(element2);
        element1.append(element3);
        element3.append(stampElement);
        element3.append(giftImgElement);
      }

      let myMain = document.getElementById("comment");
      myMain.parentNode.insertBefore(element1, myMain.nextElementSibling);
    },
  },
};
</script>

<style>
.scrollbar {
  overflow: scroll;
}

.scrollbar::-webkit-scrollbar {
  display: none;
}

.commentArea {
  margin-top: 5.5vh;
  margin-right: 7px;
  float: right;
  width: 19vw;
  height: 68vh;
}

#hidspace {
  opacity: 0;
}

.stamp {
  background: initial !important;
}
.stamp::after {
  box-shadow: initial !important;
}

.slidein {
  animation: slideIn 1s cubic-bezier(0.25, 1, 0.5, 1) 1 forwards;
}

@keyframes slideIn {
  0% {
    transform: translateX(180px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
  }
  40%,
  100% {
    opacity: 1;
  }
}

.jump {
  animation-name: jump;
  animation-iteration-count: 2;
  animation-duration: 0.5s;
}

@keyframes jump {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.kaiwa.line {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 10px 0;
  font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro",
    "Helvetica Neue", "Lucida Sans Unicode", "Arial";
  font-size: 16px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
}

.kaiwa.line .fukidasi {
  position: relative;
  display: inline-block;
  max-width: 300px;
  margin: 8px 0 0;
  padding: 9px 14px;
  border-radius: 19px;
  overflow-wrap: break-word;
  clear: both;
  box-sizing: content-box; /*はてな用*/
}

.kaiwa.line .fukidasi.left {
  float: left;
  margin-left: 62px;
  background: white;
}

.kaiwa.line .name + .fukidasi.left {
  font-size: 30px;
  margin-top: 15px;
}

.kaiwa.line .name {
  clear: right;
  font-size: 20px;
  margin-left: 62px;
  color: white;
}

.kaiwa.line .icon {
  margin-top: 10px;
  position: absolute;
  width: 50px;
  height: 50px;
  left: -54px;
  top: -2px;
}

.kaiwa.line .name + .left .icon {
  top: -1.8em;
}

.kaiwa.line .fukidasi::after {
  position: absolute;
  content: "";
  width: 24px;
  height: 36px;
  top: -21px;
}

.kaiwa.line .fukidasi.left:after {
  left: -10px;
  border-radius: 18px 0 6px 18px/18px 0 1px 18px;
  box-shadow: -3px -15px 0 -5px white inset;
}

.kaiwa.line .left + .left::after {
  content: none;
}
</style>