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
      <!-- <div class="mt-4">
        <input placeholder="Search a task" v-model="search" type="text" class="w-full border border-transparent border-gray-300 px-3 py-2 rounded-lg shadow-md focus:outline-none focus:border-indigo-500">
      </div> -->
      <draggable v-model="tasks" class="mt-4" item-key="order" @change="onDrop">
        <template #item="{ element }">
          <div class="flex items-center mt-2 first:mt-0 shadow" :class="[element.status ? 'bg-green-100' : 'bg-white']">
            <input type="checkbox" @click="completeTask(element.id)" v-model="element.status" class="mx-2" />
            <input v-if="element.show_edit" @blur="updateTitle(task.order)" type="text" v-model="element.title" class="w-full focus:outline-none text-sm bg-transparent" :ref="'editInput-' + element.order">
            <div v-else @click="toogleEditForm(element.order)" class="w-full h-full text-sm">{{element.title}}</div>
            <button @click="upTask(element.order)" class="px-3 py-2 bg-blue-400 hover:bg-blue-500 focus:outline-none text-white focus:text-white focus:border-transparent font-bold">↑</button>
            <button @click="downTask(element.order)" class="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 focus:outline-none text-white focus:text-white focus:border-transparent font-bold">↓</button>
            <button @click="clearTask(element.order)" class="px-3 py-2 bg-red-400 hover:bg-red-500 focus:outline-none  text-white focus:text-white focus:border-transparent font-bold">x</button>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { db, tasksCollection } from '../firebase'
import draggable from 'vuedraggable'
export default defineComponent({
  name: 'TodoList',
  components: {
    draggable
  },
  data() {
    return {
      tasks: [] as {id: string, title: string, status: Boolean, order: number, show: Boolean, show_edit: Boolean}[],
      newtask: '',
      search: '',
      show_edit: false,
      is_loading: false,
      drag: false,
    }
  },
  created() {
    this.getTasks()
  },
  methods: {
    async onDrop() {
      if(this.is_loading) return
      this.is_loading = true
      const snap = await tasksCollection.get()
      snap.docs.forEach((doc: any) => {
        const task = this.tasks.find(task => task.id == doc.id)
        if (task) doc.ref.update({order: this.tasks.indexOf(task)})
      })
      this.is_loading = false
    },
    Search (){
      debugger
      const results = this.search != '' ? this.tasks.filter(task => task.title.includes(this.search)) : this.tasks
      return results.sort((a, b) => a.order - b.order)
    },
    async clearTask(order: number) {
      if(this.is_loading) return
      this.is_loading = true
      var batch = db.batch();
      batch.delete(tasksCollection.doc(this.tasks[order].id))
      await tasksCollection.where('order', '>', order).get().then(response => {
        response.forEach((doc: any) => {
          const task = doc.data();
          batch.update(doc.ref, {"order": task.order - 1})
        })
      })
      await batch.commit()
      this.is_loading = false
    },
    async upTask(order: number) {
      if(order == 0 || this.is_loading) return

      this.is_loading = true
      const upperTask = tasksCollection.doc(this.tasks[order -1].id)
      await upperTask.get().then((doc: any) => { doc.ref.update({order: doc.data().order + 1}) })
      const lowerTask = tasksCollection.doc(this.tasks[order].id)
      await lowerTask.get().then((doc: any) => { doc.ref.update({order: doc.data().order - 1}) })
      this.is_loading = false
    },
    async downTask(order: number) {
      if(order == this.tasks.length - 1 || this.is_loading) return

      this.is_loading = true
      const lowerTask = tasksCollection.doc(this.tasks[order + 1].id)
      await lowerTask.get().then((doc: any) => { doc.ref.update({order: doc.data().order - 1}) })
      const upperTask = tasksCollection.doc(this.tasks[order].id)
      await upperTask.get().then((doc: any) => { doc.ref.update({order: doc.data().order + 1}) })
      this.is_loading = false
    },
    async clearAll() {
      var batch = db.batch();
      await tasksCollection.get().then(response => {
        response.forEach((doc: any) => {
          batch.delete(doc.ref)
        })
      })
      await batch.commit()
    },
    async completeTask(index: string) {
      const task = await tasksCollection.doc(index)
      task.get().then((doc: any) => {
        doc.ref.update({status: !doc.data().status})
      })
    },
    async updateTitle(order: number) {
      const task = this.tasks[order]
      await tasksCollection.doc(task.id).update({title: task.title})
    },
    async clearCompleted() {
      await tasksCollection.where('status', '==', true).get().then(response => {
        response.forEach((doc: any) => {
          doc.ref.delete()
        })
      })
      const snap = await tasksCollection.orderBy("order").get()
      snap.docs.forEach((doc: any, index: number) => {
        doc.ref.update({order: index})
      })
    },
    toogleEditForm(index: number) {
      this.tasks[index].show_edit = !this.tasks[index].show_edit
      if (this.tasks[index].show_edit == true) {
        this.$nextTick(() => {
          (this.$refs["editInput-" + index] as any).focus()
        })
      }
    },
    async getTasks() {
      const tasksRef = await tasksCollection.orderBy("order")
      tasksRef.onSnapshot((snap: any) => {
          this.tasks = [];
          snap.forEach((doc: any) => {
              const task = doc.data();
              task.id = doc.id;
              this.tasks.push(task);
          });
      });
    },
    addTask() {
      if (this.newtask) {
        tasksCollection.add({
          order: this.tasks.length,
          status: false,
          title: this.newtask,
        })
        this.newtask = ''
      }
    }
  }
})
</script>
