<template>
  <!-- 清單表頭 -->
  <div class="tasks-wrapper">
    <div class="head-wrapper d-flex justify-content-between align-items-center">
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
          <button @click="clearExecutedTimes" class="dropdown-item">
            清除所有記數
          </button>
          <button class="dropdown-item"></button>
        </div>
      </div>
    </div>

    <!-- 列表 標題&設定 容器div  -->
    <div
      @click="transferExecuteId(task.id)"
      v-for="task in tasks"
      :key="task.id"
    >
      <div
        v-if="task.id !== clickId"
        class="task-list"
        :class="{ isexecute: executeTaskId === task.id }"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="list-left d-flex justify-content-around">
            <input
              type="checkbox"
              class="input-checkbox"
              v-model="task.complete"
            />
            <div class="title" :class="{ iscomplete: task.complete }">
              {{ task.title }}
            </div>
          </div>
          <div
            class="list-right d-flex justify-content-around align-items-center"
          >
            <div class="gray-font" :class="{ iscomplete: task.complete }">
              {{ task.executedTimes }}/{{ task.estimatedTimes }}
            </div>
            <div
              class="task-setting"
              @click.stop="toggleSetting(task.id)"
            ></div>
          </div>
        </div>

        <div>
          <p :class="{ iscomplete: task.complete }" class="note-display">
            {{ task.note }}
          </p>
        </div>
      </div>

      <!-- 編輯task -->
      <div
        class="edit-task-wrapper"
        v-if="task.id === clickId"
        @submit.stop.prevent="editTask(task.id)"
        @click.stop=""
      >
        <form id="edit-task">
          <!-- title -->
          <div class="input-title-wrapper">
            <input
              class="input-title"
              type="text"
              :value="task.title"
              name="title"
            />
          </div>
          <!-- 計次 -->
          <div class="input-times-wrapper">
            <div>
              <span>已使用 / 預計使用 番茄時鐘</span>
            </div>
            <input
              class="input-times"
              :value="task.executedTimes"
              type="number"
              name="executedTimes"
            />
            <span>/</span>
            <input
              class="input-times"
              :value="task.estimatedTimes"
              type="number"
              min="1"
              name="estimatedTimes"
            />
          </div>
          <div class="input-note-wrapper">
            <div>
              <span>註解</span>
            </div>
            <textarea
              class="input-note"
              :value="task.note"
              type="text"
              name="note"
              onscroll="this.rows++;"
            />
          </div>
          <div class="d-flex justify-content-around">
            <button class="button delete" @click.stop="deleteTask(task.id)">
              刪除
            </button>
            <button class="button cancel" @click.stop="toggleSetting('close')">
              取消
            </button>
            <button type="submit" class="button confirm">確認</button>
          </div>
        </form>
      </div>
    </div>
    <!-- 列表-END -->
    <!-- 新增功能－外框 -->
    <div
      class="create-button"
      @click="toggleSetting('new')"
      v-if="!(clickId === 'new')"
    >
      <span>新增</span>
    </div>

    <!-- 新增功能－表格  -->
    <div v-if="clickId === 'new'" class="create-task-wrapper">
      <form id="create-task" @submit.stop.prevent="createTask">
        <div class="input-title-wrapper">
          <input
            class="input-title"
            type="text"
            name="title"
            placeholder="輸入待辦事項"
          />
        </div>
        <div class="input-times-wrapper">
          <div>
            <span>預計使用 番茄時鐘幾次</span>
          </div>
          <input
            type="number"
            class="input-times"
            name="estimatedTimes"
            min="1"
          />
        </div>
        <div>
          <div>註解</div>
          <textarea
            type="text"
            class="input-note"
            name="note"
            onscroll="this.rows++;"
          />
        </div>
        <div class="d-flex justify-content-around">
          <button class="button cancel" @click="toggleSetting('close')">
            取消
          </button>
          <button type="submit" class="button confirm">確認</button>
        </div>
      </form>
    </div>
    <!-- 新增-END-->
    <div class="footer"></div>
  </div>
