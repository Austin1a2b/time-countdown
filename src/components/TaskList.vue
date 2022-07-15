<template>
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
          <button
            @click.stop.prevent="deleteTask('allTask')"
            class="dropdown-item"
          >
            刪除所有待辦
          </button>
          <button
            @click.stop.prevent="clearExecutedTimes"
            class="dropdown-item"
          >
            清除所有記數
          </button>
          <button class="dropdown-item"></button>
        </div>
      </div>
    </div>

    <!-- 列表 標題&設定 容器div  -->
    <div
      class="task-list mt-2"
      @click="transferExecuteId(task.id)"
      v-for="task in tasks"
      :key="task.id"
      :class="{ isexecute: executeTaskId === task.id }"
    >
      <div v-if="task.id !== clickId">
        <div class="d-flex justify-content-between">
          <div>
            <input type="checkbox" v-model="task.complete" @click.stop="" />
            <span :class="{ iscomplete: task.complete }">{{ task.title }}</span>
          </div>
          <div>
            <span class="mr-2" :class="{ iscomplete: task.complete }"
              >{{ task.executedTimes }}/{{ task.estimatedTimes }}
            </span>
            <span for="task-setting" @click.stop="toggleSetting(task.id)"
              >設定</span
            >
          </div>
        </div>
        <div class="mx-3 text-wrap">
          <p :class="{ iscomplete: task.complete }">{{ task.note }}</p>
        </div>
      </div>
      <!-- 設定內容 -->
      <form
        id="edit-task"
        v-if="task.id === clickId"
        @submit.stop.prevent="editTask(task.id)"
        @click.stop=""
      >
        <!-- title -->
        <span> 待辦事項:</span>
        <input type="text" :value="task.title" name="title" />
        <!-- 計次 -->
        <div>
          <p>已使用/預計需要 幾個番茄時鐘</p>
          <input
            :value="task.executedTimes"
            type="number"
            name="executedTimes"
          />
          <span> / </span>
          <input
            :value="task.estimatedTimes"
            type="number"
            min="1"
            name="estimatedTimes"
          />
        </div>
        <div>
          <div>註解</div>
          <textarea :value="task.note" type="text" name="note" />
        </div>
        <div class="d-flex justify-content-around">
          <button @click.stop="deleteTask(task.id)">刪除</button>
          <button class="mr-4" @click.stop="toggleSetting('close')">
            取消
          </button>
          <button type="submit" class="mr-2 btn btn-primary">確認</button>
        </div>
      </form>
    </div>
    <!-- 以上為列表 -->

    <div>
      <div @click="toggleSetting('new')">新增</div>
    </div>
    <!-- 新增 -->
    <form
      id="create-task"
      @submit.stop.prevent="createTask"
      v-if="clickId === 'new'"
    >
      <span> 待辦事項:</span>
      <input type="text" name="title" />
      <div>
        <p>預計需要 幾個番茄時鐘</p>
        <input type="number" name="estimatedTimes" min="1" />
      </div>
      <div>
        <div>註解</div>
        <textarea type="text" name="note" />
      </div>
      <div class="d-flex justify-content-around">
        <button class="mr-4" @click="toggleSetting('close')">取消</button>
        <button type="submit" class="mr-2 btn btn-primary">確認</button>
      </div>
    </form>
    <!-- 新增-->
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
      console.log(id);
      console.log(this.executeTaskId);
      this.$emit("change-execute-task", id);
    },
    clearExecutedTimes(){
      
    }
  },
};
</script>

<style>
.iscomplete {
  text-decoration: line-through;
}
.task-list {
  border: 1px solid black;
}
.isexecute {
  background-color: white;
}
</style>