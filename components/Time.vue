<template>
  <div class="nowtime">
    <p id="t" />
    <p id="addcount" class="countdown">
      <span id="min">
        {{ m }}
      </span>
      分
      <span id="sec">{{ s }}</span>
      秒
    </p>
  </div>
</template>

<script>
export default {
  name: 'TimeComponents',
  data() {
    return {
      elapsedTime: null,
      endTime: '',
      d: '0',
      h: '0',
      m: '0',
      s: '0',
      counter: null,
      counterh: null,
      inputTimer: 0,
      countTime: 0,
    }
  },
  mounted() {
    if (this.$route.query.watch === undefined) {
      if (this.$route.query.timer === undefined) {
        document.getElementById('addcount').hidden = true
      } else if (
        this.$route.query.timer === 20 ||
        this.$route.query.timer === 80
      ) {
        this.countTime = 1200
      } else {
        document.getElementById('addcount').hidden = true
      }

      const day = function () {
        const dt = dayjs(new Date()) // eslint-disable-line
        const element = document.getElementById('t')
        element.innerHTML = `<div id="time">${dt.format(
          'HH'
        )}<span id="colon">:</span>${dt.format('mm')}</div>
                           <div id="date">${dt.format('MM/DD')}</div>
                           <div id="dated">${dt.format('ddd')}</div>`
      }
      setInterval(day, 1000)
    }
  },
}
</script>

<style>
.nowtime {
  margin-top: 16.5vh;
  text-align: center;
  font-family: 'system-ui', sans-serif;
  color: rgb(255, 255, 255);
  position: absolute;
  margin-left: 87.7vw;
  transform: translate(-50%, 0);
  width: 180px;
  padding: 10px 10px 5px 10px;
  border-radius: 0px 0px 10px 10px;
}

#time {
  line-height: 1em;
  letter-spacing: 3px;
  font-size: 50px;
}

#date {
  line-height: 1.5em;
  letter-spacing: 3px;
  font-size: 20px;
}
#dated {
  line-height: 1.5em;
  letter-spacing: 3px;
  font-size: 10px;
}

#colon {
  vertical-align: 7%;
}

#t {
  margin-top: 0px;
  margin-bottom: 5px;
}

.countdown {
  line-height: 0.1em;
  letter-spacing: 3px;
  font-size: 30px;
}
</style>