<template>
  <div class="body">
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
          @click="
            chooseCountdown(countdownSetting.shortBreakTime, 'shortBreak')
          "
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
        {{ countdownMinutes | changeNumberDisplay }}:
        {{ countdownSeconds | changeNumberDisplay }}
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

      <!-- 清單表頭 -->
      <div class="tasks-wrapper mt-4">
        <div class="list-head d-flex justify-content-between">
          <div class="task-head">待辦事項列表</div>
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="manage-task"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              管理列表
            </button>
            <div class="dropdown-menu" aria-labelledby="manage-task">
              <button @click="deleteTask('allTask')" class="dropdown-item">
                刪除所有待辦
              </button>
              <button class="dropdown-item">清除所有記數</button>
              <button class="dropdown-item"></button>
            </div>
          </div>
        </div>

        <div class="task-list mt-2" v-for="task in tasks" :key="task.id">
          <!-- 列表 最外層標題  -->
          <div class="d-flex justify-content-between">
            <div>
              <input type="checkbox" name="" />
              <span>{{ task.title }}</span>
            </div>
            <div>
              <span>後續要補上數字? / ? </span>
              <span for="task-setting" @click="toggleSetting(task.id)"
                >設定</span
              >
            </div>
          </div>
          <!-- 設定內容 -->
          <form class="edit-task" v-if="task.id === clickId">
            <!-- title -->
            <span> 待辦事項:</span>
            <input type="text" v-model="task.title" />
            <!-- 計次 -->
            <div>
              <p>已使用/預計需要 幾個番茄時鐘</p>
              <input type="number" v-model="times" />
              <span> / </span>
              <input type="number" min="1" />
            </div>
            <!-- note -->
            <div>
              <div>註解</div>
              <textarea type="text" name="note" id="" />
            </div>
            <!-- 按鈕 -->
            <div class="d-flex justify-content-around">
              <button @click="deleteTask(task.id)">刪除</button>
              <button class="mr-4" @click="toggleSetting('close')">取消</button>
              <button type="submit" class="mr-2 btn btn-primary">確認</button>
            </div>
          </form>
        </div>
        <div>
          <div @click="toggleSetting('new')">新增</div>
        </div>
        <!-- 新增 -->
        <!-- 設定內容 -->
        <form class="create-task" v-if="clickId === 'new'">
          <!-- title -->
          <span> 待辦事項:</span>
          <input type="text" />
          <!-- 計次 -->
          <div>
            <p>預計需要 幾個番茄時鐘</p>
            <input type="number" min="1" />
          </div>
          <!-- note -->
          <div>
            <div>註解</div>
            <textarea type="text" name="note" id="" />
          </div>
          <!-- 按鈕 -->
          <div class="d-flex justify-content-around">
            <button>刪除</button>
            <button class="mr-4" @click="toggleSetting('close')">取消</button>
            <button type="submit" class="mr-2 btn btn-primary">確認</button>
          </div>
        </form>
        <!-- 新增-->
      </div>
    </div>
  </div>
</template>


<script>
import TimeSettingModal from "../components/TimeSettingModal.vue";
// import { v4 as uuidv4 } from "uuid";

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
          note: "",
          estimatedTimes: 1,
          executedTimes: 0,
        },
        {
          title: "待辦事項222",
          id: 2,
          complete: false,
          note: "",
          estimatedTimes: 1,
          executedTimes: 0,
        },
        {
          title: "待辦事項3333",
          id: 3,
          complete: false,
          note: "",
          estimatedTimes: 1,
          executedTimes: 0,
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
      clickId: "close",
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
    toggleSetting(taskId) {
      this.clickId = taskId;
    },
    deleteTask(taskId) {
      if (taskId === "allTask") {
        this.tasks = [];
      } else {
        console.log("in");
        this.tasks = this.tasks.filter((task) => {
          return task.id !== taskId;
        });
      }
    },
  },
  // 原本 預計 用 filters 功能 讓 秒數=0 ; 回傳 00
  // 後續想到 可以在 倒數計時的功能裡面 達成這項功能
  filters: {
    changeNumberDisplay(n) {
      if (n === 0) {
        return "00";
      } else return n;
    },
  },
};
</script>

<style>
.body {
  background-color: brown;
  min-height: 100vh;
}

.main {
  margin: 0 auto;
  width: 400px;
}

.display-countdown {
  width: 100%;
  height: 30%;
  font-size: 120px;
  font-weight: bold;
  text-align: center;
}

.task-list {
  border: 1px solid black;
  margin-top: 2px;
}
</style>

