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
              <label for="name">物资名称</label>
              <input type="text" class="form-control" id="name" placeholder="请输入物资名称" required v-model="material.name"></input>
            </div>
            <div class="form-group">
              <label for="quantity">物资数量（非消耗品如实填写，消耗品填写-1）</label>
              <input type="number" class="form-control" id="quantity" placeholder="请输入物资数量" required v-model.number="material.quantity"></input>
            </div>
            <div class="form-group">
              <label for="unit">物资单位（如：张、个、瓶）</label>
              <input type="text" class="form-control" id="unit" placeholder="请输入物资单位" required v-model="material.unit"></input>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存添加
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></small>
          物资申请预约/借出列表
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(materialBookItem, index) in materialBooks">
          <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small> {{ materialBookItem.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ materialBookItem.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ materialBookItem.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ materialBookItem.activity }}<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> {{ materialBookItem.takeDate }}领取，预计{{ materialBookItem.returnDate }}归还<br>
          <small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small>
          <label v-for="(bookItem, index) of materialBookItem.book">
            ({{ index + 1 }}){{ bookItem.name }}{{ bookItem.book === -1 ? '若干' : bookItem.book }}{{ bookItem.unit }}&nbsp
          </label><br>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-danger dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              修改
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-danger" type="button">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <span class="label label-condition"
            :class="{ 'label-default': materialBookItem.condition === 'book',
                      'label-primary': materialBookItem.condition !== 'book'}">
            目前状态为：{{ materialBookItem.condition === 'book' ? '预约' : '借出' }}
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
        quantity: null
      },
      materials: [],
      materialBooks: []
    }
  },
  methods: {
    materialCreate () {
      if (this.material.quantity === -1) {
        this.material.left = 1
      } else {
        this.material.left = this.material.quantity
      }
      api.materialCreate(this.material)
        .then((res) => {
          console.log(res.data.msg || res.data.err)
          this.materialListGet()
        })
        .catch((err) => {
          alert(err)
        })
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
  created () {
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
