const express = require('express');
const Router = express.Router();
const sql = require('mssql');


const config ={
    server: 'multigame.cewnezl9ttkd.eu-central-1.rds.amazonaws.com',
    user: 'admin',
    password: 'robjov12',
    database: 'Multigame',
    options:{
        encrypt: true,
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
          ca: "eu-central-1-bundle.pem"
        }
    }
}


Router.get('/', async(req, res, next) =>{
    try{
        await sql.connect(config);
        const result = await sql.query(`select * from racuni`);
        const result2 = await sql.query(`select * from osebe`);
        const result3 = await sql.query(`select * from igre`);
        const result4 = await sql.query(`select * from dosezki`);


        res.status(200).json({
            message: 'It works!',
            data: result.recordset,
            data2: result2.recordset,
            data3: result3.recordset,
            data4: result4.recordset
        });

    }
    catch(err){

        res.status(500).json({
            message: 'Something went wrong ' + err
        });

    }
});




// Pridobivanje parametrov za vpis v bazo
Router.post('/:ime/:priimek/:email/:datum/:telst', async(req, res, next) =>{
    try{
        await sql.connect(config);
        const ime = req.params.ime;
        const priimek = req.params.priimek;
        const datRoj =  req.params.datum;
        const mail = req.params.email;
        const telst = req.params.telst;
        const ID = await sql.query(`select max(id_osebe) from osebe`);
        const IDosebe = ID.recordset[0]['']+1; // Pridobivanje Unikatnega ID_osebe =====> +1 najvišjem aktualnem ključu
        const result = await sql.query(`insert into osebe values(${IDosebe}, '${ime}', '${priimek}', '${mail}', convert(date, '${datRoj}'), ${telst})`);

        res.status(200).json({
            message: 'It works!'
        });


    }
    catch(err){ // Če se pojavi napaka, jo izpiše skupaj s tekstom
        res.json({
            message: 'Error has occured, please check logs' + err
        });
    }
});





module.exports = Router; // Naredi modul dostopen znotraj mape "UNITYAPI"