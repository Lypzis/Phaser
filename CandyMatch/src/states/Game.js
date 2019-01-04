class Game {
    init() {
        // CONSTANTS
        this.NUM_ROWS = 8;
        this.NUM_COLS = 8;
        this.NUM_VARIATION = 7;
        this.BLOCK_SIZE = 35;
        this.ANIMATION_TIME = 1500;
    }

    create() {
        // game background
        this.background = game.add.sprite(0, 0, 'background');
        this.blocks = game.add.group();

        // board model
        this.board = new Board(this, this.NUM_ROWS, this.NUM_COLS, this.NUM_VARIATION);

        this.drawBoard();
    }

    update() {

    }

    //////////////////////////////////////////////////////////////
    // Create Block
    createBlock(x, y, data) {
        // recycle
        let block = this.blocks.getFirstExists(false);

        // if not, create a block
        if (!block) {
            block = new Block(this, x, y, data);
            this.blocks.add(block);
        }
        else {
            block.resetBlock(x, y, data); // custom reset method
        }

        return block;
    }
    //////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////
    // Draw Board
    drawBoard() {
        let block,
            square,
            x,
            y,
            data;

        // semi-transparent black squares
        const squareBitMap = this.add.bitmapData(this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);
        squareBitMap.ctx.fillStyle = '#000'; // set the color
        squareBitMap.ctx.fillRect(0, 0, this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4); // fill a square

        // creating and positioning on the screen side by side to become a board
        for (let i = 0; i < this.NUM_ROWS; ++i) {
            for (let j = 0; j < this.NUM_COLS; ++j) {
                // spread positioning
                x = 36 + i * (this.BLOCK_SIZE + 6);
                y = 150 + j * (this.BLOCK_SIZE + 6);

                // creating
                square = this.add.sprite(x, y, squareBitMap);
                square.anchor.setTo(0.5);
                square.alpha = 0.2; // opacity

                this.createBlock(x, y, { asset: 'block' + this.board.grid[i][j], row: i, col: j });
            }
        }

        // will make them spawn from the top
        game.world.bringToTop(this.blocks);
    }
    ////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////
    // Kill Block
    getBlockFromColRow(position) {
        let foundBlock;

        this.blocks.forEachAlive(block => {
            if (block.row === position.row && block.col === position.col) {
                foundBlock = block;
            }
        });

        return foundBlock;
    }
    /////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////
    // Block Dropping Animations
    dropBlock(sourceRow, targetRow, col) {
        const block = this.getBlockFromColRow({ row: sourceRow, col: col });
        const targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        block.row = targetRow;

        const blockMovement = game.add.tween(block);
        blockMovement.to({ y: targetY }, this.ANIMATION_TIME);
        blockMovement.start();
    }

    dropReserveBlock(sourceRow, targetRow, col) {
        const x = 36 + col * (this.BLOCK_SIZE + 6);
        const y = -(this.BLOCK_SIZE + 6) * this.board.RESERVE_ROW + sourceRow * (this.BLOCK_SIZE + 6);

        const block = this.createBlock(x, y, { asset: 'block' + this.board.grid[targetRow][col], row: targetRow, col: col });
        const targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        const blockMovement = game.add.tween(block);
        blockMovement.to({ y: targetY }, this.ANIMATION_TIME);
        blockMovement.start();
    }
    //////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////
    // Swap Blocks
    swapBlock(block1, block2) {
        // when swapping scale block 1 back to 1;
        block1.scale.setTo(1);

        // both candies move at same time
        const block1Movement = game.add.tween(block1);
        block1Movement.to({ x: block2.x, y: block2.y }, this.ANIMATION_TIME);
        block1Movement.onComplete.add(() => {
            // after animation wee update the model
            this.board.swap(block1, block2);

            if (!this.isReversingSwap) {
                const chains = this.board.findAllChains();

                if (chains.length > 0) {
                    this.updateBoard();
                } else {
                    this.isReversingSwap = true;
                    this.swapBlock(block1, block2);
                }
            } else {
                this.isReversingSwap = false;
            }
        })
        block1Movement.start();

        const block2Movement = game.add.tween(block2);
        block2Movement.to({ x: block1.x, y: block1.y }, this.ANIMATION_TIME);
        block2Movement.start();
    }
    ///////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////
    // Pick Block
    pickBlock(block){
        // only swap if the UI is not blocked
        if(this.isBoardBlocked){
            return;
        }

        // if there is nothing selected
        if(!this.selectedBlock){
            // hightlight the first block
            block.scale.setTo(1.5);

            this.selectedBlock = block;
        } else {
            // only adjacent blocks can swap

            // second block you are selecting is target block
            this.targetBlock = block;

            // only adjacent blocks can swap
            if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)){
                // block the UI
                this.isBoardBlocked = true;

                // swap blocks
                this.swapBlock(this.selectedBlock, this.targetBlock);
            } else {
                this.clearSelection();
            }
        }
    }

    clearSelection(){
        this.isBoardBlocked = false;
        this.selectedBlock = null;
        this.blocks.setAll('scale.x', 1);
        this.blocks.setAll('scale.y', 1);
    }
    ///////////////////////////////////////////////////////////////////

    updateBoard(){
        this.board.clearChains();
        this.board.updateGrid();

        // after the dropping has ended
        this.game.time.events.add(this.ANIMATION_TIME, () => {
            // see if there are new chains
            const chains = this.board.findAllChains();

            if(chains.length > 0){
                this.updateBoard();
            }else {
                this.clearSelection();
            }
        });
    }

}