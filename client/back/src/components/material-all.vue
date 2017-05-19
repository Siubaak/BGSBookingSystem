<template>
  <div id="material-book">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></small>
          物资列表
        </h4>
      </div>
      <div class="panel-body">
        <button type="button" data-toggle="collapse"
          href="#edit" class="btn btn-sm btn-primary btn-group btn-group-justified">
          <small><span class="glyphicon glyphicon-plus"></span></small>
          添加物资
        </button>
        <div id="edit" class="collapse">
          <form role="form" @submit.prevent="materialCreate">
            <div class="form-group">
              <label for="name">物资名称（如：桌子、帐篷</label>
              <input type="text" class="form-control" id="name" placeholder="请输入物资名称" required v-model="material.name"></input>
            </div>
            <div class="form-group">
              <label for="quantity">物资数量（如实填写，若消耗品数量过多，可填较大的数量如10000）</label>
              <input type="number" class="form-control" id="quantity" placeholder="请输入物资数量" required v-model.number="material.quantity"></input>
            </div>
            <div class="form-group">
              <label for="unit">物资单位（如：张、个、瓶）</label>
              <input type="text" class="form-control" id="unit" placeholder="请输入物资单位" required v-model="material.unit"></input>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存
            </button>
          </form>
        </div>
      </div>
       <ul class="list-group">
        <li class="list-group-item" v-for="materialItem of materials">
          {{ materialItem.name }}共{{ materialItem.quantity }}{{ materialItem.unit }}，剩{{ materialItem.left < 0 ? 0 : materialItem.left }}{{ materialItem.unit }}<br>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-danger dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              删除
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-danger" type="button" @click="materialRemove(materialItem._id)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></small>
          物资申请预约/借出列表
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(materialBook, index) of materialBooks">
          <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small> {{ materialBook.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ materialBook.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ materialBook.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ materialBook.activity }}<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> {{ materialBook.takeDate }}领取，预计{{ materialBook.returnDate }}归还<br>
          <small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small>
          <label v-for="(bookItem, index) of materialBook.book">
            ({{ index + 1 }}){{ bookItem.name }}{{ bookItem.book }}{{ bookItem.unit }}&nbsp
          </label><br>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-danger dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              删除
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-danger" type="button" @click="materialBookRemove(materialBook._id)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <span class="label label-condition label-default" v-show="materialBook.condition === 'book'">
            目前状态为：预约
          </span>
          <span class="label label-condition label-primary" v-show="materialBook.condition === 'lend'">
            目前状态为：借出
          </span>
          <span class="label label-condition label-info" v-show="materialBook.condition === 'return'">
            目前状态为：归还
          </span>
          <span class="label label-condition label-danger" v-show="materialBook.condition === 'fail'">
            目前状态为：作废
          </span>
        </li>
        <li class="list-group-item" v-show="!materialBooks.length">当前没有部门申请物资借用</li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      ok: '',
      material: {
        name: '',
        unit: '',
        quantity: 1
      },
      materials: [],
      materialBooks: []
    }
  },
  methods: {
    materialCreate () {
      if (this.material.name && this.material.unit && this.material.quantity) {
        api.materialCreate(this.material)
          .then((res) => {
            this.materialListGet()
            this.materialBookListGetAll()
          })
          .catch((err) => {
            alert(err)
          })
      }
    },
    materialRemove (materialId) {
      if (this.ok === 'bgs') {
        api.materialRemove({ materialId })
          .then((res) => {
            this.materialListGet()
            this.materialBookListGetAll()
          })
          .catch((err) => {
            alert(err)
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以删除')
      }
    },
    materialListGet () {
      api.materialListGet()
        .then((res) => {
          this.materials = res.data.materialList
        })
        .catch((err) => {
          alert(err)
        })
    },
    materialBookRemove (materialBookId) {
      if (this.ok === 'bgs') {
        api.materialBookRemove({ materialBookId })
          .then((res) => {
            this.materialListGet()
            this.materialBookListGetAll()
          })
          .catch((err) => {
            alert(err)
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以删除')
      }
    },
    materialBookListGetAll () {
      api.materialBookListGetAll()
        .then((res) => {
          this.materialBooks = res.data.materialBookList
        })
        .catch((err) => {
          alert(err)
        })
    }
  },
  beforeMount () {
    this.materialListGet()
    this.materialBookListGetAll()
  }
}
</script>

<style scoped>
.edit-button {
  padding: 0px 5px;
}
.label-condition {
  padding: 8px;
}
#edit {
  margin-top: 15px;
}
</style>
