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
          <button class="dropdown-item" @click="deleteTask('allTask')">
            刪除所有待辦
          </button>
          <button class="dropdown-item" @click="clearExecutedTimes">
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
        class="task-list"
        :class="{ isexecute: executeTaskId === task.id }"
        v-if="task.id !== clickId"
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

        <div v-if="!(task.note === '')">
          <p class="note-display" :class="{ iscomplete: task.complete }">
            {{ task.note }}
          </p>
        </div>
      </div>

      <!-- 編輯task -->
      <div
        class="edit-task-wrapper"
        @submit.stop.prevent="editTask(task.id)"
        @click.stop=""
        v-if="task.id === clickId"
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
            required="required"
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
            value="1"
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
  padding-bottom: 10px;
  border-bottom: 1px white solid;
  color: white;
}

.task-list {
  margin-top: 10px;
  padding: 10px 10px;
  border-left: 5px solid rgba(0, 0, 0, 0);
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  color: black;
}

.isexecute {
  border-left: 5px solid #111111;
}

.input-checkbox {
  -webkit-appearance: none;
  position: relative;
  width: 26px;
  height: 26px;
  margin: auto 0;
  border: 2px solid #aaaaaa;
  border-radius: 13px;
}

.input-checkbox:hover {
  border-color: #111111;
}

.input-checkbox:checked {
  background-color: #aaaaaa;
}

.input-checkbox:checked::after {
  position: absolute;
  left: 2px;
  top: -6px;
  font-size: 21px;
  font-weight: bold;
  color: white;
  content: "✓";
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
  width: 20px;
  height: 20px;
  background-image: url("../../public/img/tool.svg");
  background-repeat: no-repeat;
  color: black;
}

.note-display {
  margin: 10px 15px;
  padding: 5px;
  border-radius: 5px;
  word-wrap: break-word;
  background-color: bisque;
}

.edit-task-wrapper,
.create-task-wrapper {
  margin-top: 10px;
  padding: 20px 20px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  color: black;
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
  background-color: rgb(96, 96, 96);
  color: rgb(255, 255, 255);
}

.confirm {
  background-color: #007bff;
  color: rgb(255, 255, 255);
}

.create-button {
  height: 60px;
  margin-top: 10px;
  text-align: center;
  vertical-align: center;
  border: dashed 2px #ffffff73;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
}

.create-button > span {
  line-height: 60px;
}

.footer {
  height: 50px;
}
</style>