<template>
  <div class="pss-container">
    <h2>🔐 Banco de contraseñas PSS</h2>

    <table>
      <thead>
        <tr>
          <th>Contraseña</th>
          <th>Túnel</th>
          <th>Creado en</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in datos" :key="item.id">
          <td>{{ item.password }}</td>
          <td>{{ item.tunnel }}</td>
          <td>{{ item.fecha }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datos: [
        // Datos simulados
        { id: 1, password: 'abc123!', tunnel: 'Gatico', fecha: '2025-06-10 12:00:00' },
        { id: 2, password: 'p@ssw0rd2025', tunnel: 'Gorro', fecha: '2025-06-09 17:45:10' },
      ]
    }
  }
}
</script>

<style scoped>
.pss-container {
  padding: 20px;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #2c3e50;
  color: white;
  margin-top: 10px;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #444;
  text-align: left;
}

th {
  background-color: #1abc9c;
}
</style>
