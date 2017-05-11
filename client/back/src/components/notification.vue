<template>
  <div id="notification">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></small>
          通知公告
        </h4>
      </div>
      <div class="panel-body">
        <p>{{ notification }}</p>
        <button type="button" data-toggle="collapse"
          href="#edit" class="btn btn-sm btn-primary btn-group btn-group-justified">修改公告</button>
        <div id="edit" class="collapse">
          <form role="form">
            <div class="form-group">
              <label for="notification">编辑器支持markdown语法，规则详见<a target="_blank" href="http://www.jianshu.com/p/q81RER">这里</a>。</label>
              <textarea type="text" class="form-control" id="notification"
                        rows="5" v-model="notification">
              </textarea>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      notification: 'fsa'
    }
  }
}
</script>

<style scoped>
textarea {
  resize: none;
}
#edit {
  margin-top: 15px;
}
</style>
