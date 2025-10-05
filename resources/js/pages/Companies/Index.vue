<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Daftar Perusahaan</h1>

    <Link href="/companies/create"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      + Tambah Perusahaan
    </Link>

    <table class="min-w-full mt-6 border">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">Nama</th>
          <th class="p-2 border">Industri</th>
          <th class="p-2 border">Lokasi</th>
          <th class="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in companies" :key="c.id_perusahaan">
          <td class="border p-2">{{ c.nama_perusahaan }}</td>
          <td class="border p-2">{{ c.industri }}</td>
          <td class="border p-2">{{ c.lokasi }}</td>
          <td class="border p-2 space-x-2">
            <Link :href="`/companies/${c.id_perusahaan}/edit`"
                  class="text-blue-600 hover:underline">Edit</Link>
            <button @click="destroy(c.id_perusahaan)"
                    class="text-red-600 hover:underline">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Link, router } from '@inertiajs/vue3'
defineProps({ companies: Array })

function destroy(id) {
  if (confirm('Yakin ingin menghapus perusahaan ini?')) {
    router.delete(`/companies/${id}`)
  }
}
</script>
