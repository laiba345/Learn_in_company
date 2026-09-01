# APP Bar
```
<template>
  <!-- 头部区域 -->
  <v-toolbar fixed dark app :color="$vuetify.theme.primary" class="AppToolbar">
    
    <v-toolbar-title class="ml-0 pr-3 FontH3" style="padding-left: 6px;">
      <v-toolbar-side-icon @click.stop="handleDrawerToggle" class="changeMenuSize"></v-toolbar-side-icon>
      <span>Genius</span>
    </v-toolbar-title>
    <!-- 版本 -->
     <div @click="goManagePage" class="changeDefaultBackground" :style="role ? role === 'operator' ? '' : 'cursor: pointer;' : ''" @mouseenter="enterdetailtool" @mouseleave="leavedetailtool">
       <span>{{ genius_version || 'v0.0.0_xxxxxxxx' }}</span>
       <v-icon v-if="version_tip" color="error" style="margin-left: 5px; margin-right: -2px; font-size: 20px;">error</v-icon>
     </div>
     <v-tooltip bottom v-model="showStatusTooltip">
        <div slot="activator">
        </div>
        <span>
          <pre v-for="(d, index) in showDetails" :key="index"><span>{{ d[0] }}</span><span v-if="d[1]">:</span><span v-if="d[1]" :style="{ color: getCurrentVersionColor(d[1], d[2]) }">{{ d[1] }}</span><span v-if="d[2]" :style="{ color: getDetailColor(d[1]) }">,{{ d[2] }}</span><v-divider></v-divider></pre>
        </span>
      </v-tooltip>

      <!-- 服务连接监控 -->
      <transition name="fade">
        <i v-if="connectStatus" class="iconfont icon-youxianwangluo mx-3" @mouseenter="entertool" @mouseleave="leavetool" @click="show = !show"
          :style="disconnect ? 'font-size: 22px; color: #ff0000;' : config? 'font-size: 22px; color: orange;' : serveset?'font-size: 22px; color: orange;' : 'font-size: 22px; color: #1afa29;'"></i>
      </transition>
      <v-tooltip bottom v-if="connectStatus" v-model="show" class="mt-3">
        <div slot="activator">
        </div>
        <span>
          <pre v-for="d of statusdetails" :key="d">{{ d.split(' - ')[0] }} - <span :class="d.split(' - ')[1] === 'connected'? 'green--text': d.split(' - ')[1] === 'disconnected' ? 'red--text':'orange--text'">{{d.split(' - ')[1]}}</span><v-divider></v-divider></pre>
        </span>
      </v-tooltip>
    <v-spacer ></v-spacer>
    <!-- SN Find -->
    <div id="ToolbarSearch" style="width: 300px;">
      <v-text-field flat solo-inverted :placeholder="SearchPlaceholder" style="width: 100%;" id="ToolbarSearch2"
        class=" hidden-sm-and-down geniusSearch" v-on:keyup.enter="onEnter" @focus="ChangeField()" @blur="ChangeField2()" v-model="userInput">
         <template slot="append">
           <button>
             <i class="iconfont icon-search" @click="onEnter" style="font-size: 18px;"></i>
           </button>
           <button v-show="showFenGe">
             <i class="iconfont icon-fenge" style="font-size: 18px;"></i>
           </button>
           <button v-show="showClose">
             <i class="iconfont icon-close" @click="ChangeClose()" style="font-size: 18px;"></i>
           </button>
         </template>
      </v-text-field>
    </div>

    <v-menu ref="userMenu" offset-y origin="center center" :nudge-bottom="5" class="ChangePosition">
      <template v-slot:activator="{ on }">
        <div v-on="on" class="userblock" @click="forceUpdateMenu">
          <span class="iconfont icon-yonghu px-2" style="font-size: 30px;"></span>
          <span v-if="role">{{ username + ' @ ' + serverName }}</span>
        </div>
      </template>
      <v-list v-if="role">
        <!-- <v-list-tile v-for="(item, index) in items" :to="!item.href ? { name: item.name } : null" :href="item.href" @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="index"> -->
        <v-list-tile v-for="(item, index) in menuItems" @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="index">
          <v-list-tile-action class="changeAction">
            <span :class="item.icon" style="font-size: 24px;"></span>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title> 
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list v-else >
        <v-list-tile v-for="(item, index) in logoutItems" @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="index">
          <v-list-tile-action class="changeAction">
            <span :class="item.icon" style="font-size: 24px;"></span>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title> 
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
      
  </v-toolbar>
</template>
<script>
import NotificationList from '@/components/widgets/list/NotificationList';
import Util from '@/util';
import store from '../pages/vision/store';
import { getMachineStatus } from '../pages/genius/api/getMachineStatus';
import { getProdVersion } from '../pages/genius/api/getProdVersion';
import { getServerName } from '../pages/genius/api/getServerName';
import { getCheckConnectStatus } from '../pages/genius/api/getCheckStatus';

export default {
  name: 'app-toolbar',
  components: {
    NotificationList,
    store,
  },
  props: ['closeshowdetail'],
  data: () => ({
    items: [
      {
        href: '#',
        icon: 'iconfont icon-setting1',
        title: 'Settings',
        click: (e) => {
          window.getApp.$emit('APP_SETTINGS');
        }
      },
      {
        href: '#',
        icon: 'iconfont icon-xiugaimima',
        title: 'Change Password',
        click: (e) => {
          window.getApp.$emit('APP_AUTH_ChangePassword');
        }
      },
      {
        href: '#',
        icon: 'iconfont icon-zhongzhimima',
        title: 'Reset Password',
        click: (e) => {
          window.getApp.$emit('APP_AUTH_ResetPassword');
        }
      },
      {
        href: '#',
        icon: 'iconfont icon-tuichu',
        title: 'Log Out',
        click: (e) => {
          window.getApp.$emit('APP_LOGOUT');
        }
      },
    ],
    logoutItems: [
      {
        href: '#',
        icon: 'iconfont icon-zhongzhimima',
        title: 'Reset Password',
        click: (e) => {
          window.getApp.$emit('APP_AUTH_ResetPassword');
        }
      },
      {
        icon: 'iconfont icon-yonghu',
        title: 'Log In',
        click: (e) => {
          window.getApp.$emit('APP_LOGIN');
        }
      },
    ],
    userInput: '',
    alignIcon: 'vertical_align_top',
    // 新ToolBar
    serverName: 'Genius',
    username: '',
    role: '',
    manageUrl: '#/genius/manage',
    toolBarColor: 'primary',
    // toolBarColor: '#9D4EDC',
    titleColor: 'white--text',
    screenStyle: true,
    // for code version
    genius_version: '',
    details: [],
    new_version: '',
    new_version_visible: false,
    containerStyle: 'DYNAMIC',
    version_tip: false,
    // list-tile
    UserMessage: '',
    showTooltipStatus: false,
    showTool: false,
    UrlString: '',
    // searchIconShow
    showClose: false,
    showFenGe: false,
    SearchPlaceholder: 'SN Find',
    showStatus: 1,
    connectStatus: false,
    statusdetails: [],
    disconnect: false,
    config: false,
    serveset: false,
    Connectstatus: '',
    show: false,
    leaveshow: true,
    showStatusTooltip: false,
    leaveStatusTooltip: true
  }),
  computed: {
    toolbarColor () {
      return this.$vuetify.options.extra.mainNav;
    },
    showDetails () {
      return this.details.map(item => {
        return item.split(/:|,/);
      });
    }, 
    menuItems() {
      return this.items.filter(item => {
        if (item.title === 'Settings') return this.role === 'engineer';
        return true;
      });
    }
  },
  watch: {
    $route: 'changePath',
    closeshowdetail() {
      if (this.closeshowdetail) this.showStatusTooltip = false;
    }
  },
  mounted() {
    this.username = this.$cookies.get('username');
    this.role = this.$cookies.get('role');
    if (!this.username) { this.$router.replace('/genius/login') }
    // change title here
    this.getCurrentServerName();
    this.getCurrentVersion();
    this.getCurrentMachineStatus();
    
  },
  methods: {
    forceUpdateMenu() {
      this.$nextTick(() => {
        const menu = this.$refs.userMenu; 
        if (menu) {
          menu.updateDimensions(); 
        }
      });
    },
    // 檢查鏈接器狀態
    async getStatus() {
      const { data: res } = await getCheckConnectStatus();
      this.statusdetails = res.payload.data;     
      // 使用map方法将数组元素映射为布尔值
      const isConnectedArray = this.statusdetails.map(item => !item.includes('disconnected'));
      const isConfigArray = this.statusdetails.map(item => !item.includes('not configured'));
      const isSetArray = this.statusdetails.map(item => !item.includes('not set'));

      // 使用some方法检查是否存在"disconnected"
      const hasDisconnected = isConnectedArray.some(isConnected => !isConnected);
      const hasconfiged = isConfigArray.some(isConnected => !isConnected);
      const hasset = isSetArray.some(isConnected => !isConnected);
      // eslint-disable-next-line no-unused-expressions
      hasDisconnected ? this.disconnect = true : this.disconnect = false;
      // eslint-disable-next-line no-unused-expressions
      hasconfiged ? this.config = true : this.config = false;
      // eslint-disable-next-line no-unused-expressions
      hasset ? this.serveset = true : this.serveset = false;
      this.show = false;
      if (res.status) {
        this.connectStatus = true;
        this.leaveshow = true;
        if (hasDisconnected || hasconfiged || hasset) {
          this.$set(this, 'show', true);
        }
      } else {
        this.$set(this, 'show', true);
        this.$set(this, 'connectStatus', true);
      }
    },
    enterdetailtool() {
      if (!this.showStatusTooltip) {
        this.showStatusTooltip = true;
        this.leaveStatusTooltip = false;
      }
    },
    leavedetailtool() {
      if (!this.leaveStatusTooltip) this.showStatusTooltip = false;
    },
    entertool() {
      if (!this.show) {
        this.show = true;
        this.leaveshow = false;
      }
    },
    leavetool() {
      if (!this.leaveshow) this.show = false;
    },
    ChangeField() {
      let FieldBox = document.getElementById('ToolbarSearch');
      FieldBox.style.width = '500px';
      this.showClose = true;
      this.showFenGe = true;
      this.SearchPlaceholder = 'Serial Number';
    },
    ChangeField2() {
      let FieldBox = document.getElementById('ToolbarSearch');
      FieldBox.style.width = '300px';
      this.showClose = false;
      this.showFenGe = false;
      this.SearchPlaceholder = 'SN Find';
      this.userInput = '';
      this.showStatus = this.showStatus - 1;
    },
    ChangeClose() {
      this.userInput = '';
    },
    componentListTitle() {
      this.UserMessage = this.username + '@' + this.serverName;
      if (this.UserMessage.length >= 24) {
        this.showTooltipStatus = false;
      } else { this.showTooltipStatus = true }
    },
    changePath() {
      this.username = this.$cookies.get('username');
      this.role = this.$cookies.get('role');
      this.UrlString = window.location.hash.split('/').slice(1).join('/');
      let pathArr = this.UrlString.split('/');
      if (pathArr[0] === 'genius' && (window.location.hash !== '#/genius/login' || window.location.hash === '#/genius/logout')) {
        this.$emit('changeshowdetail');
        this.details = [];
        this.getCurrentVersion();
        this.getCurrentMachineStatus();
        this.getStatus();
        this.Connectstatus = setInterval(() => {
          this.getStatus();
        }, 600000);
      } else {
        this.connectStatus = false;
        clearInterval(this.Connectstatus);
      }
      if (pathArr[0] === 'genius' && pathArr.length > 1) {
        this.showTool = true;
      } else { this.showTool = false }
    },

    handleDrawerToggle () {
      window.getApp.$emit('APP_DRAWER_TOGGLED');
      let role = this.$cookies.get('role');
      this.$bus.$emit('role', role);
    },
    handleFullScreen () {
      Util.toggleFullScreen();
    },
    onEnter () {
      this.$router.push({ path: '/vision/basic', query: { sernum: this.userInput, date: new Date().getTime() }});
      store.commit('changeSernum', this.userInput);
    },
    showToolBar () {
      store.commit('changeShowToolBar');
      if (store.state.showToolBar) {
        this.alignIcon = 'vertical_align_top';
      } else {
        this.alignIcon = 'vertical_align_bottom';
      }
    },
    getCurrentServerName() {
      getServerName()
        .then(response => {
          this.serverName = response.data.payload.data;
          document.title = this.serverName + ' | Genius';
        })
        .catch(e => {
          console.log(e);
        });
    },
    getCurrentVersion() {
      getProdVersion()
        .then(response => {
          this.genius_version = response.data.genius_version;
          this.new_version = response.data.new_version;
          this.version_tip = response.data.new_version;
          // 处理details
          const currentkeys = new Set(response.data.details.map(item => item.split(':')[0].trim()));
          this.details = this.details.filter(item => !currentkeys.has(item.split(':')[0].trim()));
          this.details = this.details.concat(response.data.details);
          this.details = this.details.filter(item => item !== '------');
          this.details.push('------');
        })
        .catch(e => {
          console.log(e);
          this.version_tip = true;
        });
    },
    getCurrentMachineStatus() {
      getMachineStatus()
        .then(response => {
          this.showStatusTooltip = false;
          if (response.data.status) {
            this.details = this.details.filter(item => !item.includes('CPU Usage') && !item.includes('RAM Usage') && !item.includes('HDD Usage'));
            this.details.unshift(response.data.payload.data.hdd_usage);
            this.details.unshift(response.data.payload.data.ram_usage);
            this.details.unshift(response.data.payload.data.cpu_usage);
            const getPercentageValue = (str) => parseFloat(str.split(':')[1].split('%')[0].trim()) > 70;
            let isshow = getPercentageValue(response.data.payload.data.hdd_usage) || getPercentageValue(response.data.payload.data.ram_usage) || getPercentageValue(response.data.payload.data.cpu_usage);
            this.leaveStatusTooltip = true;
            if (isshow) {
              let hashrouter = window.location.hash;
              if ((hashrouter.split('/').slice(1).join('/').split('/')[0] === 'genius' && (hashrouter !== '#/genius/login' || hashrouter === '#/genius/logout'))) {
                this.$emit('changeshowdetail');
                this.$set(this, 'showStatusTooltip', true);
              }
            }         
          } else {
            this.$emit('changeshowdetail');
            this.$set(this, 'showStatusTooltip', true);          
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    goManagePage() {
      setTimeout(() => {
        this.role = this.$cookies.get('role');
        if (this.role === 'operator' || !this.role) { return false }
        this.$router.push(this.manageUrl.substring(1));
      }, 100);
    },
    getCurrentVersionColor(str1, str2) {
      if (!(str1.includes('[') && str1.includes(']'))) return parseFloat(str1.split('%')[0].trim()) > 70 ? 'red' : '';
      let regex = /\[([^\[\]]+)\]/;
      let match1 = str1.match(regex);
      let match2 = str2.match(regex);
      if (match1 && match2) {
        return match1[1] === match2[1] ? '' : 'red';
      }
      return 'red';
    },
    getDetailColor(str) {
      if (str.includes('[') && str.includes(']')) return '';
      return parseFloat(str.split('%')[0].trim()) > 70 ? 'red' : '';
    }
  }
};
</script>

<style lang="stylus" scoped>
/deep/ .v-toolbar__content, .v-toolbar__extension {
  padding-left: 0;
}
.changeAction.v-list__tile__action {
  min-width:40px;
}

/deep/ .v-list__tile {
  height: 30px;
}


.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active {
  max-width:190px;
  right:0 !important;
  margin-left:12px;
}
.FieldBox1 {
  width: 200px;
  margin-right: 10px;
}
.FieldBox2 {
  width: 500px !important;
  margin-right: 10px;
}
#ToolbarSearch .el-input.el-input--small.el-input--suffix input {
  background:#F1D9F7;
  color:#ffffff;
}

.changeDefaultBackground {
  display: flex;
  background:rgba(255,255,255,.2);
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
.userblock {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.blink-icon {
  animation: twinkle 1.0s infinite alternate;
}
@keyframes twinkle {
    0%{
      opacity:.0.8;
    }
    50%{
      opacity:.0.5;
    }
    100%{
      opacity:0.1;
    }
}
/deep/ .theme--dark.v-text-field--solo-inverted.v-text-field--solo > .v-input__control > .v-input__slot {
  border-radius: 4px;
}
</style>
```
