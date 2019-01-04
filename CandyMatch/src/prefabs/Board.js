class Board {
    constructor(state, rows, cols, blockVariations) {
        this.state = state;
        this.rows = rows;
        this.cols = cols;
        this.blockVariations = blockVariations;

        // main grid
        this.grid = [];
        this.populateGrid(this.grid, this.rows);

        // reserve grid on the top, for when new blocks are needed
        this.reserveGrid = [];
        this.RESERVE_ROW = this.rows;
        this.populateGrid(this.reserveGrid, this.RESERVE_ROW);

        this._consoleGrid(this.grid);
        this._consoleGrid(this.reserveGrid);
    }

    // populate grid with random numbers in each cell
    populateGrid(grid, rows) {
        let variation;

        // rows
        for (let row = 0; row < rows; ++row) {
            grid.push([]);

            // columns by rows
            for (let col = 0; col < this.cols; ++col) {
                grid[row].push(0);

                // adding a random number to the cell
                variation = 1 + Math.floor(Math.random() * this.blockVariations); // number between one and six
                grid[row][col] = variation;
            }
        }

        // if there are any chains, re-populate
        const chains = this.findAllChains();
        if(chains.length > 0){
            // this.populateGrid();
        }
    }

    // console grid in a more readable friendly way :)
    _consoleGrid(grid) {
        let prettyString = '';

        // for each row
        grid.forEach(e => {
            prettyString += '\n';

            // for each column of the row (a cell)
            e.forEach(cell => {
                prettyString += cell + ' ';
            });
        });

        console.log(prettyString);
    }

    ////////////////////////////////////////////////////////
    // Swap and check adjacent blocks

    // swapping blocks
    swap(source, target) {
        // swap two cells
            let temp = this.grid[target.row][target.col];
            this.grid[target.row][target.col] = this.grid[source.row][source.col];
            this.grid[source.row][source.col] = temp;
        
            const tempPos = {row: source.row, col: source.col};
            source.row = target.row;
            source.col = target.col;

            target.row = tempPos.row;
            target.col = tempPos.col;
    }

    // check if two blocks are adjacent or not
    checkAdjacent(source, target) {
        const diffRow = Math.abs(source.row - target.row);
        const diffCol = Math.abs(source.col - target.col);

        // one row of difference but same column OR same row and one column of difference
        return (diffRow == 1 && diffCol == 0) || (diffRow == 0 && diffCol == 1);
    }
    /////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////
    // Is a block chained?

    //check whether a single block/cell is chained or not
    isChained(block) {
        let isChained = false;
        const variation = this.grid[block.row][block.col];
        const row = block.row;
        const col = block.col;

        // left
        if (variation == this.grid[row][col - 1] && variation == this.grid[row][col - 2])
            isChained = true;

        // right
        if (variation == this.grid[row][col + 1] && variation == this.grid[row][col + 2])
            isChained = true;

        // up
        // preventing undefined
        if (this.grid[row - 2])
            if (variation == this.grid[row - 1][col] && variation == this.grid[row - 2][col])
                isChained = true;

        // down 
        if (this.grid[row + 2])
            if (variation == this.grid[row + 1][col] && variation == this.grid[row + 2][col])
                isChained = true;

        // center - horizontally
        if (variation == this.grid[row][col - 1] && variation == this.grid[row][col + 1])
            isChained = true;

        // center - vertically
        if (this.grid[row - 1] && this.grid[row + 1])
            if (variation == this.grid[row - 1][col] && variation == this.grid[row + 1][col])
                isChained = true;

        return isChained;
    }
    //////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////
    // Find all chains
    findAllChains() {
        const chained = [];

        // rows
        for (let row = 0; row < this.rows; ++row) {
            // columns by rows
            for (let col = 0; col < this.cols; ++col) {
                if (this.isChained({ row: row, col: col })) {
                    chained.push({ row: row, col: col });
                }
            }
        }

        console.log(chained);
        return chained;
    }
    ///////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    // Clear chains
    clearChains() {
        // gets all blocks that needs to be cleared
        const chainedBlocks = this.findAllChains();

        // set them to zero
        chainedBlocks.forEach(block => {
            this.grid[block.row][block.col] = 0;

            // kill the block object
            this.state.getBlockFromColRow(block).kill(); /// ????
        });

        }
    //////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////
    // Drop Blocks
    // drops a block in the main grid from a position to another. The source is set to 0.
    dropBlock(sourceRow, targetRow, col) {
        this.grid[targetRow][col] = this.grid[sourceRow][col];
        this.grid[sourceRow][col] = 0;

        this.state.dropBlock(sourceRow, targetRow, col); //?????
    }

    // drops from the reserve grid to the main grid
    dropReserveBlock(sourceRow, targetRow, col) {
        this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
        this.reserveGrid[sourceRow][col] = 0;

        this.state.dropReserveBlock(sourceRow, targetRow, col); //?????
    }

    ////////////////////////////////////////////////////////////////
    // Update Grid
    // move down blocks to fill in empty slots
    updateGrid() {
        let foundBlock;

        // go through all the rows, from the bottom up
        for (let row = this.rows - 1; row >= 0; --row) {
            for (let col = 0; col < this.cols; ++col) {
                // if the block is zero, then get climb up to get a non-zero one
                if (this.grid[row][col] == 0) {
                    foundBlock = false;

                    // climb up in the main grid
                    for (let k = row - 1; k >= 0; --k) {
                        if (this.grid[k][col] > 0) {
                            this.dropBlock(k, row, col);
                            foundBlock = true;
                            break;
                        }
                    }
                    
                    // climb up in the reserve grid
                    if (!foundBlock)
                        for (let k = this.RESERVE_ROW - 1; k >= 0; --k) {
                            if (this.reserveGrid[k][col] > 0) {
                                this.dropReserveBlock(k, row, col);
                                break;
                            }
                        }

                }
            }
        }

        // repopulate the reserve
        this.populateGrid(this.reserveGrid, this.RESERVE_ROW);
        //this.populateGrid(this.grid, this.rows);
    }
}