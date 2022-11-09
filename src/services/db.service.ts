import mssql, {ConnectionPool} from 'mssql';

const { MSSQL_SERVER, MSSQL_DATABASE, MSSQL_USER,	MSSQL_PASSWORD } = process.env;

const config = {
  user: MSSQL_USER,
  password: MSSQL_PASSWORD,
  server: MSSQL_SERVER,
  database: MSSQL_DATABASE,
  options: {
    trustServerCertificate: true,
  },
}

export class DbService {
  private connection: ConnectionPool;

  constructor() {
    this.init().then();
  }

  async init() {
    const config: mssql.config = {
      user: MSSQL_USER,
      password: MSSQL_PASSWORD,
      server: MSSQL_SERVER,
      database: MSSQL_DATABASE,
      options: {
        trustServerCertificate: true,
      },
    }

    this.connection = await mssql.connect(config);
  }

  async getData(tableName, offset = 0, limit = 1000) {
      const sql = `SELECT *
                   FROM dbo.${tableName}
                   OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
      `;
      //WHERE (Email IS NOT NULL OR LTRIM(RTRIM(Email)) != '') AND Mobile IS NOT NULL
      const {recordset} = await this.connection.request().query(sql);
      return recordset;
  }

  async getCount(tableName) {
    const sql = `SELECT COUNT(*) c FROM dbo.${tableName} 
               WHERE (Email IS NOT NULL OR LTRIM(RTRIM(Email)) != '') AND Mobile IS NOT NULL
  `;
    const { recordset } = await this.connection.request().query(sql);
    return recordset[0].c;
  }

  async getByKeyVal(tableName, key, value) {
    const sql = `SELECT * FROM dbo.${tableName} 
         WHERE ${key} IN ('${Array.isArray(value) ? value.join("','") : value}')
	`;
    const { recordset } = await this.connection.request().query(sql);
    return recordset;
  }

}

process.on('exit', async () => {
  const connection = await mssql.connect(config);
  await connection.close();
})
