<template>
  <div class="modal-wrapper">
    <button
      type="button"
      class="button-setting"
      data-toggle="modal"
      data-target="#modal-set-time"
    >
      倒數時間設定
    </button>
    <div
      class="modal fade"
      id="modal-set-time"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">
              倒數時間設定 (分鐘)
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.stop.prevent="saveSetting">
            <div class="modal-body d-flex justify-content-around">
              <div>
                <div>專注</div>
                <input
                  type="number"
                  min="1"
                  name="focusTime"
                  :value="countdownSetting.focusTime"
                  class="focus-minutes"
                />
              </div>
              <div>
                <div>小休息時間</div>
                <input
                  type="number"
                  min="1"
                  name="shortBreakTime"
                  :value="countdownSetting.shortBreakTime"
                  class="short-break-minutes"
                />
              </div>
              <div>
                <div>長休息時間</div>
                <input
                  type="number"
                  min="1"
                  name="longBreakTime"
                  :value="countdownSetting.longBreakTime"
                  class="long-break-minutes"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">
                關閉
              </button>
              <button type="submit" class="ml-5 btn btn-primary">儲存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import $ from "jquery";

export default {
  props: {
    countdownSetting: {
      type: Object,
      default: () => {
        return {
          focusTime: 25,
          shortBreakTime: 5,
          longBreakTime: 30,
        };
      },
    },
  },
  methods: {
    saveSetting(e) {
      const form = e.target;
      const formData = new FormData(form);
      this.$emit("after-saveSetting", Object.fromEntries(formData));
      $("#modal-set-time").modal("hide");
    },
  },
};
</script>

<style scoped>
input {
  width: 80px;
  background-color: rgb(233, 231, 231);
  border: none;
}

input:focus {
  background-color: rgb(209, 198, 39);
  outline: none;
}

.modal-wrapper {
  color: black;
}

.button-setting {
  background-color: #6c757d;
  color: aliceblue;
  border: none;
  border-radius: 5px;
  width: 150px;
  font-weight: bold;
  font-size: 20px;
  height: 35px;
}
</style>
