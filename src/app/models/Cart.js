module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = parseFloat(storedItem.item.price) * parseFloat(storedItem.qty);
        
        this.totalQty++;
        this.totalPrice = parseFloat(this.totalPrice) + parseFloat(storedItem.item.price);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    };

    this.updateQuantity = function(id, newQty){
        var storedItem = this.items[id];
        if(storedItem){
            this.totalPrice = parseFloat(this.totalPrice) - parseFloat(storedItem.price)
            this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
            
            this.totalQty   =  parseInt(this.totalQty) - parseInt(storedItem.qty);
            
            console.log(storedItem.item.quantity)
            console.log(storedItem.qty)

            if(newQty > storedItem.item.quantity)
            {
                newQty = 1;
            }
          

           // this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
            storedItem.qty = newQty;
            storedItem.price = parseFloat(storedItem.item.price) * parseFloat(storedItem.qty);
            //console.log("Price: ", storedItem.price)

            this.totalQty   =  parseInt(this.totalQty) + parseInt(storedItem.qty);
           

            this.totalPrice = parseFloat(this.totalPrice) + parseFloat(storedItem.price);
           // console.log("Total Price not fix: ", this.totalPrice)

            this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
            //console.log("Total Price: ", this.totalPrice)

        }
    }

    this.reduceByOne= function(id){
        var storedItem = this.items[id];

        storedItem.qty--;
        storedItem.price = parseFloat(storedItem.price) - parseFloat(storedItem.item.price);
        storedItem.price = parseFloat(storedItem.price).toFixed(2);


        this.totalQty--;
        this.totalPrice = parseFloat(this.totalPrice) - parseFloat(storedItem.item.price);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);

        if(this.items[id].qty <= 0){
            delete this.items[id];
        }
    }
    this.removeItem= function(id){

        this.totalQty -= this.items[id].qty;
        this.totalPrice = parseFloat(this.totalPrice) - parseFloat(this.items[id].price);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
        
        delete this.items[id];
    }

    this.totalPrices = function(){
        var total = 0;
        for(var id in this.items){
           total = total + this.items[id].price
        }
        return total;
    };

  

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
}