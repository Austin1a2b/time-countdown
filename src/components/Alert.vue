<template>
  <div v-if="showModal" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-body">
          <div class="body">計時正在倒數中 ; 是否切換計時模式 ??</div>
        </div>

        <div class="modal-footer">
          <div class="footer">
            <button
              class="modal-default-button confrim"
              @click="$emit('confirm-switch', wattingDecision)"
            >
              確認
            </button>
            <button
              class="modal-default-button cancel"
              @click="$emit('close-alert')"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    wattingDecision: {
      type: String,
    },
  },
};
</script>

<style scoped>
.modal-mask {
  display: table;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 450px;
  margin: 0px auto;
  padding: 20px 30px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.4s ease;
}

.modal-body {
  margin: 20px 0;
  color: black;
}

.modal-default-button {
  height: 40px;
  width: 70px;
  float: right;
  border-radius: 5px;
}

.confrim {
  margin-left: 30px;
  border: 2px white solid;
  background-color: rgb(34, 57, 229);
  color: white;
  outline: solid 2px rgb(34, 57, 229);
}

.cancel {
  border: 2px rgb(157, 157, 161) solid;
  background-color: rgba(0, 0, 0, 0);
  color: blue;
}
</style>