<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Edit Profil Job Seeker</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="block mb-1">Nama</label>
        <input v-model="form.nama" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Telepon</label>
        <input v-model="form.telepon" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Alamat</label>
        <input v-model="form.alamat" class="w-full border p-2 rounded" />
      </div>

      <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Update
      </button>
    </form>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'

defineProps({ profile: Object })

const form = useForm({
  nama: profile.nama,
  telepon: profile.telepon,
  alamat: profile.alamat,
})

function submit() {
  form.put(`/jobseekers/${profile.id_pencari}`)
}
</script>
