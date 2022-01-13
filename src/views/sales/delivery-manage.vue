<template>
  <div class="app-container">
    <div class="filter-container">
      <!--顶部的搜索部分，如果某个搜索部分的条件为空，表示对这个字段没有限制-->
      <el-input
        v-model="listQuery.product_name"
        placeholder="产品名称"
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
          <span>{{ row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交货日期"
        prop="delivery_time"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{
            row.delivery_time
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售单号" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.order_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交货单号" min-width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.delivery_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库数量" align="center" width="95">
        <template slot-scope="{ row }">
          <span>{{ row.delivery_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库编号" align="center" width="300px ">
        <template slot-scope="{ row }">
          <span>{{ row.warehouse_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" width="95">
        <template slot-scope="{ row }">
          <span>{{ row.product_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费" align="center" width="95">
        <template slot-scope="{ row }">
          <span>{{ row.delivery_cost1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="装卸费" align="center" width="95">
        <template slot-scope="{ row }">
          <span>{{ row.delivery_cost2 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
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

    <el-dialog title="退货" :visible.sync="dialogFormVisible">
      <!--添加产品或者编辑产品时的对话框-->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="出货单号" prop="delivery_no">
          <span> {{ temp.delivery_no }}</span>
        </el-form-item>
        <el-form-item label="退货数量" prop="return_count">
          <el-input v-model="temp.return_count" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!--分页下标-->

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
import { fetchList, deleteDelivery } from "@/api/delivery";
import { createReturn } from "@/api/order"
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import BackToTop from "@/components/BackToTop";

export default {
  name: "DeliveryManage",
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
        product_name: undefined,
      },
      rules: {
        //编辑和添加时的规则，必填字段的检查，以及消息提醒
        return_count: [{ required: true, message: "请输入退货数量", trigger: "blur" }]
      },
      temp: {
        //初始化添加新产品时的默认选项
        id: undefined,
        delivery_no: "",
        return_count: "",
        max_count: ""
      },
      dialogFormVisible: false, //默认隐藏对话框
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
      fetchList(this.listQuery).then((response) => {
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
    handleUpdate(row) {
      //更新操作
      this.temp = {
        delivery_no: row.delivery_no,
        return_count: '',
        max_count: row.delivery_count
      }
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      //点击编辑后弹出对话框，当用户再次点击确认按钮后进行更新操作
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.temp.return_count>this.temp.max_count || this.temp.return_count<1){
            this.$notify({
                title: "失败",
                message: "退货数量不合法",
                type: "danger",
                duration: 2000,
              });
              return;
          }
          var request_data = {
            deliveryNo: this.temp.delivery_no,
            returnCount: this.temp.return_count
          }
          createReturn(request_data).then((response) => {
            //发送网络请求并且更新数据
             if (response.code == 20000){
              this.$notify({
                title: "成功",
                message: "退货成功",
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
            id: this.temp.id
          }
          deleteDelivery(request_data).then(response => {
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
          "warehouse_name",
          "warehouse_no",
          "warehouse_desc",
          "create_by",
        ];
        const filterVal = [
          "create_time",
          "warehouse_name",
          "warehouse_no",
          "warehouse_desc",
          "create_by",
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
