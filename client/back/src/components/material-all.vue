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
              <label for="name">物资名称（如：桌子、帐篷）</label>
              <input type="text" class="form-control" id="name" placeholder="请输入物资名称" required v-model="name"></input>
            </div>
            <div class="form-group">
              <label for="quantity">物资数量（如实填写，若消耗品数量过多，可填较大的数量如10000）</label>
              <input type="number" class="form-control" id="quantity" placeholder="请输入物资数量" required v-model.number="quantity"></input>
            </div>
            <div class="form-group">
              <label for="unit">物资单位（如：张、个、瓶）</label>
              <input type="text" class="form-control" id="unit" placeholder="请输入物资单位" required v-model="unit"></input>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存
            </button>
          </form>
        </div>
      </div>
       <ul class="list-group">
        <li class="list-group-item" v-for="material of materials">
          <small><span class="glyphicon glyphicon-bookmark"></span></small>
          <label>{{ material.name }}</label> 共 <label>{{ material.quantity }}</label> {{ material.unit }}，剩 <label>{{ material.left < 0 ? 0 : material.left }}</label> {{ material.unit }}<br>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-primary dropdown-toggle" @click="materialListGet"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              修改数量
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model.number="material.quantity" type="text" class="form-control input-sm">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-primary" type="button" @click="materialUpdateQuantity(material)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
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
                    <button class="btn btn-sm btn-danger" type="button" @click="materialRemove(material._id)">确认</button>
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
          全部物资申请列表
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(materialBook, index) of materialBooks">
          <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small> {{ materialBook.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ materialBook.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ materialBook.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ materialBook.activity }}<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> 预约{{ materialBook.takeDate }}领取<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> 计划{{ materialBook.returnDate }}归还<br>
          <div v-show="materialBook.remark"><small><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></small> {{ materialBook.remark }}</div>
          <small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small>
          <label v-for="(book, index) of materialBook.book">
            ({{ index + 1 }})&nbsp{{ book.name }}{{ book.book }}{{ book.unit }}&nbsp&nbsp
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
            状态：预约
          </span>
          <span class="label label-condition label-primary" v-show="materialBook.condition === 'lend'">
            状态：借出
          </span>
          <span class="label label-condition label-info" v-show="materialBook.condition === 'return'">
            状态：归还
          </span>
          <span class="label label-condition label-danger" v-show="materialBook.condition === 'fail'">
            状态：作废
          </span>
        </li>
        <li class="list-group-item" v-show="!materialBooks.length">无物资申请记录</li>
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
      name: '',
      unit: '',
      quantity: 1,
      materials: [],
      materialBooks: []
    }
  },
  methods: {
    materialCreate () {
      if (this.name && this.unit && this.quantity) {
        api.materialCreate({
          material: {
            name: this.name,
            unit: this.unit,
            quantity: this.quantity
          }
        })
          .then((res) => {
            if (res.status === 200) {
              this.materialListGet()
              this.materialBookListGetAll()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('物资添加出错，请稍后再试')
          })
      }
    },
    materialUpdateQuantity (material) {
      api.materialUpdateQuantity({
        materialId: material._id,
        quantity: material.quantity
      }).then((res) => {
        if (res.status === 200) {
          this.materialListGet()
        } else {
          alert(res.data.msg)
        }
      }).catch((err) => {
        console.error(err)
        alert('物资数量修改出错，请稍后再试')
      })
    },
    materialRemove (materialId) {
      if (this.ok === 'bgs') {
        api.materialRemove({ materialId })
          .then((res) => {
            if (res.status === 200) {
              this.materialListGet()
              this.materialBookListGetAll()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('物资删除出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以删除')
      }
    },
    materialListGet () {
      api.materialListGet()
        .then((res) => {
          if (res.status === 200) {
            this.materials = res.data.materialList
          } else {
            alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          alert('物资列表获取出错，请稍后再试')
        })
    },
    materialBookRemove (materialBookId) {
      if (this.ok === 'bgs') {
        api.materialBookRemove({ materialBookId })
          .then((res) => {
            if (res.status === 200) {
              this.materialListGet()
              this.materialBookListGetAll()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('物资申请删除出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以删除')
      }
    },
    materialBookListGetAll () {
      api.materialBookListGetAll()
        .then((res) => {
          if (res.status === 200) {
            this.materialBooks = res.data.materialBookList
          } else {
            alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          alert('物资申请列表获取出错，请稍后再试')
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
