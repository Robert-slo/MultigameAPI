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

let insertOsebe = `insert into osebe values(2, 'Robert', 'Davidson', 'robert.jovanovski06@gmail.com', convert(date, '11.11.2004'), 041250834)`;

Router.get('/', async (req, res, next) => {
    try {
        await sql.connect(config);
        const result = await sql.query(`select * from racuni`);
        res.status(200).json({
            message: 'Data retrieved successfully',
            data: result.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error retrieving data from database' + err
        });
    }
});



Router.post('/', async (req, res, next) => {
    
    try{
        await sql.connect(config);
        const result = sql.query(insertOsebe);
        res.json({
            message: "data inserted successfully",
            data: result.recordset
            });
        }
        catch (err){
            res.json({
                message: err.message
            });
        };
    
    
});

Router.post('/:Name', (req, res, next) => {
    const name = req.params.Name;
    res.status(200).json({
        message: 'Post ' + name
    });
});

Router.get('/:Name', (req, res, next) => {
    const name = req.params.Name;
    res.status(200).json({
        message: 'Post ' + name
    });
});

Router.post('/', (req, res, next) => {
    sql.connect(config, (req, res, next) => {

    });
});


Router.patch('/:name', async (req, res, next) => {
    try {
        await sql.connect(config); // Povezava na bazo, ki je aktivna na AWS, preko prej definirana v "config" spremenljivki.
        const name = req.params.name; // Dobim vneseno ime uporabnika, in definiram v spremenljivko tipa string
        const result = await sql.query(`update racuni set uporabnisko_ime = '˘${name}'`);
        res.status(200).json({
            message: 'Username has been changed successfully'

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error changing the username, check if your username is different from the original one' // Če je uporabniško ime enako prejšnjemu, ali kateremkoli drugemu, se to izpiše.
        });
    }
});



Router.patch('/:user/:password', async (req, res, next) => { // oznake ":" označuje parametre, ki jih lahko dobim in shranim kot spremenljivko v programu
    try {
        await sql.connect(config); // povezava na bazo
        const password = req.params.password; // pridobivanje novega gesla, in dodajanje gesla v spremenljivko
        const username = req.params.user; // pridobivanje uporabnika, za katerega se spreminja geslo
        const pass = sql.query(`select geslo from racuni where uporabnisko_ime =` +"'" + `${username}` + "'") // Pridobivanje iz baze prejšnjega gesla za uporabnika
        const userPass = pass.recordset.data[0].toString();
        console.log(pass.recordset);
        if(userPass.recordset[0] === password){ // preverjanje ali je novo geslo enako prejšnjemu oz. aktualnemu
            req.status(400).json({ // V primeru, da je geslo enako sporoči programu sporočilo
                message: 'Password cannot be same as before' // To sporočilo se vrne programu, ker je spremenjeno geslo enako aktualnemu
            });
        }
        else{ // če pa je geslo drugačno prejšnjemu se vrne sporočilo, da je vse vredu
            req.json({
                message: 'Password is different from before' // Sporočilo, ki se vrne
            });   
        }
        const result = await sql.query(`update racuni set geslo = '${password}' where uporabnisko_ime = '${username}'`); // Menjava gesla za uporabnika, s SQL ukazom na bazi
        res.status(200).json({ // Vrnitev statusa, da vse poteka vredu 
            message: 'Password has been changed successfully' // Vrnitev sporočila, da je vse vredu
            
        });
    } catch (err) { // V primeru, da pride do napake, to napako prestreže, in jo izpiše
        console.error(err); // Izpis napake
        res.status(500).json({ // Vrne status, da nekaj ni vredu
            message: 'Error changing the password, check if your username is different from the original one ' + err, // Vrnitev sporočila, da je geslo enako prejšnjemu
        });
    }
});


module.exports = Router; // Naredi modul dostopen znotraj mape "UNITYAPI"