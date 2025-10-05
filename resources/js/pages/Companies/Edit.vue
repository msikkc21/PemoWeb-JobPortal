<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-xl font-bold mb-4">Edit Profil Perusahaan</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="block mb-1">Nama Perusahaan</label>
        <input v-model="form.nama_perusahaan" class="w-full border p-2 rounded" required />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Industri</label>
        <input v-model="form.industri" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Lokasi</label>
        <input v-model="form.lokasi" class="w-full border p-2 rounded" />
      </div>

      <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Update
      </button>
    </form>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'
defineProps({ company: Object })

const form = useForm({
  nama_perusahaan: company.nama_perusahaan,
  industri: company.industri,
  lokasi: company.lokasi
})

function submit() {
  form.put(`/companies/${company.id_perusahaan}`)
}
</script>
