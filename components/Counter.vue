<template>
  <div>
    <div class="poncounter" id="hiddenFlg">
      <img
        v-if="hundredFlg"
        width="70px"
        class="countUp"
        :src="require('@/assets/image/counter/' + hundred + '.png')"
      />
      <img
        v-if="tenFlg"
        width="70px"
        class="countUp"
        :src="require('@/assets/image/counter/' + ten + '.png')"
      />
      <img
        v-if="oneFlg"
        width="70px"
        class="countUp"
        id="one"
        :src="require('@/assets/image/counter/' + one + '.png')"
      />
    </div>
    <div class="poncounterimg">
      <div id="ponimg"></div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  props: ["pon"],
  watch: {
    pon: function (newData, oldData) {
      this.countImg(newData + "");
      this.execImg(newData);
      this.time = 2;
      if (this.checkCount != null) {
        clearInterval(this.checkCount);
      }

      this.checkCount = setInterval(() => {
        if (this.time == 2) {
          document.getElementById("hiddenFlg").classList.remove("fadeout");
        }
        if (this.time == -1) {
        } else if (this.time == 0) {
          document.getElementById("hiddenFlg").classList.add("fadeout");
          this.time--;
        } else {
          this.time--;
        }
      }, 500);
    },
  },
  data() {
    return {
      time: 2,
      checkCount: null,
      hundred: 0,
      ten: 0,
      one: 0,
      hundredFlg: false,
      tenFlg: false,
      oneFlg: false,
    };
  },
  mounted() {},
  methods: {
    countImg(count) {
      if (count.length === 1) {
        this.oneFlg = true;
        this.one = count;
      } else if (count.length === 2) {
        this.tenFlg = true;
        if (this.ten != count.charAt(count.length - 2)) {
          this.ten = count.charAt(count.length - 2);
        }
        this.one = count.slice(-1);
      } else if (count.length === 3) {
        this.hundredFlg = true;
        if (this.hundred != count.charAt(count.length - 3)) {
          this.hundred = count.charAt(count.length - 3);
        }
        if (this.ten != count.charAt(count.length - 2)) {
          this.ten = count.charAt(count.length - 2);
        }
        this.one = count.slice(-1);
      }
    },
    execImg(count) {
      let id = `pon_${count}`;
      let ponImgElement = document.createElement("img");
      ponImgElement.src = require(`@/assets/image/PONmujika_NonLoop.gif`);
      ponImgElement.src = ponImgElement.src + `?id=${count}`;
      ponImgElement.setAttribute("id", id);

      ponImgElement.style.position = "absolute";
      ponImgElement.style.width = `400px`;
      ponImgElement.style.zIndex = 999;

      ponImgElement.style.opacity = 0;

      document.getElementById("ponimg").append(ponImgElement);

      gsap.to(`#${id}`, {
        keyframes: {
          "0%": { x: 50, y: 0, opacity: 1 },
          "50%": { x: 10, y: -40, opacity: 1 },
          "100%": { x: -30, y: -10, opacity: 1 },
          easeEach: "none",
        },
        duration: 2,
        onComplete: () => {
          document.getElementById(id).remove();
        },
      });
    },
  },
};
</script>

<style>
.fadeout {
  animation: fadein-keyframes 2.5s ease 0s 1 forwards;
}

@keyframes fadein-keyframes {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.poncounterimg {
  margin-top: 30vh;
  /* margin-left: 5vw; */
  position: absolute;
  z-index: 999;
}

.poncounter {
  margin-top: 20vh;
  margin-left: 3vw;
  position: absolute;
  z-index: 999;
}
</style>