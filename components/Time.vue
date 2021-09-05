<template>
  <div class="nowtime">
    <p id="t" />
  </div>
</template>

<script>
export default {
  mounted() {
    const day = function () {
      const dt = dayjs(new Date());
      const element = document.getElementById("t");
      element.innerHTML = `<div id="time">${dt.format(
        "HH"
      )}<span id="colon">:</span>${dt.format("mm")}</div>
                           <div id="date">${dt.format("MM/DD ddd")}</div>`;
    };
    setInterval(day, 1000);
  },
  methods: {},
};
</script>

<style>
.nowtime {
  text-align: center;
  font-family: "Roboto", sans-serif;
  /* ▼ ここでテキストの色を変更 ▼ */
  color: rgb(255, 255, 255);
  /* ▲ ここでテキストの色を変更 ▲ */
  position: absolute;
  top: 0;
  left: 8%;
  transform: translate(-50%, 0);
  width: 180px;
  padding: 10px 10px 5px 10px;
  border-radius: 0px 0px 10px 10px;
  /* ▼ ここで背景の色を変更 ▼ */
  background: #ff95a7;
  /* ▲ ここで背景の色を変更 ▲ */
}

#time {
  line-height: 1em; /* 行間 */
  letter-spacing: 3px; /* 字間 */
  font-size: 60px;
  /* ▼ ここで線の色を変更 ▼ */
  border-bottom: solid 2px;
  /* ▲ ここで線の色を変更 ▲ */
}

#date {
  line-height: 1.5em; /* 行間 */
  letter-spacing: 3px;
  font-size: 30px;
}

#colon {
  vertical-align: 7%;
}

#t {
  margin-top: 0px;
  margin-bottom: 5px;
}
</style>