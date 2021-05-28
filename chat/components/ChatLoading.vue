<template>
  <div>
    <div class="media flex-row-reverse">
      <div class="media-body">
        <div class="wd-40p ht-40 rounded-5 bg-loading mg-b-5">
        </div>
        <div class="wd-90p ht-60 rounded-5 bg-loading mg-b-5">
        </div>
        <div class="wd-30p ht-40 rounded-5 bg-loading mg-b-5">
        </div>
      </div>
    </div>
    <div class="media">
      <div class="media-body">
        <div class="wd-80p ht-40 rounded-5 bg-loading mg-b-5">
        </div>
      </div>
    </div>
    <div class="media flex-row-reverse">
      <div class="media-body">
        <div class="wd-40p ht-40 rounded-5 bg-loading mg-b-5">
        </div>
        <div class="wd-30p ht-40 rounded-5 bg-loading mg-b-5">
        </div>
      </div>
    </div>
    <div class="media">
      <div class="media-body">
        <div class="wd-50p ht-40 rounded-5 bg-loading mg-b-5">
        </div>
        <div class="wd-30p ht-40 rounded-5 bg-loading mg-b-5">
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
class ChatLoading extends Vue {

}

export default ChatLoading
</script>
