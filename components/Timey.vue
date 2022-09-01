<template>
  <div class="ynowtime">
    <p id="yt" />

    <p id="yaddcount" class="ycountdown">
      <span id="ymin">{{ m }}</span
      >分 <span id="ysec">{{ s }}</span
      >秒
    </p>
  </div>
</template>

<script>
export default {
  props: ["startTime"],
  watch: {
    startTime: function (newData, oldData) {
      this.endTime = newData;
      this.countTimerOne();
    },
  },
  data() {
    return {
      elapsedTime: null,
      endTime: "",
      d: "0",
      h: "0",
      m: "0",
      s: "0",
      counter: null,
      counterh: null,
      inputTimer: 0,
      countTime: 0,
    };
  },
  mounted() {
    if (this.$route.query.watch === undefined) {
      if (this.$route.query.timer === undefined) {
        document.getElementById("yaddcount").hidden = true;
      } else {
        if (this.$route.query.timer == 20 || this.$route.query.timer == 80) {
          // this.inputTimer = this.$route.query.timer * 60;
          this.countTime = 1200;
        } else {
          document.getElementById("yaddcount").hidden = true;
        }
      }

      const day = function () {
        const dt = dayjs(new Date());
        const element = document.getElementById("yt");
        element.innerHTML = `<div id="ytime">${dt.format(
          "HH"
        )}<span id="ycolon">:</span>${dt.format("mm")}</div>
                           <div id="ydate">${dt.format("MM/DD")}</div>
                           <div id="ydated">${dt.format("ddd")}</div>`;
      };
      setInterval(day, 1000);
    }
  },
  methods: {
    countTimerOne() {
      // 経過時間
      this.counter = setInterval(() => {
        let gap =
          new Date((this.endTime + this.countTime) * 1000).getTime() -
          new Date().getTime();

        let second = 1000;
        let minute = second * 60;
        let hour = minute * 60;

        this.m = Math.floor((gap % hour) / minute);
        this.s = Math.floor((gap % minute) / second);

        if (this.m == 0 && this.s == 0) {
          console.log("切り替え");
          if (this.countTime == 1200) {
            this.countTime = 4800;
            this.countTimerTow();
          } else {
            clearInterval(this.counter);
          }
        }
      }, 1000);
    },
    countTimerTow() {
      // 経過時間
      this.counterh = setInterval(() => {
        let gap =
          new Date((this.endTime + this.countTime) * 1000).getTime() -
          new Date().getTime();

        let second = 1000;
        let minute = second * 60;
        let hour = minute * 60;

        this.m = Math.floor((gap % hour) / minute);
        this.s = Math.floor((gap % minute) / second);

        if (this.m == 0 && this.s == 0) {
          clearInterval(this.counterh);
        }
      }, 1000);
    },
  },
};
</script>

<style>
.ynowtime {
  margin-top: 16.5vh;
  text-align: center;
  font-family: "Roboto", sans-serif;
  /* ▼ ここでテキストの色を変更 ▼ */
  color: rgb(255, 255, 255);
  /* ▲ ここでテキストの色を変更 ▲ */
  position: absolute;
  margin-left: 87.7vw;
  /* float: right; */
  /* top: 0; */
  /* left: 8%; */
  transform: translate(-50%, 0);
  width: 180px;
  padding: 10px 10px 5px 10px;
  border-radius: 0px 0px 10px 10px;
  /* ▼ ここで背景の色を変更 ▼ */
  /* background: #ff95a7; */
  /* ▲ ここで背景の色を変更 ▲ */
}

#ytime {
  line-height: 1em; /* 行間 */
  letter-spacing: 3px; /* 字間 */
  font-size: 50px;
  /* ▼ ここで線の色を変更 ▼ */
  /* border-bottom: solid 2px; */
  /* ▲ ここで線の色を変更 ▲ */
}

#ydate {
  line-height: 1.5em; /* 行間 */
  letter-spacing: 3px;
  font-size: 20px;
}
#ydated {
  line-height: 1.5em; /* 行間 */
  letter-spacing: 3px;
  font-size: 10px;
}

#ycolon {
  vertical-align: 7%;
}

#yt {
  margin-top: 0px;
  margin-bottom: 5px;
}

.ycountdown {
  line-height: 0.1em; /* 行間 */
  letter-spacing: 3px; /* 字間 */
  font-size: 30px;
}
</style>