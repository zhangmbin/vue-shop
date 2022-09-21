<template>
  <div class="alarm-statis">
    <el-row>
      <el-col>
        <el-form
          ref="alaFormRef"
          :model="alarmFormData"
          label-width="15px"
          :inline="true"
        >
          <el-form-item prop="date" :span="8">
            <el-date-picker
              v-model="alarmForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="formType" :span="4">
            <el-select
              v-model="value"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item in alarmForm.formType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="type" :span="4">
            <el-select
              v-model="alarmFormData.type"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item1 in alarmFormData"
                :key="item1.index"
                :value="item1.value"
                :label="item1.type"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="Imei" :span="4">
            <el-input
              v-model="alarmFormData.Imei"
              placeholder="请输入IMEI"
              size="small"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="handleSearch"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      :data="alarmFormData"
      style="width: 100%"
      stripe
      border
      class="alarmTable"
    >
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="model" label="型号"> </el-table-column>
      <el-table-column prop="Imei" label="Imei"> </el-table-column>
      <el-table-column prop="type" label="报警类型"> </el-table-column>
      <el-table-column prop="alaTime" label="报警时间"> </el-table-column>
      <el-table-column prop="locTime" label="定位时间"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { listUser, getUser } from "@/api/system/user";
export default {
  name: "alarmStatus",
  data() {
    return {
      alarmForm: {
        value: "",

        formType: [
          {
            value: "选项1",
            label: "包含子公司",
          },
          {
            value: "选项2",
            label: "仅自己",
          },
        ],
      },

      alarmFormData: [
        {
          id: "001",
          name: "小容",
          model: "K9L-NV",
          Imei: "123456789",
          type: "紧急报警",
          alaTime: "2022-7-14 10:11:04",
          locTime: "2022-7-14 10:11:04",
        },
        {
          id: "002",
          name: "小泽",
          model: "K9L-NV",
          Imei: "223456789",
          type: "离线报警",
          alaTime: "2022-6-24 10:11:04",
          locTime: "2022-6-24 10:11:04",
        },
        {
          id: "003",
          name: "小池",
          model: "K9L-NV",
          Imei: "323456789",
          type: "出电子围栏",
          alaTime: "1022-6-24 10:11:04",
          locTime: "1022-6-24 10:11:04",
        },
      ],
    };
  },
  created() {
    this.getAlarmList();
  },
  methods: {
    getAlarmList() {},
    handleSearch() {},
  },
};
</script>

<style lang="less" scoped>
.alarm-statis {
  margin-top: 10px;
  margin-left: 15px;
}
.alarmTable {
  margin-left: 15px;
}
</style>