function Grid(size=4,state){
    this.size=size;
    this.cells=[];
    this.init(size)
    if(state){
        this.recover(state);
    }
}

//初始化grid
Grid.prototype.init=function(size){
    for(let row=0;row<size;row++){
        this.cells.push([]);
        for(let column=0;column<size;column++){
            this.cells[row].push(null);
        }
    }
}

//往grid里面添加tile
Grid.prototype.add=function(tile){
    this.cells[tile.row][tile.column]=tile;
}

//查找所有空闲的格子
Grid.prototype.availableCells=function(){
    const availableCells=[];
    for(let row=0;row<this.size;row++){
        for(let column=0;column<this.size;column++){
            if(!this.cells[row][column]){
                availableCells.push({row,column});
            }
        }
    }
    return availableCells;
}

//随机获取某个空闲格子
Grid.prototype.randomAvailableCell=function(){
    const cells=this.availableCells();
    if(cells.length>0){
        return cells[Math.floor(Math.random()*cells.length)];
    }
}

//获取格子
Grid.prototype.get=function(position){
    if(this.outOfRange(position)){
        return null;
    }
    return this.cells[position.row][position.column];
}

//判断某个位置是否超出边界
Grid.prototype.outOfRange=function(position){
    return (position.row<0 || 
        position.row>=this.size || 
        position.column<0 || 
        position.column>=this.size
    );
}

//删除合并前的格子
Grid.prototype.remove=function(tile){
    this.cells[tile.row][tile.column]=null;
}

//序列化
Grid.prototype.serialize=function(){
    const cellState=[];
    for(let row=0;row<this.size;row++){
        cellState[row]=[];
        for(let column=0;column<this.size;column++){
            cellState[row].push(
                this.cells[row][column] ? this.cells[row][column].serialize() : null
            )
        }
    }
    return {
        size:this.size,
        cells:cellState
    }
}

//恢复之前进度
Grid.prototype.recover=function({size,cells}){
    this.size=size;
    for(let row=0;row<this.size;row++){
        for(let column=0;column<this.size;column++){
            const cell=cells[row][column];
            if(cell){
                this.cells[row][column]=new Tile(cell.position,cell.value);
            }
        }
    }
}