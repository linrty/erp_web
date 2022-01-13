<template>
  <div class="app-container">
    <div class="filter-container">
      <!--顶部的搜索部分，如果某个搜索部分的条件为空，表示对这个字段没有限制-->
      <el-input
        v-model="listQuery.design"
        placeholder="款号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.material_status"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in materialStatusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
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
      <el-table-column label="款号" min-width="150px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.design
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.model }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.genre }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="100px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.unit | unitFilter">
            {{ row.unit }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="95">
        <template slot-scope="{ row }">
          <el-tag :type="row.material_status | materialFilter">
            {{ row.material_status | materialStatusFilter }}
          </el-tag>
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
            v-if="row.material_status != '0'"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            <!--每一行对应的编辑和删除操作-->
            编辑
          </el-button>
          <el-button
            v-if="row.material_status != '1'"
            type="primary"
            size="mini"
            disabled
          >
            <!--冻结后不可进行编辑操作-->
            编辑
          </el-button>
          <el-button
            v-if="row.material_status != '0'"
            size="mini"
            type="warning"
            @click="handleModifyStatus(row, '0')"
          >
            冻结
          </el-button>
          <el-button
            v-if="row.material_status != '1'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, '1')"
          >
            解冻
          </el-button>
          <el-button
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
        <el-form-item label="款号" prop="design">
          <el-input v-model="temp.design" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="temp.model" />
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="temp.specification" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-input v-model="temp.category" />
        </el-form-item>
        <el-form-item label="类型" prop="genre">
          <el-input v-model="temp.genre" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select
            v-model="temp.unit"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in unitOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="temp.comments"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
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
import { fetchList, createMaterial, updateMaterial, deleteMaterial } from "@/api/material";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import BackToTop from "@/components/BackToTop";

const materialStatusOptions = [
  { key: "0", display_name: "冻结" },
  { key: "1", display_name: "正常" },
];

const materialStatusKeyValue = materialStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "MaterialManage",
  components: { Pagination, BackToTop }, //分页组件
  directives: { waves },
  filters: {
    unitFilter(unit) {
      //产品的单位tag底色显示不同的颜色
      const unitMap = {
        箱: "success",
        件: "primary",
        批: "warning",
      };
      return unitMap[unit];
    },
    materialStatusFilter(status) {
      return materialStatusKeyValue[status];
    },
    materialFilter(status) {
      const materialMap = {
        1: "success",
        0: "danger",
      };
      return materialMap[status];
    },
  },
  data() {
    return {
      //初始化页面数据
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      materialStatusOptions,
      listQuery: {
        //获取列表的参数
        page: 1,
        limit: 20,
        design: undefined,
        material_status: undefined,
      },
      unitOptions: ["箱", "件", "批"], //添加新的产品时，下拉单位选择框选项
      temp: {
        //初始化添加新产品时的默认选项
        id: undefined,
        design: "",
        model: "",
        specification: "",
        category: "",
        genre: "",
        unit: "箱",
        comments: "",
      },
      dialogFormVisible: false, //默认隐藏对话框
      dialogStatus: "",
      textMap: {
        update: "编辑", //编辑和添加产品使用的是同一个对话框，对其对话框的标题进行区分
        create: "添加",
      },
      rules: {
        //编辑和添加时的规则，必填字段的检查，以及消息提醒
        design: [
          {
            type: "date",
            required: true,
            message: "请输入款号",
            trigger: "blur",
          },
        ],
        model: [{ required: true, message: "请输入型号", trigger: "blur" }],
        specification: [
          { required: true, message: "请输入规格", trigger: "blur" },
        ],
        category: [{ required: true, message: "请输入类型", trigger: "blur" }],
        genre: [{ required: true, message: "请输入产品规格", trigger: "blur" }],
        unit: [
          { required: true, message: "请选择产品单位", trigger: "change" },
        ],
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
    handleModifyStatus(row, status) {
      //修改操作是否成功后弹出消息提醒
      // 需要添加对应的请求
      this.temp = Object.assign({}, row);
      this.temp.material_status = status
      const tempData = Object.assign({}, this.temp);
      updateMaterial(tempData).then((response) => {
            //发送网络请求并且更新数据
             if (response.code == 20000){
              row.material_status = status;
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
    },
    resetTemp() {
      //初始化对话框默认值
      this.temp = {
        id: undefined,
        design: "",
        model: "",
        specification: "",
        category: "",
        genre: "",
        unit: "箱",
        comments: ""
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
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id  随机产生一个ID  //这些操作应放在后端，只是测试使用
          this.material_status = 1
          createMaterial(this.temp).then((response) => {
             this.dialogFormVisible = false; // 关闭对话框
            if (response.code == 20000){
              this.temp.id = response.data.id
              this.list.unshift(this.temp);
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
          const tempData = Object.assign({}, this.temp);
          updateMaterial(tempData).then((response) => {
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
          var requestData = {
            id : this.temp.id
          }
          deleteMaterial(requestData).then(response => {
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
          "design",
          "model",
          "specification",
          "category",
          "genre",
          "unit",
          "material_status",
        ];
        const filterVal = [
          "design",
          "model",
          "specification",
          "category",
          "genre",
          "unit",
          "material_status",
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
