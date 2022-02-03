<template>
  <div>
    <div id="counter" :value="sansyuCount">
      <span id="before"></span>
      <span id="number">{{ sansyuCount }}</span>
      <span id="after"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["sansyuCount"],
  data() {
    return {
      sansyu: 0,
    };
  },
};
</script>

<style scoped>
#counter {
  float: right;
  margin-top: 5vh;
  margin-right: 10px;
  position: relative;
  color: rgba(0, 0, 0, 0);
  font-size: 0;
}
#number {
  display: block;
  width: 132px;
  height: 489px;
  position: relative;
  background: url("~/assets/image/kasoTower.svg");
  background-repeat: no-repeat;
  background-size: 4400px 489px;
  background-position: calc(-200px * 20) 0;
  z-index: 2;
}
#counter[value="0"] > #number {
  background-position: calc(-200px * 0) 0;
}
#counter[value="1"] > #number {
  background-position: calc(-200px * 1) 0;
}
#counter[value="2"] > #number {
  background-position: calc(-200px * 2) 0;
}
#counter[value="3"] > #number {
  background-position: calc(-200px * 3) 0;
}
#counter[value="4"] > #number {
  background-position: calc(-200px * 4) 0;
}
#counter[value="5"] > #number {
  background-position: calc(-200px * 5) 0;
}
#counter[value="6"] > #number {
  background-position: calc(-200px * 6) 0;
}
#counter[value="7"] > #number {
  background-position: calc(-200px * 7) 0;
}
#counter[value="8"] > #number {
  background-position: calc(-200px * 8) 0;
}
#counter[value="9"] > #number {
  background-position: calc(-200px * 9) 0;
}
#counter[value="10"] > #number {
  background-position: calc(-200px * 10) 0;
}
#counter[value="11"] > #number {
  background-position: calc(-200px * 11) 0;
}
#counter[value="12"] > #number {
  background-position: calc(-200px * 12) 0;
}
#counter[value="13"] > #number {
  background-position: calc(-200px * 13) 0;
}
#counter[value="14"] > #number {
  background-position: calc(-200px * 14) 0;
}
#counter[value="15"] > #number {
  background-position: calc(-200px * 15) 0;
}
#counter[value="16"] > #number {
  background-position: calc(-200px * 16) 0;
}
#counter[value="17"] > #number {
  background-position: calc(-200px * 17) 0;
}
#counter[value="18"] > #number {
  background-position: calc(-200px * 18) 0;
}
#counter[value="19"] > #number {
  background-position: calc(-200px * 19) 0;
}
#counter[value="20"] > #number {
  background-position: calc(-200px * 20) 0;
}
#counter[value="20"] > #after {
  content: "";
  display: block;
  width: 132px;
  height: 489px;
  position: absolute;
  top: 0;
  left: 0;
  background: url("~/assets/image/kasoTower.svg");
  background-repeat: no-repeat;
  background-size: 4400px 489px;
  background-position: calc(-200px * 21) 0;
  animation: towerAnime 0.5s infinite;
  z-index: 3;
}
@keyframes towerAnime {
  0% {
    opacity: 0;
  }
  49% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
#counter[value="20"] > #before {
  content: "";
  display: block;
  width: 1260px;
  height: 1260px;
  position: absolute;
  top: -590px;
  left: -564px;
  background: url("~/assets/image/kasoShine.svg");
  background-repeat: no-repeat;
  background-size: 1260px 1260px;
  animation: shineAnime 4s linear infinite;
  z-index: 1;
}
@keyframes shineAnime {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>