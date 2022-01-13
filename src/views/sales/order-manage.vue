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
      <el-input
        v-model="listQuery.customer_name"
        placeholder="客户名称"
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
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        <!--添加按钮，点击进行添加产品-->
        添加
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
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="400px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.order_no
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.product_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数量" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品单价 / 元" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.product_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总计 / 元" class-name="status-col" width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.count * row.product_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="95">
        <template slot-scope="{ row }">
          <el-tag :type="row.order_status | statusFilter">
            {{ row.order_status | statusNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="400px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.order_status != 0 || row.delivery_status != 0"
            type="success"
            size="mini"
            disabled
          >
            {{ row.delivery_status | deliveryStatusFilter }}
          </el-button>
          <el-button
            v-if="row.order_status != 1 && row.delivery_status != 1"
            type="success"
            size="mini"
            @click="handleDelivery(row)"
          >
            {{ row.delivery_status | deliveryStatusFilter }}
          </el-button>
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
        <el-form-item label="产品" prop="product_code">
          <el-select
            v-model="temp.product_code"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in productOptions"
              :key="item.product_code"
              :label="item.product_code + '(' + item.product_name + ')'"
              :value="item.product_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="temp.count" />
        </el-form-item>
        <el-form-item label="单价" prop="product_price">
          <el-input v-model="temp.product_price" />
        </el-form-item>
        <el-form-item label="客户" prop="customer_name">
          <el-select
            v-model="temp.customer_name"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in customerOptions"
              :key="item.phone"
              :label="item.customer_name + '(' + item.phone + ')'"
              :value="item.customer_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'update'"
          label="状态"
          prop="order_status"
        >
          <el-select
            v-model="temp.order_status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.order_status"
              :label="item.order_status | statusNameFilter"
              :value="item.order_status"
            />
          </el-select>
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


    <el-dialog title="出库" :visible.sync="dialogDeliveryFormVisible">
      <!--添加产品或者编辑产品时的对话框-->
      <el-form
        ref="dataDeliveryForm"
        :rules="rulesDelivery"
        :model="deliveryData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        
        <el-form-item label="订单号">
          <span> {{ deliveryData.order_no }}</span>
        </el-form-item>
        <el-form-item label="出库时间" prop="delivery_time">
          <el-date-picker v-model="deliveryData.delivery_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="运费" prop="delivery_cost1">
          <el-input v-model="deliveryData.delivery_cost1" type="number" />
        </el-form-item>
        <el-form-item label="装卸费" prop="delivery_cost2">
          <el-input v-model="deliveryData.delivery_cost2" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeliveryFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="handleDelivery()"
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
import { mapGetters } from 'vuex'
import { fetchList, createOrder, updateOrder, deleteOrder } from "@/api/order";
import { createDelivery} from "@/api/delivery"
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import BackToTop from "@/components/BackToTop";

export default {
  name: "OrderManage",
  components: { Pagination, BackToTop }, //分页组件
  directives: { waves },
  filters: {
    statusFilter(status) {
      //产品的单位tag底色显示不同的颜色
      const statusMap = {
        0: "success",
        1: "danger",
      };
      return statusMap[status];
    },
    statusNameFilter(status) {
      const statusNameMap = {
        0: "正常",
        1: "异常",
      };
      return statusNameMap[status];
    },
    deliveryStatusFilter(status) {
      const statusMap = {
        1: "已出库",
        0: "出库",
      };
      return statusMap[status];
    },
  },
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
        customer_name: undefined,
      },
      customerOptions: [],
      productOptions: [],
      statusOptions: [{ order_status: "0" }, { order_status: "1" }],
      temp: {
        //初始化添加新产品时的默认选项
        id: undefined,
        product_name: "",
        product_code: "",
        customer_name: "",
        count: "",
        product_price: "",
        order_no: "",
        order_status: "",
        create_by: '',
        update_by: ''
      },
      deliveryData: {
        order_no: '',
        delivery_time: '',
        delivery_cost1: '',
        delivery_cost2: ''
      },
      dialogFormVisible: false, //默认隐藏对话框
      dialogDeliveryFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑", //编辑和添加产品使用的是同一个对话框，对其对话框的标题进行区分
        create: "添加",
      },
      rules: {
        //编辑和添加时的规则，必填字段的检查，以及消息提醒
        product_code: [
          { required: true, message: "请选择产品", trigger: "change" },
        ],
        customer_name: [
          { required: true, message: "请选择客户", trigger: "change" },
        ],
        product_name: [
          { required: true, message: "请输入产品货号", trigger: "blur" },
        ],
        count: [{ required: true, message: "请输入数量", trigger: "blur" }],
        product_price: [
          { required: true, message: "请输入产品单价", trigger: "blur" },
        ],
      },
      rulesDelivery:{
        delivery_time: [
          { required: true, message: "请选择时间", trigger: "change" },
        ],
        delivery_cost1: [
          { required: true, message: "请输入运费", trigger: "blur" },
        ],
        delivery_cost2: [
          { required: true, message: "请输入装卸费", trigger: "blur" },
        ]
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
    ...mapGetters([
      'name',
    ])
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
        this.productOptions = response.data.products;
        this.customerOptions = response.data.customers;
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
    handleDelivery(row){
      this.deliveryData = Object.assign({}, row); // copy obj
      this.dialogDeliveryFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataDeliveryForm"].clearValidate();
      });
    },
    Delivery(){
      this.$refs["dataDeliveryForm"].validate((valid) => {
        if (valid) {
          var request_data = {
            order_no: this.deliveryData.order_no,
            delivery_time: this.deliveryData.delivery_time,
            delivery_cost1: this.deliveryData.delivery_cost1,
            delivery_cost2: this.deliveryData.delivery_cost2
          }
          this.deliveryData.delivery_status = 1
          createDelivery(request_data).then((response) => {
            //发送网络请求并且更新数据
             if (response.code == 20000){
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
            this.dialogDeliveryFormVisible = false;
          });
        }
      });
    },
    resetTemp() {
      //初始化对话框默认值
      this.temp = {
        id: undefined,
        product_name: "",
        product_code: "",
        customer_name: "",
        count: "",
        product_price: "",
        order_no: "",
        order_status: "",
        create_by: '',
        update_by: ''
      };
    },
    handleCreate() {
      //添加操作开启
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      //用户点击添加按钮，点击确认后进行添加操作
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          var flag = 0
          this.temp.create_by = this.name
          createOrder(this.temp).then((response) => {
             this.dialogFormVisible = false; // 关闭对话框
            if (response.code == 20000){
              flag = 1
              this.$notify({
                // 弹出消息提示，添加成功
                title: "成功",
                message: "添加成功",
                type: "success",
                duration: 2000,
              });

            }else{
              this.$notify({
                // 弹出消息提示，添加失败
                title: "失败",
                message: "添加失败",
                type: "danger",
                duration: 2000,
              });
            }
          });
          if (flag == 1){
            this.handleFilter()
          }
        }
      });
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
          this.temp.update_by = this.name
          const tempData = Object.assign({}, this.temp);
          updateOrder(tempData).then((response) => {
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
            id: this.temp.id
          }
          deleteOrder(request_data).then(response => {
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
          "order_no",
          "product_name",
          "product_code",
          "count",
          "product_price",
          "order_status",
          "customer_name",
        ];
        const filterVal = [
          "create_time",
          "order_no",
          "product_name",
          "product_code",
          "count",
          "product_price",
          "order_status",
          "customer_name",
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
