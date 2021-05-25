const indexCtrl={}
const db= require('../database')

//funciones de redendizar las paginas 
//navegaciones
indexCtrl.renderIndex=(req,res)=>{
    db.ref('Productos').once('value', (snapshot) => {
        const productos = snapshot.val();
        console.log(req.method);
        res.render('index', {productos: productos});
    }
    );};

    indexCtrl.renderGrafica=(req,res)=>{
        db.ref('/').once('value', (snapshot) => {
            const data = snapshot.val();
            var venta= JSON.stringify(data.Ventas);
            var mensual= JSON.stringify(data.Registro_Mensual);
            var productos= JSON.stringify(data.Productos);
            console.log(venta);
            console.log(mensual);
            res.render('graficas', { ganancias: mensual, productos: productos, ventas: venta});
        }
        );};

indexCtrl.renderVentas=(req,res)=>{
    db.ref('Productos').once('value',(snapshot)=>{
        let productos = snapshot.val();
        let p=JSON.stringify(productos);
        //console.log(productos);
        res.render('ventas', {lista: productos});
    });
};

//solicitud de alta ventas
indexCtrl.altaVentas=(req,res)=>{
    //captura de los productos seleccionados
    var datos={};
    datos=req.body;
    var fecha = new Date();
    var mesActual = fecha.getMonth()+1;
    datos.Producto.forEach(element => {
        //console.log(element.Nombre);
        var producto={
            CantidadVendida: element.Cantidad,
            Ganancia: (element.Cantidad * element.Precio),
            Id: element.Id,
            IdProducto: element.Id,
            Mes: mesActual
        };
        var ref=db.ref('Ventas');
        ref.orderByChild("IdProducto").equalTo(parseInt(producto.Id)).once("value", function(snapshot){
            if(snapshot.exists()){
                console.log("Existe");
                var vP=[];
                vP.push(JSON.stringify(snapshot.val()));
                vP.forEach(venta=>{
                    var obj=JSON.parse(venta);
                    for(var i in obj){
                        var fK=-1; // 0 si no coiden con el mes de lo contrario se guarda la llave
                        var nuevaCantidad=0;
                        var nuevaGanancia=0;
                        if(producto.Mes==obj[i].Mes){
                        fK=Object.keys(obj);
                        nuevaCantidad=obj[i].CantidadVendida+producto.CantidadVendida;
                        nuevaGanancia=obj[i].Ganancia+producto.Ganancia;
                        }
                        //validar si existe tal mes
                        if(fK!=-1){
                            console.log("Actualizar");
                            //actualizar tabla venta
                            db.ref("Ventas/"+fK).update({
                                CantidadVendida: nuevaCantidad,
                                Ganancia: nuevaGanancia
                            });
                            //actualizar existencia
                            var nuevaExistencia=(element.Existencia - element.Cantidad);
                            var ref=db.ref("Productos");
                            ref.orderByChild("Id").equalTo(parseInt(producto.Id)).once("value", function(snapshot){
                            let llaveProducto=Object.keys(snapshot.val());
                                db.ref("Productos/"+llaveProducto).update({
                                    Existencia: nuevaExistencia
                             });
                            });
                        
                        }else{

                            //alta nueva tabla venta
                            //transformar los valores a Int
                            var cV=parseInt(producto.CantidadVendida);     
                            var g=parseInt(producto.Ganancia);  
                            var id=parseInt(producto.Id);   
                            //db alta
                            db.ref("Ventas").push({
                                CantidadVendida: cV,
                                Ganancia: g,
                                Id: id,
                                IdProducto: id,
                                Mes: mesActual
                            });
                            //actualizar existencia
                            var nuevaExistencia=(element.Existencia - element.Cantidad);
                            var ref=db.ref("Productos");
                            ref.orderByChild("Id").equalTo(parseInt(producto.Id)).once("value", function(snapshot){
                            let llaveProducto=Object.keys(snapshot.val());
                                db.ref("Productos/"+llaveProducto).update({
                                    Existencia: nuevaExistencia
                                });
                            });
                        
                        }//fin del else
                    }//fin del for

                });//fin del foreach
            }else{
            console.log("No existe");

            //alta nueva tabla venta
            //transformar los valores a Int
            var cV=parseInt(producto.CantidadVendida);     
            var g=parseInt(producto.Ganancia);  
            var id=parseInt(producto.Id);   
            //db alta
            db.ref("Ventas").push({
            CantidadVendida: cV,
            Ganancia: g,
            Id: id,
            IdProducto: id,
            Mes: mesActual
            });
            //actualizar existencia
            var nuevaExistencia=(element.Existencia - element.Cantidad);
            var ref=db.ref("Productos");
            ref.orderByChild("Id").equalTo(parseInt(producto.Id)).once("value", function(snapshot){
                let llaveProducto=Object.keys(snapshot.val());
                db.ref("Productos/"+llaveProducto).update({
                    Existencia: nuevaExistencia
                });
            });
            
            }//fin del primer if/else
        });//fin del primer consulta Venta

    });//fin foreach

};

indexCtrl.renderReportes = (req, res) => {
    db.ref('/').once('value', (snapshot) => {
    const dat = snapshot.val();
    var venta= JSON.stringify(dat.Ventas);
    var compra=JSON.stringify(dat.Compras);
    var producto= JSON.stringify(dat.Productos);
    //console.log(dat);
    res.render('reportes', { ventas: venta, compras: compra, productos: producto});
}
);};

indexCtrl.editarDatos=(req,res)=>{
    console.log(req.body);
   let producto=req.body;
   db.ref('Productos/'+producto.Id).update({'Existencia':producto.existencia});
    res.redirect('/');
};

module.exports=indexCtrl;