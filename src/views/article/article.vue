<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="margin: 10px 0 10px 0;">
      <el-form :inline="true" label-width="68px" style="margin-bottom: 8px;">
        <div>
          <el-input
            v-model="queryParams.keyword"
            clearable
            class="filter-item"
            placeholder="请输入关键字"
            @keyup.enter.native="handleFind"
          />

          <el-select
            v-model="queryParams.categoryId"
            class="filter-item"
            clearable
            placeholder="请选择分类"
            @keyup.enter.native="handleFind"
          >
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

          <el-select
            v-model="queryParams.tagsId"
            class="filter-item"
            clearable
            placeholder="请选择标签"
            @keyup.enter.native="handleFind"
          >
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

          <el-select
            v-model="queryParams.isPublish"
            class="filter-item"
            clearable
            placeholder="发布状态"
          >
            <el-option value="1" label="已发布" />
            <el-option value="0" label="未发布" />
          </el-select>

          <el-select
            v-model="queryParams.openComment"
            class="filter-item"
            clearable
            placeholder="评论状态"
          >
            <el-option value="1" label="允许评论" />
            <el-option value="0" label="不可评论" />
          </el-select>

          <el-select
            v-model="queryParams.vipArticle"
            class="filter-item"
            clearable
            placeholder="vip文章"
          >
            <el-option value="1" label="vip文章" />
            <el-option value="0" label="普通文章" />
          </el-select>

          <el-select
            v-model="queryParams.auditStatus"
            class="filter-item"
            clearable
            placeholder="审核状态"
          >
            <el-option value="0" label="未审核" />
            <el-option value="1" label="审核通过" />
            <el-option value="2" label="审核不通过" />
          </el-select>
        </div>
        <div>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFind"
          >查找</el-button>

          <el-button
            class="filter-item"
            type="info"
            @click="resetForm"
          >重置</el-button>
        </div>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="articleData"
      element-loading-text="Loading"
    >
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="300" align="center" prop="title" />
      <el-table-column label="作者" width="100" align="center" prop="username" />
      <el-table-column label="分类" width="120" align="center" prop="categoryName" />
      <el-table-column label="标签" width="200" align="center">
        <template slot-scope="scope">
          <el-tag
            v-for="(item, index) in scope.row.tagsList"
            v-if="item"
            :key="index"
            style="margin-left: 3px"
            type="warning"
          >{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="vip文章" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.vipArticle === 0" type="info">普通文章</el-tag>
          <el-tag v-else-if="scope.row.vipArticle === 1" type="success">vip文章</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="点击数" width="100" align="center" prop="clickCount" />
      <el-table-column label="收藏数" width="100" align="center" prop="collectCount" />
      <el-table-column label="评论数" width="100" align="center" prop="commentCount" />
      <el-table-column label="开启评论" width="100" align="center" prop="openComment">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.openComment"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="on"
            :inactive-value="off"
            @change="toggleCommentStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="发布状态" width="100" align="center" prop="isPublish">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isPublish"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="on"
            :inactive-value="off"
            @change="togglePublishStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="auditStatusOptions[scope.row.auditStatus].type">
            {{ auditStatusOptions[scope.row.auditStatus].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center" prop="createTime" />
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block">
      <el-pagination
        :current-page.sync="queryParams.currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="fetchData"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>

import {
  cancelPublishArticle,
  closeComment,
  deleteArticle,
  getArticlePage,
  openComment,
  publishArticle
} from '@/api/article'
import { listCategory } from '@/api/category'
import { listTag } from '@/api/tag'

export default {
  name: 'Article',
  data() {
    return {
      on: 1,
      off: 0,
      auditStatusOptions: [
        {
          value: 0,
          type: 'info',
          label: '未审核'
        }, {
          value: 1,
          type: 'success',
          label: '审核通过'
        }, {
          value: 2,
          type: 'danger',
          label: '审核不通过'
        }
      ],
      articleData: [],
      totalPages: 0,
      total: 0, // 总数量
      listLoading: true,
      queryParams: {
        currentPage: 1,
        pageSize: 10,
        keyword: '',
        tagsId: '', // 标签搜索
        categoryId: '', // 分类搜索
        isPublish: null, // 发布状态
        openComment: null, // 评论状态
        vipArticle: null, // vip文章
        auditStatus: null // 审核状态
      }, // 搜索条件
      categories: [],
      tags: []
    }
  },
  created() {
    this.fetchData()
    this.getCategoryList()
    this.getTagList()
  },
  methods: {
    getCategoryList() {
      listCategory().then(res => {
        this.categories = res.data
      })
    },
    getTagList() {
      listTag().then(res => {
        this.tags = res.data
      })
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.fetchData()
    },
    // 变更文章评论的状态
    toggleCommentStatus(row) {
      const params = { id: row.id }
      if (row.openComment === this.on) {
        openComment(params).then(res => {
          this.fetchData()
        })
      } else {
        closeComment(params).then(res => {
          this.fetchData()
        })
      }
    },
    // 变更文章发布状态
    togglePublishStatus(row) {
      const params = { id: row.id }
      if (row.isPublish === this.on) {
        publishArticle(params).then(res => {
          this.fetchData()
        })
      } else {
        cancelPublishArticle(params).then(res => {
          this.fetchData()
        })
      }
    },
    fetchData() {
      this.listLoading = true
      getArticlePage(this.queryParams).then(response => {
        const data = response.data
        this.articleData = data.records
        this.total = data.total
        this.queryParams.pageSize = data.size
        this.queryParams.currentPage = data.current
        this.listLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.listLoading = false
      })
    },
    handleFind: function() {
      this.queryParams.currentPage = 1
      this.fetchData()
    },
    resetForm() { // 重置
      this.queryParams = {}
      this.fetchData()
    },
    handleDelete(row) {
      const that = this
      this.$confirm('此操作将把文章删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const id = row.id
          deleteArticle({ id }).then(response => {
            that.$message.success('删除成功')
            that.fetchData()
          })
        })
        .catch(() => {
          that.$message.info('已取消删除')
        })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/articlesManagement/', // 待跳转的页面URL
        query: { id: row.id } // 跳转时传入的参数
      })
    },
    handleAdd() {
      this.$router.push({ path: '/articlesManagement/' })
    }
  }
}
</script>

<style scoped>
.filter-item {
  margin: 10px;
  width: 150px
}
</style>
