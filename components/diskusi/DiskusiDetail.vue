<template>
  <div class="card-body p-0 bd-y">
    <div class="d-flex">
      <div class="image-grouped px-3 py-2">
        <img
          v-for="user in users"
          :key="user.userid"
          :src="user.img_profile || defaultImg"
        >
      </div>
      <div class="d-flex flex-fill align-self-center tx-11 tx-gray-500">
        <span>{{ userNames }}&nbsp;</span>
        <span v-if="usersMore > 0">dan +{{ usersMore }} lainnya</span>
      </div>
      <div class="align-self-center mr-3">
        <div class="d-flex flex-row-reverse">
          <div>
            <span class="badge badge-info">{{ repliedText }}</span>
          </div>
          <div class="tx-gray-600 mr-3">
            <i class="fas fa-comments"></i> {{ diskusis.length }}
          </div>
        </div>
        <div v-if="lastReply" class="tx-gray-500 tx-10 tx-right">
          <i class="fa fa-calendar"></i> diskusi terakhir {{ lastReply | date('DD MN YY') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Diskusi } from '../../model/diskusi'
import { Component, Vue, Prop } from 'vue-property-decorator'
import date from '../../filters/date'

type DiskusiUser = {
  userid: string
  name: string
  // eslint-disable-next-line camelcase
  img_profile: string
}

@Component({
  filters: {
    date
  }
})
class DiskusiDetail extends Vue {
  @Prop() readonly diskusis!: Diskusi[]

  limit = 3
  defaultImg = require('@/assets/img/avatar/user.png')

  get lastReply (): number {
    let lastReply = 0

    this.diskusis.forEach(diskusi => {
      const disLastReply = diskusi.last_reply || 0

      if (disLastReply > lastReply) {
        lastReply = disLastReply
      }
    })

    return lastReply
  }

  get users (): DiskusiUser[] {
    const defaultValue: DiskusiUser[] = []
    return this.diskusis
      .reduce((users, diskusi) => {
        const userExist = users
          .find(user => user.userid === diskusi.userid)

        if (!userExist) {
          // eslint-disable-next-line camelcase
          const { userid, name, img_profile } = diskusi
          users.push({
            userid,
            name,
            img_profile
          })
        }

        return users
      }, defaultValue)
  }

  get limitUsers (): DiskusiUser[] {
    return this.users
      .filter((user, index) => index < this.limit)
  }

  get repliedText (): string {
    const unrepliedExist = this.diskusis
      .find(diskusi => !diskusi.replied)

    if (unrepliedExist) {
      return 'have unreply'
    }

    return 'all replied'
  }

  get usersMore (): number {
    return this.users.length - this.limit
  }

  get userNames (): string {
    return this.limitUsers
      .map(user => {
        const splitName = user.name.split(' ')
        return splitName[0].slice(0, 8)
      })
      .join(', ')
  }
}

export default DiskusiDetail
</script>
