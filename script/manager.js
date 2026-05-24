function Manager(size=4){
    this.size=size;
    this.render=new Render();
    this.storage=new Storage();
    let self=this;
    this.listener=new Listener({
        move:function(direction){
            self.listenerFn(direction);
            // console.log(direction);
        },
        start:function(){
            self.start();
        }
    });
    this.defaultStart();
}

//游戏开始
Manager.prototype.start=function(){
    this.score=0;
    this.status='DOING';
    this.grid=new Grid(this.size);
    for(let i=0;i<2;i++){
        this.addRandomTile();
    }
    this._render();
}

Manager.prototype.defaultStart=function(){
    const state=this.storage.getCellState();
    let bestScore=this.storage.getBestScore();
    if(!bestScore){
        bestScore=0;
    }
    this.bestScore=bestScore;
    if(state){
        this.score=state.score;
        this.status='DOING';
        this.grid=new Grid(this.size,state.grid);
        this._render();
    }else{
        this.start();
    }
}

//重构一个render
Manager.prototype._render=function(){
    this.storage.setCellState({score:this.score,grid:this.grid});
    if(this.score>this.bestScore){
        this.bestScore=this.score;
        this.storage.setBestScore(this.bestScore);
    }
    this.render.render(this.grid,{score:this.score,status:this.status,bestScore:this.bestScore});
}

//添加一个随机格子
Manager.prototype.addRandomTile=function(){
    const position=this.grid.randomAvailableCell();
    if(position){
        const value=Math.random()<0.9 ? 2:4;
        this.grid.add(new Tile(position,value));
    }
}

// //获取遍历路径
Manager.prototype.getPaths=function(direction){
    let rowPath=[];
    let columnPath=[];
    //向左的遍历和向上的遍历
    for(let i=0;i<this.size;i++){
        rowPath.push(i);
        columnPath.push(i);
    }
    //向右的遍历
    if(direction.column===1){
        columnPath=columnPath.reverse();
    }

    //向下的遍历
    if(direction.row===1){
        rowPath=rowPath.reverse();
    }
    return {rowPath:rowPath,columnPath:columnPath};
}


// //寻找移动方向目标位置
Manager.prototype.getNearestAvailableAim=function(aim,direction){
    //位置+方向向量的公式
    function addVector(position,direction){
        return {
            row:position.row+direction.row,
            column:position.column+direction.column
        };
    }
    aim=addVector(aim,direction);
    let next=this.grid.get(aim);
    while(!this.grid.outOfRange(aim) && !next){
        aim=addVector(aim,direction);
        next=this.grid.get(aim);
    }

    aim={
        row:aim.row-direction.row,
        column:aim.column-direction.column
    };
    return {
        aim,next
    };
}


// //移动到目标位置
Manager.prototype.moveTile=function(tile,aim){
    this.grid.cells[tile.row][tile.column]=null;
    tile.updatePosition(aim);
    this.grid.cells[aim.row][aim.column]=tile;
}

//移动监听
Manager.prototype.listenerFn=function(direction){
    let moved=false;
    const {rowPath,columnPath}=this.getPaths(direction);
    for(let i=0;i<rowPath.length;i++){
        for(let j=0;j<columnPath.length;j++){
            const position={row:rowPath[i],column:columnPath[j]};
            const tile=this.grid.get(position);
            if(tile){
                const {aim,next}=this.getNearestAvailableAim(position,direction);
                if(next && next.value===tile.value){
                    const merged=new Tile(
                        {
                            row:next.row,
                            column:next.column
                        },
                        tile.value*2
                    );
                    this.score+=merged.value;
                    this.grid.add(merged);
                    this.grid.remove(tile);
                    if(merged.value===2048){
                        this.status==='WIN';
                    }
                    merged.mergedTiles=[tile,next];
                    tile.updatePosition({row:next.row,column:next.column});
                    moved=true;
                }else{
                    this.moveTile(tile,aim);
                    moved=true;
                }

            }
        }
    }
    if(moved){
        this.addRandomTile();
        if(this.checkFailure()){
            this.status='FAILURE';
        }
        this._render();
    }
}

//判断是否失败
Manager.prototype.checkFailure=function(){
    const emptyCells=this.grid.availableCells();
    if(emptyCells.length>0){
        return false;
    }
    //判断四个方向的格子是否有相等的
    for(let row=0;row<this.grid.size;row++){
        for(let column=0;column<this.grid.size;column++){
            let now=this.grid.get({row,column});
            let directions=[
                {row:0,column:1},
                {row:0,column:-1},
                {row:1,column:0},
                {row:-1,column:0}
            ]
            for(let i=0;i<directions.length;i++){
                const direction=directions[i];
                const next=this.grid.get({
                    row:row+direction.row,
                    column:column+direction.column
                });
                if(next&&next.value===now.value){
                    return false;
                }
            }
        }
    }
    return true;
}