<template>
  <div class="mx-auto px-5 sm:px-10 pt-16 bg-gradient-to-r from-purple-50 to-purple-100 h-full">
    <h1 class="text-3xl font-bold">Todo List</h1>
    <div class="mt-4">
      <div class="mt-1 w-full flex justify-between">
        <input v-model="newtask" name="task" placeholder="Task title" type="text" @keyup.enter="addTask" class="w-full border border-transparent border-gray-300 px-3 py-2 rounded-lg rounded-r-none shadow-md focus:outline-none focus:border-indigo-500">
        <button @click="addTask" class="px-3 py-2 bg-sky-300 shadow-md hover:bg-sky-400 focus:outline-none  focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:ring-opacity-50 rounded-lg rounded-l-none text-white focus:text-white focus:border-transparent font-bold text-xs">Add</button>
      </div>
      <div class="mt-4 flex justify-end">
        <button @click="clearCompleted" class="px-3 py-2 bg-yellow-300 shadow-md hover:bg-yellow-400 focus:outline-none  focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:ring-opacity-50 rounded-lg rounded-r-none text-white focus:text-white focus:border-transparent font-bold text-xs">Clear Completed</button>
        <button @click="clearAll" class="px-3 py-2 bg-red-400 shadow-md hover:bg-red-500 focus:outline-none  focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-opacity-50 rounded-lg rounded-l-none text-white focus:text-white focus:border-transparent font-bold text-xs">Clear All</button>
      </div>
      <div class="mt-4">
        <input placeholder="Search a task" v-model="search" type="text" class="w-full border border-transparent border-gray-300 px-3 py-2 rounded-lg shadow-md focus:outline-none focus:border-indigo-500">
      </div>
      <ul class="mt-4">
        <li v-for="task in Search()" class=" mt-2 first:mt-0 shadow" :key="task.index">
          <div class="flex items-center" :class="[task.status ? 'bg-green-100' : 'bg-white']">
            <input type="checkbox" v-model="task.status" class="mx-2" />
            <input v-if="task.show_edit" @blur="toogleEditForm(task.index)" type="text" v-model="task.title" class="w-full focus:outline-none text-sm bg-transparent" :ref="'editInput-' + task.index">
            <div v-else @click="toogleEditForm(task.index)" class="w-full h-full text-sm">{{task.title}}</div>
            <button @click="upTask(task.index)" class="px-3 py-2 bg-blue-400 hover:bg-blue-500 focus:outline-none text-white focus:text-white focus:border-transparent font-bold">↑</button>
            <button @click="downTask(task.index)" class="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 focus:outline-none text-white focus:text-white focus:border-transparent font-bold">↓</button>
            <button @click="clearTask(task.index)" class="px-3 py-2 bg-red-400 hover:bg-red-500 focus:outline-none  text-white focus:text-white focus:border-transparent font-bold">x</button>

          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TodoList',
  data() {
    return {
      tasks: [] as {title: String, status: Boolean, index: number, show_edit: Boolean}[],
      newtask: '',
      search: '',
      show_edit: false
    }
  },
  methods: {
    Search() {
      const results = this.search != '' ? this.tasks.filter(task => task.title.includes(this.search)).sort((a, b) => a.index - b.index) : this.tasks
      return results.sort((a, b) => a.index - b.index)
    },
    addTask() {
      if (this.newtask) {
        this.tasks.push({
          title: this.newtask,
          status: false,
          index: this.tasks.length,
          show_edit: false
        })
        this.newtask = ''
      }
    },
    clearTask(index: number) {
      this.tasks.splice(index, 1)
    },
    clearAll() {
      this.tasks = []
    },
    clearCompleted() {
      this.tasks = this.tasks.filter(task => task.status == false)
    },
    upTask(index: number) {
      if (index != 0) {
        this.tasks[index].index = index - 1
        this.tasks[index - 1].index = index
      }
    },
    downTask(index: number) {
      if (index != this.tasks.length - 1) {
        this.tasks[index].index = index + 1
        this.tasks[index + 1].index = index
      }
    },
    toogleEditForm(index: number) {
      this.tasks[index].show_edit = !this.tasks[index].show_edit
      if (this.tasks[index].show_edit == true) {
        this.$nextTick(() => {
          (this.$refs["editInput-" + index] as any).focus()
        })
      }
    },
  }
})
</script>
