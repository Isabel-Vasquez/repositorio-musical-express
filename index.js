const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Ruta para obtener todas las canciones
app.get('/canciones', (req, res) => {
  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo: ' + err.message);
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para obtener una canción específica por ID
app.get('/canciones/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo: ' + err.message);
      return;
    }
    const canciones = JSON.parse(data);
    const cancion = canciones.find((c) => c.id === id);
    if (cancion) {
      res.json(cancion);
    } else {
      res.status(404).send('Canción no encontrada');
    }
  });
});

// Ruta para agregar una nueva canción
app.post('/canciones', (req, res) => {
  const nuevaCancion = req.body;
  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo: ' + err.message);
      return;
    }
    const canciones = JSON.parse(data);
    canciones.push(nuevaCancion);
    fs.writeFile('repertorio.json', JSON.stringify(canciones), (err) => {
      if (err) {
        res.status(500).send('Error al escribir en el archivo: ' + err.message);
        return;
      }
      res.status(201).send('Canción agregada con éxito');
    });
  });
});

// Ruta para actualizar una canción existente
app.put('/canciones/:id', (req, res) => {
  const id = req.params.id;
  const cambios = req.body;

  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo: ' + err.message);
      return;
    }
    let canciones = JSON.parse(data);
    const index = canciones.findIndex((c) => c.id === id);
    if (index !== -1) {
      canciones[index] = { ...canciones[index], ...cambios };
      fs.writeFile('repertorio.json', JSON.stringify(canciones), (err) => {
        if (err) {
          res
            .status(500)
            .send('Error al actualizar el archivo: ' + err.message);
          return;
        }
        res.send('Canción actualizada con éxito');
      });
    } else {
      res.status(404).send('Canción no encontrada');
    }
  });
});

// Ruta para eliminar una canción
app.delete('/canciones/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile('repertorio.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo: ' + err.message);
      return;
    }
    const canciones = JSON.parse(data);
    const nuevasCanciones = canciones.filter((c) => c.id !== id);
    fs.writeFile('repertorio.json', JSON.stringify(nuevasCanciones), (err) => {
      if (err) {
        res.status(500).send('Error al eliminar del archivo: ' + err.message);
        return;
      }
      res.send('Canción eliminada con éxito');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Devolver la página web principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
