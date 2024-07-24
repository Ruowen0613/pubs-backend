// db.js

const sql = require('mssql/msnodesqlv8');

// Configure database connection
// const config = {
//   user: 'co-op-login',
//   password: 'Wrwen@040613',
//   server: 'co-op-db-wang.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
//   database: 'pubs',
//   options: {
//     encrypt: true, // Use encryption
//     trustServerCertificate: false, // Do not trust the server certificate
//     enableArithAbort: true, // Enable to avoid SQL injection attacks
//   },
//  };

var config = {
    driver: 'msnodesqlv8',
    connectionString: 'Driver=SQL Server Native Client 11.0;Server=ON34C03257014\\MSSQLSERVER01;Database=pubs;Trusted_Connection=yes;'
};
 
// Driver={ODBC Driver 18 for SQL Server};
//Server=tcp:co-op-db-wang.database.windows.net,1433;Database=pubs;
//Uid=co-op-login;Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;
// Function to connect to database
async function connectToDB() {
    try {
        await sql.connect(config);
        console.log('Connected to Azure SQL Database');
      } catch (err) {
        console.error('Error connecting to Azure SQL Database:', err);
      }
}

module.exports = {
  connectToDB,
  sql
};
