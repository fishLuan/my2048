function Tile(position,value){
    this.row=position.row;
    this.column=position.column;
    this.value=value;
    this.prePosition=null;
    this.mergedTiles=null;
}

//更新tile位置
Tile.prototype.updatePosition=function(position){
    this.prePosition={row:this.row,column:this.column};
    this.row=position.row;
    this.column=position.column;
}

//序列化
Tile.prototype.serialize=function(){
    return {
        position:{
            row:this.row,
            column:this.column
        },
        value:this.value
    }
}