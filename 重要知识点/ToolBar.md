# ToolBar 相关内容（导航栏颜色变换）
```
<template>
  <div class="toolbar">
    <a href="#/genius">Main</a>
    <div :style="{ width: openChangeMode ? 'calc(100% - 200px)' : 'calc(100% - 75px)', margin: openChangeMode ? '0 20px' : '0 0 0 20px'}">
      <notify-marquee style="height: 48px; display: flex; align-items: center" :notify="currentNotification"></notify-marquee>
    </div>
    <!-- <v-btn
      v-if="openChangeMode"
      :style="{ marginTop: '6px', marginRight: '0', color: 'white', backgroundColor: mode === 'PROD' ? '#9d4edc' : '#ffc107', cursor: role === 'operator' ? 'default' : 'pointer' }"
      slot="activator"
      @click="changeMode(mode)"
    >
      {{ mode }}
    </v-btn> -->
    <div class="text-xs-center">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="openChangeMode"
            :style="{ marginRight: '2px', width:'88px', height:'36px', color: 'white', backgroundColor: mode === 'PROD' ? '#9d4edc' : '#ff0000', cursor: role === 'operator' ? 'default' : 'pointer' }"
            v-on="on"
          >
            {{ mode }}
          </v-btn>
        </template>
        <v-list>
          <v-list-tile
            v-for="(item, index) in items"
            :key="index"
            @click="selectMode(item.title)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import NotifyMarquee from '../components/NotifyMarquee';
import { getServerName } from '../api/getServerName';

export default {
  components: {
    NotifyMarquee
  },
  props: ['openChangeMode', 'currentNotification'],
  data () {
    return {
      serverName: 'Genius',
      username: '',
      role: '',
      manageUrl: '#/genius/manage',
      mode: 'PROD',
      items: [
        { title: 'PROD' },
        { title: 'DEBUG' },
      ]
    };
  },
  watch: {
    mode: {
      immediate: true,
      handler(newMode) {
        document.body.classList.remove('mode-prod', 'mode-debug');
        if (newMode === 'PROD') {
          document.body.classList.add('mode-prod');
        } else {
          document.body.classList.add('mode-debug');
        }
      }
    },
  },
  mounted () {
    this.username = this.$cookies.get('username');
    this.role = this.$cookies.get('role');

    if (!this.username) {
      this.$router.replace('/genius/login');
    }
    this.getCurrentServerName();
  },
  
  methods: {
    getCurrentServerName () {
      getServerName()
        .then(response => {
          this.serverName = response.data.payload.data;
          document.title = this.serverName + ' | Genius';
        })
        .catch(e => {
          console.log(e);
        });
    },
    selectMode(selectedMode) {
      if (this.role === 'operator') return;
      this.mode = selectedMode;
      this.$emit('changeMode', selectedMode);
    }
    // changeMode (m) {
    //   if (this.role === 'operator') return;
    //   if (m === 'PROD') {
    //     this.mode = 'DEBUG';
    //     this.$emit('changeMode', 'DEBUG');
    //   } else {
    //     this.mode = 'PROD';
    //     this.$emit('changeMode', 'PROD');
    //   }
    // }
  }
};
</script>

<style lang='stylus' scoped>
.toolbar {
  width: calc(100% + 8px);
  height: 48px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin: 0 -4px 10px; padding: 0 4px 0 18px;
}

.v-menu__content {
  margin-left: 6px !important;
}

a { 
  height: 48px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: black;
  text-decoration: none;
}
</style>
```
