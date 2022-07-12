<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
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
            <div class="modal-body d-flex space-around">
              <div>
                專注<input
                  type="text"
                  name="focusTime"
                  :value="countdownSetting.focusTime"
                  class="focus-minutes"
                />
              </div>
              <div>
                小休息時間<input
                  type="text"
                  name="shortBreakTime"
                  :value="countdownSetting.shortBreakTime"
                  class="short-break-minutes"
                />
              </div>
              <div>
                長休息時間<input
                  type="text"
                  name="longBreakTime"
                  :value="countdownSetting.longBreakTime"
                  class="long-break-minutes"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" class="btn btn-primary">
                Save changes
              </button>
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
          focusTime: "25",
          shortBreakTime: "05",
          longBreakTime: "30",
        };
      },
    },
  },
  methods: {
    //後續 用儲存表單方式處理 (而非用 v-model 處理) , & 設定功能 將資料 傳到父層
    saveSetting(e) {
      const form = e.target;
      const formData = new FormData(form);
      console.log("下一行 我要的");
      console.log(Object.fromEntries(formData));
      this.$emit("after-saveSetting", Object.fromEntries(formData));
      $("#modal-set-time").modal("hide");
    },
  },
};
</script>
