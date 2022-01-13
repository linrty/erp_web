<template>
  <div class="app-container">
    <div class="filter-container">
      <!--顶部的搜索部分，如果某个搜索部分的条件为空，表示对这个字段没有限制-->
      <el-input
        v-model="listQuery.warehouse_name"
        placeholder="仓库名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.warehouse_no"
        placeholder="仓库编号"
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
      <el-table-column label="仓库名称" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span
            class="link-type"
            @click="handleFetchProductList(row.warehouse_no)"
            >{{ row.warehouse_name }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="仓库编号" width="500px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.warehouse_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存数" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.warehouse_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已出库数" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.warehouse_out_count }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogPvVisible" title="仓库信息详情">
      <el-table
        :data="productList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="product_name" label="产品名称" align="center" />
        <el-table-column prop="product_code" label="产品货号" align="center" />
        <el-table-column prop="count" label="库存量" align="center" />
        <el-table-column prop="out_count" label="出库量" align="center" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >确认</el-button
        >
      </span>
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
import { fetchAccountList, fetchProductList } from "@/api/warehouse";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import BackToTop from "@/components/BackToTop";

export default {
  name: "WarehouseStatistics",
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
        warehouse_name: undefined,
        warehouse_no: undefined,
      },
      productList: [],
      dialogPvVisible: false,
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
  created() {
    this.getList();
  },
  methods: {
    getList() {
      //请求列表数据
      this.listLoading = true; //开启列表加载
      fetchAccountList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false; //关闭加载等待
        }, 1.5 * 1000);
      });
    },
    handleFetchProductList(warehouse_no) {
      var request_data = {
        warehouse_no: warehouse_no
      }
      fetchProductList(request_data).then((response) => {
        this.productList = response.data.items;
        this.dialogPvVisible = true;
      });
    },
    handleFilter() {
      //列表获取
      this.listQuery.page = 1;
      this.getList();
    },
    handleDownload() {
      //下载execl表格操作
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "warehouse_name",
          "warehouse_no",
          "count",
          "out_count",
        ];
        const filterVal = [
          "warehouse_name",
          "warehouse_no",
          "count",
          "out_count",
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