</template>


<script>
export default {
  props: {
    tasks: {
      type: Array,
      default: -1,
    },
    executeTaskId: {
      type: String,
      default: -1,
    },
  },
  data() {
    return {
      clickId: "close",
      publicPath: process.env.BASE_URL,
    };
  },
  methods: {
    deleteTask(taskId) {
      this.$emit("after-deleteTask", taskId);
    },
    toggleSetting(taskId) {
      this.clickId = taskId;
      if (taskId === "new") {
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 10);
      }
    },
    createTask(e) {
      const form = e.target;
      const formData = new FormData(form);
      this.$emit("after-create-task", Object.fromEntries(formData));
      this.toggleSetting("close");
    },
    editTask(id) {
      const form = document.getElementById("edit-task");
      const formData = new FormData(form);
      let editData = Object.fromEntries(formData);
      editData = {
        ...editData,
        id,
      };
      this.$emit("after-edit-task", editData);
      this.toggleSetting("close");
    },
    transferExecuteId(id) {
      this.$emit("change-execute-task", id);
    },
    clearExecutedTimes() {
      this.$emit("after-clear-executed");
    },
  },
};
</script>

<style scoped>
.iscomplete {
  text-decoration: line-through;
}

.head-wrapper {
  color: white;
  border-bottom: 1px white solid;
  padding-bottom: 10px;
}

.task-list {
  border-radius: 5px;
  color: black;
  margin-top: 10px;
  padding: 10px 10px;
  border-left: 5px solid rgba(0, 0, 0, 0);
  background-color: rgb(250, 250, 250);
}

.isexecute {
  border-left: 5px solid #111111;
}

.input-checkbox {
  -webkit-appearance: none;
  border: 2px solid #aaaaaa;
  border-radius: 13px;
  width: 26px;
  height: 26px;
  margin: auto 0;
  position: relative;
}

.input-checkbox:hover {
  border-color: #111111;
}

.input-checkbox:checked {
  background-color: #aaaaaa;
}

.input-checkbox:checked::after {
  content: "✓";
  font-size: 21px;
  font-weight: bold;
  position: absolute;
  left: 2px;
  top: -6px;
  color: white;
}

.title {
  width: 80%;
  word-wrap: break-word;
  line-height: 1.8rem;
  font-size: 1.2rem;
}

.list-left {
  width: 70%;
}

.list-right {
  width: 25%;
}

.gray-font {
  color: gray;
}

.task-setting {
  color: black;
  background-image: url("../../public/img/tool.svg");
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
}

.note-display {
  margin: 10px 15px;
  background-color: bisque;
  border-radius: 5px;
  padding: 5px;
  word-wrap: break-word;
}

.edit-task-wrapper,
.create-task-wrapper {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  color: black;
  margin-top: 10px;
  padding: 20px 20px;
}

.input-title-wrapper,
.input-times-wrapper,
.input-note-wrapper {
  margin-bottom: 10px;
}

#edit-task span {
  line-height: 40px;
}

.input-title,
.input-times,
.input-note {
  border: none;
  background-color: #dddddd;
}

.input-title {
  width: 100%;
  height: 40px;
}

.input-times {
  width: 18%;
  height: 40px;
}

.input-times ~ span {
  margin: 0 10px;
}

.input-note {
  width: 100%;
  resize: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.button {
  height: 35px;
  width: 70px;
  border: none;
  border-radius: 8px;
}

.delete {
  background-color: #dddddd;
}

.cancel {
  color: rgb(255, 255, 255);
  background-color: rgb(96, 96, 96);
}

.confirm {
  color: rgb(255, 255, 255);
  background-color: #007bff;
}

.create-button {
  margin-top: 10px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0);
  border: dashed 2px #ffffff73;
  border-radius: 5px;
  color: white;
  text-align: center;
  vertical-align: center;
}

.create-button > span {
  line-height: 60px;
}

.footer {
  height: 50px;
}
</style>