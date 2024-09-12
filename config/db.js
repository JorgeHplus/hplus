const mysql = require('mysql2');

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Número máximo de conexiones en el pool
    queueLimit: 0
});

// Verificar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos exitosa');
        connection.release();  // Liberar la conexión de vuelta al pool
    }
});

module.exports = pool.promise();
