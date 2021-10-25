<template>
  <div>
    <div
      id="azChatBody"
      :class="bodyClass"
    >
      <slot name="infinite"></slot>

      <div>
        <div
          v-for="groupDate in messagesGroupDate"
          :key="groupDate.dateKey"
          :id="groupDate.dateString"
        >
          <div class="tx-center mb-4 mt-3 pt-2">
            <span
              class="badge badge-dark tx-11 p-2 rounded-10 op-9 tx-gray-200"
            >{{ groupDate.dateString }}</span>
          </div>

          <slot :messages="groupDate.messages"></slot>
        </div>
      </div>

      <slot name="noresult"></slot>
    </div>

    <div
      class="tx-center mb-4 mt-3 pt-2 pos-absolute t-40 z-index-200 tx-center wd-100p"
    >
      <span
        class="badge badge-dark tx-11 p-2 rounded-10 op-9 tx-gray-200"
      >{{ currentDate }}</span>
    </div>
  </div>
</template>
<style scoped>
  #azChatBody {
    position: absolute;
    width: 100%;
    height: calc(100% - 103px) !important;
    overflow: auto;
  }
  #azChatBody.with-reply {
    height: calc(100% - 177px) !important;
  }
  #azChatBody::-webkit-scrollbar-track
  {
    background-color: #FFF;
  }

  #azChatBody::-webkit-scrollbar
  {
    width: 2px;
    background-color: #FFF;
  }

  #azChatBody::-webkit-scrollbar-thumb
  {
    background-color: #97a3b9;
  }
</style>
<script lang="ts">
import { ChatUI } from '../../../model/chat'
import { Component, Prop } from 'vue-property-decorator'
import dateFormater from '../../../filters/date'
import { IChatState } from '../../../store/chat'
import { ISystemState } from '../../../store/system'
import { Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'

type MsgGroupByDate = {
  dateString: string
  dateKey: string
  messages: ChatUI[]
}

type State = {
  'chat': IChatState
  'system': ISystemState
}

// eslint-disable-next-line @typescript-eslint/ban-types
type UserStore = Store<State, {}, {}>

@Component
class StoreMixins extends VueWithStore<UserStore> {}

@Component
class MessageContainer extends StoreMixins {
  @Prop() readonly messages!: ChatUI[]

  currentDate = ''

  get bodyClass (): string {
    const { chat, system } = this.tstore.state
    let defaultClass = 'az-chat-body content-inner py-3'

    if (!system.isMobile) {
      defaultClass += ' mg-t-60 mg-md-t-0'
    }

    if (chat.product || chat.order) {
      defaultClass += ' with-reply'
    }

    return defaultClass
  }

  get messagesGroupDate (): MsgGroupByDate[] {
    const defaultGroups: MsgGroupByDate[] = []
    const messagesGroupDate = this.messages.reduce((results, message) => {
      const dateString = dateFormater(message.created, 'DD MN YY')
      const dateKey = dateFormater(message.created, 'YYMMDD')

      const findResultDate = results.find(dateGroup => {
        return dateGroup.dateKey === dateKey
      })

      if (findResultDate) {
        findResultDate.messages.push(message)
        results = results.map(messageData => {
          if (messageData.dateKey === dateKey) {
            return findResultDate
          }
          return messageData
        })
      } else {
        results.push({
          dateString,
          dateKey,
          messages: [message]
        })
      }

      return results
    }, defaultGroups)

    return messagesGroupDate
      .sort((curgroupDate, nextgroupDate) => {
        return (curgroupDate.dateKey > nextgroupDate.dateKey ? 1 : -1)
      })
  }

  mounted (): void {
    this.$el.children[0].addEventListener('scroll', this.handleScroll)
  }

  beforeDestroy (): void {
    this.$el.children[0].removeEventListener('scroll', this.handleScroll)
  }

  handleScroll (elem: Event): void {
    const { children, scrollTop } = elem.target as HTMLDivElement
    const getCurrentDate = [...children[1].children]
      .find((child) => {
        const offset = [(child as HTMLDivElement).offsetTop]

        if (child.nextElementSibling) {
          offset[1] = (child.nextElementSibling as HTMLDivElement).offsetTop
        }

        if (scrollTop >= offset[0]) {
          if (offset[1]) {
            return scrollTop <= offset[1]
          }
          return true
        }
      })

    this.currentDate = getCurrentDate?.id || ''

    window.setTimeout(() => {
      this.currentDate = ''
    }, 3000)
  }
}

export default MessageContainer

</script>
