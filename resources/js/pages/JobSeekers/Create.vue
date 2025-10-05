<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Tambah Profil Job Seeker</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="block mb-1">Nama</label>
        <input v-model="form.nama" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Pendidikan</label>
        <input v-model="form.pendidikan" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Upload Resume</label>
        <input type="file" @change="handleFile" class="w-full border p-2 rounded" />
      </div>

      <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        Simpan
      </button>
    </form>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  nama: '',
  pendidikan: '',
  resume: null,
})

function handleFile(e) {
  form.resume = e.target.files[0]
}

function submit() {
  form.post('/jobseekers')
}
</script>
