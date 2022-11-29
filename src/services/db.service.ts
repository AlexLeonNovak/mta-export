import mssql, {ConnectionPool} from 'mssql';

const { MSSQL_SERVER, MSSQL_DATABASE, MSSQL_USER,	MSSQL_PASSWORD } = process.env;

export class DbService {
  private _connection: ConnectionPool;

  async init() {
    const config: mssql.config = {
      user: MSSQL_USER,
      password: MSSQL_PASSWORD,
      server: MSSQL_SERVER,
      database: MSSQL_DATABASE,
      //driver: "msnodesqlv8",
      options: {
        trustServerCertificate: true,
      },
    }
    const pool = new mssql.ConnectionPool(config);
    this._connection = await pool.connect();
  }

  private async getConnection() {
    if (!this._connection) {
      await this.init();
    }
    return this._connection;
  }

  async getCRMData(offset = 0, limit = 1000) {
      const sql = `SELECT *
                   FROM dbo.vw_Personalx_Crm
                   WHERE Phone_Number_3 != '' OR Home_email != ''
                   ORDER BY timestamp DESC
                   OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
                   ;
      `;
      //OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
      //WHERE (Email IS NOT NULL OR LTRIM(RTRIM(Email)) != '') AND Mobile IS NOT NULL
      const connection = await this.getConnection();
      const {recordset} = await connection.request().query(sql);
      return recordset;
  }

  async getCount() {
    const sql = `SELECT COUNT(*) c FROM dbo.vw_Personalx_Crm 
        WHERE Phone_Number_3 != '' OR Home_email != ''
  `;
    const connection = await this.getConnection();
    const { recordset } = await connection.request().query(sql);
    return recordset[0].c;
  }

  async getByKeyVal(tableName, key, value) {
    const sql = `SELECT * FROM dbo.${tableName} 
         WHERE ${key} IN ('${Array.isArray(value) ? value.join("','") : value}')
	`;
    const connection = await this.getConnection();
    const { recordset } = await connection.request().query(sql);
    return recordset;
  }

}

//process.on('exit', async () => {
//  const connection = await mssql.connect(config);
//  await connection.close();
//})
