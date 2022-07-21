<template>
  <div class="content" :class="countdownMode">
    <div class="main">
      <div class="pt-4 d-flex justify-content-around change-time-countdown">
        <button
          type="button"
          class="mode-btn"
          @click="chooseCountdown('focus')"
          :class="{ 'mode-chosen': countdownMode === 'focus' }"
        >
          專注時間
        </button>
        <button
          type="button"
          class="mode-btn"
          @click="chooseCountdown('shortBreak')"
          :class="{ 'mode-chosen': countdownMode === 'shortBreak' }"
        >
          小休息時間
        </button>
        <button
          type="button"
          class="mode-btn"
          @click="chooseCountdown('longBreak')"
          :class="{ 'mode-chosen': countdownMode === 'longBreak' }"
        >
          長休息時間
        </button>
      </div>
      <div class="display-countdown mt-3">
        <div>
          {{ countdownMinutes | changeNumberDisplay }}:{{
            countdownSeconds | changeNumberDisplay
          }}
        </div>
      </div>
      <div class="d-flex justify-content-around align-self-center mt-3">
        <button
          @click.stop.prevent="startCountdown"
          v-if="countdownState === 'pause'"
          class="start"
          :class="countdownMode"
        >
          開始
        </button>
        <button
          @click.stop.prevent="pauseCountdown(setIntervalId)"
          v-else
          class="pause"
          :class="countdownMode"
        >
          暫停
        </button>
        <TimeSettingModal
          :countdown-setting="countdownSetting"
          @after-saveSetting="afterSaveSetting"
        />
      </div>

      <div class="times">專注次數#{{ times }}</div>

      <TaskList
        :tasks="tasks"
        :executeTaskId="executeTaskId"
        @after-deleteTask="afterDeleteTask"
        @after-create-task="afterCreateTask"
        @after-edit-task="afterEditTask"
        @change-execute-task="changeExecuteTask"
        @after-clear-executed="afterClearExecuted"
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
          title: "歡迎使用 ; 這邊是顯示待辦事項名稱",
          id: "1",
          complete: false,
          estimatedTimes: 3,
          executedTimes: 1,
          note: "這邊是顯示 備註",
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
      executeTaskId: "1",
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
      }, 1000);
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
    afterClearExecuted() {
      this.tasks = this.tasks.map((task) => {
        return (task = {
          ...task,
          executedTimes: 0,
        });
      });
    },
    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
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
        localStorage.setItem(
          "countdownSetting",
          JSON.stringify(this.countdownSetting)
        );
      },
      deep: true,
    },
    tasks: {
      handler: function () {
        this.saveTasks();
      },
      deep: true,
    },
  },
  created() {
    if (Array.isArray(JSON.parse(localStorage.getItem("tasks")))) {
      this.tasks = JSON.parse(localStorage.getItem("tasks"));
      if (this.tasks.length !== 0) {
        this.executeTaskId = this.tasks[0].id;
      }
    }
    if (JSON.parse(localStorage.getItem("countdownSetting"))) {
      this.countdownSetting = JSON.parse(
        localStorage.getItem("countdownSetting")
      );
    }
    console.log(JSON.parse(localStorage.getItem("countdownSetting")));
  },
};
</script>

<style>
button:focus {
  outline: none;
}

.content {
  min-height: 100vh;
}

.main {
  margin: 0 auto;
  max-width: 350px;
}

.display-countdown {
  width: 100%;
  height: 30%;
  font-size: 120px;
  font-weight: bold;
  text-align: center;
  color: white;
}

.mode-btn {
  background-color: rgba(255, 255, 255, 0);
  color: white;
  border: none;
  border-radius: 5px;
}

.mode-chosen {
  background-color: rgba(0, 0, 0, 0.3);
}

.display-countdown {
  background-color: rgba(255, 255, 255, 0.1);
}

.focus {
  background-color: rgb(217, 85, 80);
  color: rgb(217, 85, 80);
}

.shortBreak {
  background-color: rgb(76, 145, 149);
  color: rgb(76, 145, 149);
}

.longBreak {
  background-color: rgb(69, 124, 163);
  color: rgb(69, 124, 163);
}

.start,
.pause {
  background-color: white;
  border: none;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  font-weight: bold;
  font-size: 20px;
}

.start {
  box-shadow: 0px 5px 1px #dddddd;
}

.pause {
  margin-top: 5px;
  margin-bottom: -5px;
}

.times {
  width: 150px;
  margin: 25px auto 20px;
  text-align: center;
  color: white;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media screen and (min-width: 500px) {
  .main {
    max-width: 450px;
  }
  .mode-btn {
    width: 27%;
  }
}
</style>
