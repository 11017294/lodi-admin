<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people" @click="btnClick('1')">
            <i class="el-icon-user-solid" style="font-size:45px" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              用户数: {{ userCount }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message" @click="btnClick('2')">
            <i class="el-icon-tickets" style="font-size:45px" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              文章数: {{ articleCount }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money" @click="btnClick('3')">
            <i class="el-icon-chat-line-square" style="font-size:45px" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              评论数: {{ commentCount }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping" @click="btnClick('4')">
            <i class="el-icon-view" style="font-size:45px" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日IP数: {{ ipCount }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--章贡献度-->
    <el-row>
      <CalendarChart />
    </el-row>
  </div>
</template>

<script>
import { initCount } from '@/api'
import CalendarChart from '@/components/CalendarChart/index.vue'

export default {
  name: 'Dashboard',
  components: {
    CalendarChart
  },
  data() {
    return {
      userCount: 0,
      articleCount: 0,
      commentCount: 0,
      ipCount: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      initCount().then(res => {
        this.userCount = res.data.userCount
        this.commentCount = res.data.commentCount
        this.articleCount = res.data.articleCount
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
