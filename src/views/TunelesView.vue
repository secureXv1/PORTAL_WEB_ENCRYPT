<template>
  <div>
    <h2 style="color: white">Listado de túneles</h2>
    <ul>
      <li v-for="tunel in tuneles" :key="tunel.id">
        {{ tunel.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      tuneles: []
    }
  },
  mounted() {
    axios.get('http://symbolsaps.ddns.net:8000/api/tunnels')
      .then(res => {
        this.tuneles = res.data
      })
      .catch(err => {
        console.error("Error cargando túneles:", err)
      })
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 15px;
}
ul {
  list-style: none;
  padding-left: 0;
}
li {
  background: #2c3e50;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>
