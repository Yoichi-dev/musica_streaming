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
      element3.textContent = comment.comment;

      let giftImgElement = document.createElement("img");
      giftImgElement.classList.add("icon");
      giftImgElement.classList.add("jump");
      giftImgElement.src = `https://image.showroom-cdn.com/showroom-prod/image/avatar/${comment.avatar}.png?v=85`;

      element1.append(element2);
      element1.append(element3);
      element3.append(giftImgElement);

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
/*フキダシ共通*/
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
/*フキダシ左*/
.kaiwa.line .fukidasi.left {
  float: left;
  margin-left: 62px;
  background: white;
}
/*グループのときのフキダシ*/
.kaiwa.line .name + .fukidasi.left {
  font-size: 30px;
  margin-top: 15px;
}
/*相手の名前*/
.kaiwa.line .name {
  clear: right;
  font-size: 20px;
  margin-left: 62px;
  color: white;
}
/*ユーザアイコン*/
.kaiwa.line .icon {
  margin-top: 10px;
  position: absolute;
  width: 40px;
  height: 40px;
  left: -54px;
  top: -2px;
}
/*グループのときのユーザアイコン*/
.kaiwa.line .name + .left .icon {
  top: -1.8em;
}
/*しっぽ共通*/
.kaiwa.line .fukidasi::after {
  position: absolute;
  content: "";
  width: 24px;
  height: 36px;
  top: -21px;
}
/*しっぽ左*/
.kaiwa.line .fukidasi.left:after {
  left: -10px;
  border-radius: 18px 0 6px 18px/18px 0 1px 18px;
  box-shadow: -3px -15px 0 -5px white inset;
}
/*しっぽ右*/
.kaiwa.line .fukidasi.right::after {
  right: -10px;
  border-radius: 0 18px 18px 6px/0 18px 18px 1px;
  box-shadow: inset 3px -15px 0 -5px #7adc40;
}
/*フキダシが続いてしっぽがないとき*/
.kaiwa.line .left + .left::after,
.kaiwa.line .right + .right::after {
  content: none;
}
</style>