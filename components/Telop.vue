<template>
  <div id="hiddenFlg" class="fadeout">
    <div class="telopArea" v-if="telop != ''">
      <div class="balloon-set-box right">
        <div class="balloon font-size">{{ telop }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["telop"],
  data() {
    return {
      flg: true,
      timeCheck: null,
      time: 5,
    };
  },
  watch: {
    telop: function (newTelop, oldTelop) {
      console.log(this.telop);
      if (newTelop != oldTelop) {
        this.time = 5;
      }
    },
  },
  mounted() {
    this.timeCheck = setInterval(() => {
      if (this.time == 5) {
        document.getElementById("hiddenFlg").classList.remove("fadeout");
      }
      if (this.time == -1) {
      } else if (this.time == 0) {
        document.getElementById("hiddenFlg").classList.add("fadeout");
        this.time--;
      } else {
        this.time--;
      }
    }, 1000);
  },
};
</script>

<style scoped>
.telopArea {
  width: 30vw;
  margin-top: 55vh;
  margin-right: 15px;
  float: right;
}

.fadeout {
  animation: fadein-keyframes 3s ease 0s 1 forwards;
}

@keyframes fadein-keyframes {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.font-size {
  font-size: 3em;
}

.balloon-set-box {
  display: flex;
  flex-wrap: wrap;
}

.balloon-set-box.right {
  flex-direction: row-reverse;
}

.balloon {
  position: relative;
  display: inline-block;
  max-width: 500px;
  margin: 10px 20px 20px;
  padding: 8px 15px;
  background: #ffffff;
  text-align: left;
  border-radius: 15px;
}

.balloon::after {
  content: "";
  border: 14px solid transparent;
  border-top-color: #ffffff;
  position: absolute;
  top: 0;
}

.right .balloon::after {
  right: -10px;
}
</style>