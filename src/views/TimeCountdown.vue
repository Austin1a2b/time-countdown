<template>
  <div class="main">
    <div class="d-flex justify-content-around change-time-countdown">
      <button
        type="button"
        class="btn btn-outline-info"
        @click="chooseCountdown(countdownSetting.focusTime, 'focus')"
      >
        專注時間
      </button>
      <button
        type="button"
        class="btn btn-outline-info"
        @click="chooseCountdown(countdownSetting.shortBreakTime, 'shortBreak')"
      >
        小休息時間
      </button>
      <button
        type="button"
        class="btn btn-outline-info"
        @click="chooseCountdown(countdownSetting.longBreakTime, 'longBreak')"
      >
        長休息時間
      </button>
    </div>
    <div class="display-countdown">
      {{ countdownMinutes }}:{{ countdownSeconds | changeSecondDisplay }}
    </div>
    <div class="d-flex justify-content-around">
      <button
        @click.stop.prevent="startCountdown"
        v-if="countdownState === 'pause'"
      >
        開始
      </button>
      <button @click.stop.prevent="pauseCountdown(setIntervalId)" v-else>
        暫停
      </button>
      <TimeSettingModal
        :countdown-setting="countdownSetting"
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
      countdownState: "pause",
      countdownMinutes: 25,
      countdownSeconds: 0,
      countdownSetting: {
        focusTime: 25,
        shortBreakTime: 5,
        longBreakTime: 30,
      },
      times: 1,
      countdownMode: "focus",
      setIntervalId: -1,
    };
  },
  methods: {
    chooseCountdown(time, mode) {
      this.countdownMinutes = time;
      this.countdownSeconds = 0;
      this.countdownMode = mode;
    },
    afterSaveSetting(setting) {
      this.countdownSetting = { ...setting };
    },
    startCountdown() {
      this.countdownState = "start";
      this.setIntervalId = setInterval(() => {
        if (this.countdownSeconds !== 0) {
          this.countdownSeconds--;
        } else if (this.countdownMinutes !== 0) {
          this.countdownSeconds = 59;
          this.countdownMinutes--;
        } else {
          clearInterval(this.setIntervalId);
          this.countdownState = "pause";
          this.timeIsUp();
        }
      }, 1000);
    },
    pauseCountdown(id) {
      clearInterval(id);
      this.countdownState = "pause";
    },
    timeIsUp() {
      if (this.countdownMode === "focus" && this.times % 4 !== 0) {
        this.times++;
        this.chooseCountdown(
          this.countdownSetting.shortBreakTime,
          "shortBreak"
        );
      } else if (this.countdownMode === "shortBreak") {
        this.chooseCountdown(this.countdownSetting.focusTime, "focus");
      } else if (this.countdownMode === "focus") {
        this.times++;
        this.chooseCountdown(this.countdownSetting.longBreakTime, "longBreak");
      } else if (this.countdownMode === "longBreak") {
        this.chooseCountdown(this.countdownSetting.focusTime, "focus");
      }
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