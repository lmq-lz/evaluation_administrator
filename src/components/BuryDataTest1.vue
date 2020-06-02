<template>
    <div>
        <div data-reporteventfunc="click" data-reporteventdata='{"sceneCode":"1001"}'>上报事件</div>
        <div data-reporteventfunc="click" data-reporteventdata='[{"sceneCode":"1001"},{"sceneCode":"1002","customerId":"2"}]'>多事件上报</div>

        <div onclick="addEvent()">手动上报事件</div>
    </div>
  </template>

<script src="../assets/js/reportEvent.js"></script>
<script>
  export default {
    data() {
      return{

      }
    },
    created() {
      this.addEvent()
    },
    methods: {
      addEvent(){
        // window.reportEvent.reportEventFunc({sceneCode:'1001'},(res)=>{
        //   if(res == '200'){
        //     console.log('上报事件完成')
        // }
      // })
        this.$http.post('http://localhost:8091')
            .then(res => {
              console.log("上报事件完成！")
              return this.$message.success('上报事件成功！')
          }).catch(err => {
              console.log("上报事件失败！！！")
            })
      }
    }
  }
    
  </script>