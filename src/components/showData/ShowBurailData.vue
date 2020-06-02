<template>
    <div>
        <!-- 图表形式显示埋点数据 -->
        <iframe src="http://123.56.106.118:5601/app/kibana#/dashboard/1250f800-a3f6-11ea-83e8-8dfaec9a01fc?embed=true&_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A5000)%2Ctime%3A(from%3Anow-7d%2Cmode%3Arelative%2Cto%3Anow))" height="600" width="800">
        </iframe>
    </div>
</template>

<script>
  export default {
    data() {
      return
    },
    created() {
    //   this.addEvent()
    },
    methods: {
    //   addEvent(){
    //     // window.reportEvent.reportEventFunc({sceneCode:'1001'},(res)=>{
    //     //   if(res == '200'){
    //     //     console.log('上报事件完成')
    //     // }
    //   // })
    //     this.$http.post('http://localhost:8091')
    //         .then(res => {
    //           console.log("上报事件完成！")
    //           return this.$message.success('上报事件成功！')
    //       }).catch(err => {
    //           console.log("上报事件失败！！！")
    //         })
    //   }
    }
  }
    
  </script>