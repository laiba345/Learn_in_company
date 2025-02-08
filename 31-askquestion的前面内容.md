```
<v-flex lg12 xs12 sm12 md12 mt-0 pb-0>
        <v-tooltip right>
          <v-icon @click="closeQuestion" slot="activator" color="primary" dark >clear</v-icon>
          <span>To Close Question</span>
        </v-tooltip>
        <time-counter :start="startCounter" :stop="stopCounter"></time-counter>

        <!-- <h3>[ <span class="font-weight-regular red--text">{{ container }}</span> ]: {{ title }}</h3> -->
        <div style="display: flex;font-size: 24px;">
            [ <span class="font-weight-regular red--text">{{ container }}</span> ]:
            
            <div v-if="typeof (title) == 'string'">
              {{ container }}
            </div>

            <div v-else>
              <!-- <div v-for="(item, index) in title"> -->
              <div v-for="(item, index) in title">
                <div :key="index" >{{ item }}</div>
              </div>
            </div>
        </div>
</v-flex>
<!-- input -->
<v-flex lg12 xs12 sm12 md12 pt-0 pb-0 v-if="type === 'text'">
        <v-text-field style="font-size:22px;" label="Type Your Input Here." autofocus outline clearable :type="textType" v-model="userInput" v-on:keyup.enter="onEnter" ref="searchInput">
          <v-btn slot="append-outer" large color="primary" style="top: -16px" @click="submitUserInput">
            <v-icon left>send</v-icon>
            Submit
          </v-btn>
        </v-text-field>
</v-flex>
```
