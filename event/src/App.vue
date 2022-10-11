<template>
  <div>app组件</div>
</template>

<script>
import {registerAPI} from '@/api/index'
export default {
  async created(){
    const {data:res} = await registerAPI()
    console.log(res);
  }
}
</script>

<style lang="less" scoped>

</style>