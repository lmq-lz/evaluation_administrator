<template>
    <div style="width:100%; height: 100%vue;">
        <!-- 图表形式显示埋点数据 -->
        <!-- <iframe src="http://123.56.106.118:5601/app/kibana#/dashboard/1250f800-a3f6-11ea-83e8-8dfaec9a01fc?embed=true&_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A5000)%2Ctime%3A(from%3Anow-7d%2Cmode%3Arelative%2Cto%3Anow))" 
        height="1200" width="1200"> -->
        </iframe>
        <iframe src="http://123.56.106.118:5601/app/kibana#/dashboard/1250f800-a3f6-11ea-83e8-8dfaec9a01fc?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3A'2020-05-29T00%3A00%3A00.000Z'%2Cmode%3Aabsolute%2Cto%3A'2020-06-05T23%3A59%3A59.999Z'))" 
        height="600" width="1200"></iframe>
        <!-- <iframe src="http://123.56.106.118:5601/app/kibana#/dashboard/1250f800-a3f6-11ea-83e8-8dfaec9a01fc?embed=true&_g=(refreshInterval:(pause:!t,value:0),time:(from:now%2Fw,mode:quick,to:now))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(darkTheme:!f,hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(vis:(legendOpen:!t)),gridData:(h:22,i:'1',w:48,x:0,y:14),id:eef0cee0-a41c-11ea-83e8-8dfaec9a01fc,panelIndex:'1',type:visualization,version:'6.5.4'),(embeddableConfig:(),gridData:(h:14,i:'2',w:48,x:0,y:0),id:b085d110-a420-11ea-83e8-8dfaec9a01fc,panelIndex:'2',type:visualization,version:'6.5.4')),query:(language:lucene,query:''),timeRestore:!f,title:%E7%94%A8%E6%88%B7%E8%A1%8C%E4%B8%BA%E5%88%86%E6%9E%90,viewMode:view)" height="600" width="800"></iframe> -->
        <!-- <iframe src="https://www.baidu.com" frameborder="0"></iframe> -->
    </div>
</template>

<script>
  export default {
    data() {
      return{
      }
    },
    created() {
    },
    methods: {
      addEvent(){
        window.reportEvent.reportEventFunc({sceneCode:'1001'},(res)=>{
          if(res == '200'){
            console.log('上报事件完成')
        }
      })
      this.$http.post('/userBehavior/add')
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