//firebase
const admin= require('firebase-admin');
var serviceAccount = require("../ingesoftware-a3995-firebase-adminsdk-m2t7l-01a47ca722.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ingesoftware-a3995-default-rtdb.firebaseio.com'
});
const database= admin.database();
/*
$env:GOOGLE_APPLICATION_CREDENTIALS=""
*/


module.exports=database;
