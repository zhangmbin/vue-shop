<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              round
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 设置 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                round
                icon="el-icon-setting "
                size="mini"
              ></el-button>
            </el-tooltip>
          </template> </el-table-column
      ></el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框n -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 主体 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
        @close="editFormClose"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    // 自定义校验规则
    // 邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    // 手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法电话"));
    };

    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: "",
        totalpage: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        mobile: "",
        email: "",
        character: "",
      },
      // 查询到的用户信息对象
      editForm: {},

      // 添加表单 验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6到 15个字符", trigger: "blur" },
        ],
        // 自定义校验规则
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 修改表单 验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getUserList();
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(this.queryInfo);
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 监听switch状态的改变
    async userStateChange(userinfo) {
      console.log(userinfo);
      // 通过axios发起put请求
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );

      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("获取用户列表失败！");
      }
      this.$message.success("获取用户列表成功！");
    },

    // 监听添加用户对话框关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //点击添加新用户 elmentui提供的validate可以进行校验
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起 添加用户 的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");

        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 重新获取用户列表
        this.getUserList();
      });
    },
    // 展示 编辑用户 的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;

      const { data: res } = await this.$http.get(`users/${id}`);

      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
      console.log(res);
    },
    // 监听 修改用户 对话框关闭事件
    editFormClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户失败！");
        }
        this.editDialogVisible = false;
        this.getUserList();
        console.log(res);
      });
      this.$message.success("修改用户成功！");
    },
    // 删除用户
    async removeUserById(id) {
      // 弹窗提示
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
        // catch捕获用户取消行为
      ).catch((err) => err);

      if (confirmRes !== "confirm") {
        return this.$message.info("已取消删除用户");
      }

      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }
      this.$message.success("删除用户成功！");
      this.getUserList();
    },
  },
};
</script>

<style>
</style>