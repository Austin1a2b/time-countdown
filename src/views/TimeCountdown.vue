<template>
  <div class="body">
    <div class="main">
      <div class="pt-5 d-flex justify-content-around change-time-countdown">
        <button
          type="button"
          class="btn btn-outline-info"
          @click="chooseCountdown('focus')"
        >
          專注時間
        </button>
        <button
          type="button"
          class="btn btn-outline-info"
          @click="chooseCountdown('shortBreak')"
        >
          小休息時間
        </button>
        <button
          type="button"
          class="btn btn-outline-info"
          @click="chooseCountdown('longBreak')"
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
      
      <TaskList
        :tasks="tasks"
        :executeTaskId="executeTaskId"
        @after-deleteTask="afterDeleteTask"
        @after-create-task="afterCreateTask"
        @after-edit-task="afterEditTask"
        @change-execute-task="changeExecuteTask"
      />
    </div>
  </div>
</template>


<script>
import TimeSettingModal from "../components/TimeSettingModal.vue";
import TaskList from "../components/TaskList.vue";
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    TimeSettingModal,
    TaskList,
  },
  data() {
    return {
      tasks: [
        {
          title: "待辦事項1",
          id: "1",
          complete: true,
          estimatedTimes: 3,
          executedTimes: 1,
          note: "內容長一點 測試換行 與版面-----內容長一點 測試換行 與版面內容長一點 測試換行 與版面內容長一點 測試換行 與版面內容長一點 測試換行 與版面內容長一點 測試換行 與版面內容長一點 測試換行 與版面內容長一點 測試換行 與版面",
        },
        {
          title: "待辦事項222",
          id: "2",
          complete: false,
          estimatedTimes: 4,
          executedTimes: 2,
          note: "這邊是 註解 2",
        },
        {
          title: "待辦事項3333",
          id: "3",
          complete: false,
          estimatedTimes: 5,
          executedTimes: 2,
          note: "這邊是 註解 3",
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
      executeTaskId: "-1",
    };
  },
  methods: {
    chooseCountdown(mode) {
      if (this.countdownState === "start") {
        console.log("要設計提醒視窗");
      }
      this.countdownMode = mode;
      this.countdownSeconds = 0;
      if (mode === "focus") {
        this.countdownMinutes = this.countdownSetting.focusTime;
      } else if (mode === "shortBreak") {
        this.countdownMinutes = this.countdownSetting.shortBreakTime;
      } else {
        this.countdownMinutes = this.countdownSetting.longBreakTime;
      }
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
      }, 100);
    },
    pauseCountdown(id) {
      clearInterval(id);
      this.countdownState = "pause";
    },
    timeIsUp() {
      if (this.countdownMode === "focus" && this.times % 4 !== 0) {
        this.times++;
        this.chooseCountdown("shortBreak");
        this.addexecutedTimes(this.executeTaskId);
      } else if (this.countdownMode === "focus") {
        this.times++;
        this.chooseCountdown("longBreak");
        this.addexecutedTimes(this.executeTaskId);
      } else if (this.countdownMode === "shortBreak") {
        this.chooseCountdown("focus");
      } else if (this.countdownMode === "longBreak") {
        this.chooseCountdown("focus");
      }
    },
    afterDeleteTask(taskId) {
      if (taskId === "allTask") {
        this.tasks = [];
      } else {
        this.tasks = this.tasks.filter((task) => {
          return task.id !== taskId;
        });
      }
    },
    afterCreateTask(task) {
      task = {
        ...task,
        id: uuidv4(),
        executedTimes: 0,
        complete: false,
      };
      this.tasks.push(task);
    },
    afterEditTask(editData) {
      this.tasks = this.tasks.map((task) => {
        if (editData.id === task.id) {
          task = {
            ...task,
            ...editData,
          };
          return task;
        } else {
          return task;
        }
      });
    },
    changeExecuteTask(taskId) {
      this.executeTaskId = taskId;
    },
    addexecutedTimes(taskId) {
      this.tasks = this.tasks.map((task) => {
        if (taskId === task.id) {
          task = {
            ...task,
            executedTimes: task.executedTimes + 1,
          };
          return task;
        } else {
          return task;
        }
      });
    },
  },
  filters: {
    changeNumberDisplay(n) {
      if (n < 10) {
        return "0" + n;
      } else return n;
    },
  },
  watch: {
    countdownSetting: {
      handler: function () {
        this.chooseCountdown(this.countdownMode);
      },
      deep: true,
    },
  },
  created() {
    this.executeTaskId = this.tasks[0].id;
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
</style>
