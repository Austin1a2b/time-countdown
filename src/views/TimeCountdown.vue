<template>
  <div class="main">
    <div class="d-flex justify-content-around change-time-countdown">
      <button
        type="button"
        class="btn btn-outline-info"
        @click="focusCountdown"
      >
        專注時間
      </button>
      <button
        type="button"
        class="btn btn-outline-info"
        @click="shortBreakCountdown"
      >
        小休息時間
      </button>
      <button
        type="button"
        class="btn btn-outline-info"
        @click="longBreakCountdown"
      >
        長休息時間
      </button>
    </div>
    <div class="display-countdown">
      {{ countdownMinutes }}:{{ countdownSeconds | changeSecondDisplay }}
    </div>
    <div class="d-flex justify-content-around">
      <button @click.stop.prevent="startCountdown">開始</button>
      <TimeSettingModal
        :countdownSetting="countdownSetting"
        @after-saveSetting="afterSaveSetting"
      />
    </div>

    <div>專注次數 {{ times }}</div>

    <div class="task-wrapper mt-4">
      <div class="list-head d-flex justify-content-around">
        <div class="task-head">待辦事項列表</div>
        <div class="setting-task">設定</div>
      </div>

      <div class="task-list mt-2">
        <ul>
          <li class="list-group-item" v-for="task in tasks" :key="task.id">
            <!--  <li class="list-group-item "   -->
            <input type="checkbox" />
            {{ task.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import TimeSettingModal from "../components/TimeSettingModal.vue";

export default {
  components: {
    TimeSettingModal,
  },
  data() {
    return {
      tasks: [
        {
          title: "待辦事項1",
          id: 1,
          complete: false,
        },
        {
          title: "待辦事項222",
          id: 2,
          complete: false,
        },
        {
          title: "待辦事項3333",
          id: 3,
          complete: false,
        },
      ],
      countdownMinutes: 0,
      countdownSeconds: 0,
      // 後續數值  要能跟子層互動( 待設定)
      countdownSetting: {
        focusTime: "25",
        shortBreakTime: "05",
        longBreakTime: "30",
      },
      times: 1,
    };
  },
  methods: {
    focusCountdown() {
      this.countdownMinutes = this.countdownSetting.focusTime;
    },
    shortBreakCountdown() {
      this.countdownMinutes = this.countdownSetting.shortBreakTime;
    },
    longBreakCountdown() {
      this.countdownMinutes = this.countdownSetting.longBreakTime;
    },
    afterSaveSetting(setting) {
      this.countdownSetting = { ...setting };
    },
  },
  // 原本 預計 用 filters 功能 讓 秒數=0 ; 回傳 00
  // 後續想到 可以在 倒數計時的功能裡面 達成這項功能
  filters: {
    changeSecondDisplay(n) {
      if (n === 0) {
        return "00";
      } else return n;
    },
  },
};
</script>

<style>
.main {
  margin: 5% auto 0;
  width: 400px;
}
.display-countdown {
  width: 100%;
  height: 30%;
  font-size: 120px;
  font-weight: bold;
  text-align: center;
}
</style>