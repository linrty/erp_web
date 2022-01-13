<template>
  <div class="app-container">
    <div class="filter-container">
      <!--顶部的搜索部分，如果某个搜索部分的条件为空，表示对这个字段没有限制-->
      <el-input
        v-model="listQuery.return_no"
        placeholder="退货单号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        <!--搜索按钮，根据用户输入的产品名称和产品货号进行搜索-->
        搜索
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        <!--导出按钮，可以导出至execl表格进行下载-->
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="{ $index }">
          <span>{{ (listQuery.page - 1) * listQuery.limit + $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        prop="create_time"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货单号" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.return_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出货单号" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.delivery_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" min-width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" width="95">
        <template slot-scope="{ row }">
          <span>{{ row.product_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货数量" align="center" width="95">
        <template slot-scope="{ row }">
          <span>{{ row.return_count }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            <!--每一行对应的编辑和删除操作-->
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!--分页下标-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <!--添加产品或者编辑产品时的对话框-->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="退货单号">
          <span> {{ temp.return_no }}</span>
        </el-form-item>
        <el-form-item label="出货单号">
          <span> {{ temp.delivery_no }}</span>
        </el-form-item>
        <el-form-item label="客户名称">
          <span> {{ temp.customer_name }}</span>
        </el-form-item>
        <el-form-item label="产品名称">
          <span> {{ temp.product_name }}</span>
        </el-form-item>
        <el-form-item label="退货数量">
          <el-input v-model="temp.return_count" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="50"
        transition-name="fade"
      />
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchReturnList, updateReturn } from "@/api/order";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import BackToTop from "@/components/BackToTop";

export default {
  name: "ReturnManage",
  components: { Pagination, BackToTop }, //分页组件
  directives: { waves },
  data() {
    return {
      //初始化页面数据
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        //获取列表的参数
        page: 1,
        limit: 20,
        return_no: undefined,
      },
      temp: {
        //初始化添加新产品时的默认选项
        id: undefined,
        return_no: "",
        delivery_no: "",
        customer_name: "",
        product_name: "",
        product_code: "",
        return_count: "",
        option_user: "",
      },
      dialogFormVisible: false, //默认隐藏对话框
      dialogStatus: "",
      textMap: {
        update: "编辑", //编辑和添加产品使用的是同一个对话框，对其对话框的标题进行区分
        create: "添加",
      },
      downloadLoading: false,
      myBackToTopStyle: {
        right: "50px",
        bottom: "50px",
        width: "40px",
        height: "40px",
        "border-radius": "4px",
        "line-height": "45px", // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: "#e7eaf1", // 按钮的背景颜色 The background color of the button
      },
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      //请求列表数据
      this.listLoading = true; //开启列表加载
      fetchReturnList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false; //关闭加载等待
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      //列表获取
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      //初始化对话框默认值
      this.temp = {
        id: undefined,
        return_no: "",
        delivery_no: "",
        customer_name: "",
        product_name: "",
        product_code: "",
        return_count: ""
      };
    },
    handleUpdate(row) {
      //更新操作
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      //点击编辑后弹出对话框，当用户再次点击确认按钮后进行更新操作
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          var request_data = {
            returnNo: this.temp.return_no,
            returnCount: this.temp.return_count
          }
          updateReturn(request_data).then((response) => {
            //发送网络请求并且更新数据
             if (response.code == 20000){
              const index = this.list.findIndex((v) => v.id === this.temp.id);
              this.list.splice(index, 1, this.temp);
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
            }else{
              this.$notify({
                title: "失败",
                message: "更新失败",
                type: "danger",
                duration: 2000,
              });
            }
            this.dialogFormVisible = false;
          });
        }
      });
    },
    handleDelete(row, index) {
      //删除操作
      this.temp = Object.assign({}, row)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var request_data = {
            return_no: this.temp.return_no
          }
          deleteReturn(request_data).then(response => {
            this.$notify({
              title: '成功',
              message: '成功删除',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        }).catch(() => {
          this.$notify({
            title: '通知',
            message: '已取消删除',
            type: 'info',
            duration: 2000
          })          
        });
    },
    handleDownload() {
      //下载execl表格操作
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "create_time",
          "return_no",
          "delivery_no",
          "customer_name",
          "product_name",
          "return_count",
        ];
        const filterVal = [
          "create_time",
          "return_no",
          "delivery_no",
          "customer_name",
          "product_name",
          "return_count",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
  },
};
</script>
