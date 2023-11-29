<template>
  <div class="app-container">
    <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()"
      >新增
    </el-button>
    <el-table
      :data="tableData"
      row-key="id"
      stripe
      border
      default-expand-all
      style="width: 100%"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="menuName" label="菜单名" width="160" />
      <el-table-column prop="icon" label="图标" width="90" align="center">
        <template v-slot="scope">
          <el-icon>
            <svg-icon :icon="scope.row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="70" align="center" />
      <el-table-column
        prop="menuPath"
        label="菜单路径"
        width="200"
        align="center"
      />
      <el-table-column prop="component" label="组件地址" width="140" />
      <el-table-column prop="menuType" label="组件类型" width="80">
        <template v-slot="scope">
          <el-tag
            size="small"
            v-if="scope.row.menuType === 'M'"
            type="danger"
            effect="dark"
            >目录
          </el-tag>
          <el-tag
            size="small"
            v-else-if="scope.row.menuType === 'C'"
            type="success"
            effect="dark"
            >菜单
          </el-tag>
          <el-tag
            size="small"
            v-else-if="scope.row.menuType === 'F'"
            type="warning"
            effect="dark"
            >按钮
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="菜单标识" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column prop="remark" label="备注" width="140" />
      <el-table-column
        prop="action"
        label="操作"
        width="150"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            v-if="scope.row.id != '1'"
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.id)"
          ></el-button>
          <!-- 删除         -->
          <el-popconfirm
            v-if="scope.row.id != '1'"
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <Dialog
    v-model="dialogVisible"
    :dialogVisible="dialogVisible"
    :id="menuId"
    :dialogTitle="dialogTitle"
    :table-data="tableData"
    @initMenuList="initMenuList"
    @update:modelValue="dialogVisible = $event"
  ></Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import requestUtil from "@/utils/request";
import { formatDate } from "@/utils/formatDate";
import { Delete, DocumentAdd, Edit } from "@element-plus/icons-vue";
import Dialog from "./components/dialog.vue";
import { ElMessage } from "element-plus";

const tableData = ref([
  {
    id: 1,
    menuName: "测试",
    icon: "测试",
    parentId: 0,
    orderNum: 1,
    menuPath: "/sys",
    component: "",
    menuType: "M",
    perms: "system:user:list",
    createTime: "ddd",
    remark: "11",
  },
]);

const dialogVisible = ref(false);
const dialogTitle = ref("");
const menuId = ref(-1);

const initMenuList = async () => {
  // 没有分页
  const res = await requestUtil.get("/sysMenu/treeList");
  tableData.value = res.data.data;
};

initMenuList();

const handleDialogValue = (id: any) => {
  // console.log(id);
  if (id) {
    menuId.value = id;
    dialogTitle.value = "修改菜单";
  } else if (id === undefined) {
    menuId.value = -1;
    dialogTitle.value = "添加菜单";
  }
  dialogVisible.value = true;
};

const handleDelete = async (id: number) => {
  const res = await requestUtil.deleteR("/sysMenu/deleteMenu/" + id);
  if (res.data.code === 0) {
    ElMessage({ type: "success", message: "删除成功" });
    initMenuList();
  } else {
    ElMessage.error({ type: "error", message: res.data.message });
  }
};
</script>

<style scoped lang="css">
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}

.el-pagination {
  float: right;
  padding: 20px;
  box-sizing: border-box;
}

::v-deep th.el-table__cell {
  word-break: break-word;
  background-color: #f8f8f9 !important;
  color: #515a6e;
  height: 40px;
  font-size: 13px;
}

.el-tag--small {
  margin-left: 5px;
}
</style>
