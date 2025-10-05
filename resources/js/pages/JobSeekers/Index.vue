<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Daftar Job Seeker</h1>

    <Link href="/jobseekers/create"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      + Tambah Profil
    </Link>

    <table class="min-w-full mt-6 border">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">Nama</th>
          <th class="p-2 border">Telepon</th>
          <th class="p-2 border">Pendidikan</th>
          <th class="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in profiles" :key="p.id_pencari">
          <td class="border p-2">{{ p.nama }}</td>
          <td class="border p-2">{{ p.telepon }}</td>
          <td class="border p-2">{{ p.pendidikan }}</td>
          <td class="border p-2 space-x-2">
            <Link :href="`/jobseekers/${p.id_pencari}/edit`"
                  class="text-blue-600 hover:underline">Edit</Link>
            <button @click="destroy(p.id_pencari)"
                    class="text-red-600 hover:underline">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Link, router } from '@inertiajs/vue3'
defineProps({ profiles: Array })

function destroy(id) {
  if (confirm('Yakin ingin menghapus profil ini?')) {
    router.delete(`/jobseekers/${id}`)
  }
}
</script>
