define([

], function () {
	object = {};

	function Cell(state) {
		this.state = state;
		return this;
	}

	var grid = [];
	var setUpGrid = function (rows, cols) {
		for (var i = 0; i < cols; i++) {
			grid[i] = [];
			for (var j = 0; j < rows; j++) {
				grid[i][j] = new Cell(0);
			}
		}
	};

	var config = {
		cell: {
			height: 16,
			width: 24
		},
		roll: {
			cols: 25,
			rows: 10
		}
	};





	var canvas, context;

	function isCellValid(cellx, celly) {
		return cellx == Math.max(0, Math.min(cellx, config.roll.cols - 1)) &&
			celly == Math.max(0, Math.min(celly, config.roll.rows - 1));
	}

	object.getCanvas = function () {
		return canvas;
	};

	object.getContext = function () {
		return context;
	};

	object.getCellPos = function (mx, my) {
		return {
			x: Math.floor(mx / config.cell.width),
			y: Math.floor(my / config.cell.height)
		};
	};

	var interval;
	object.create = function () {
		interval = setInterval(update, 50);

		setUpGrid(config.roll.rows, config.roll.cols);

		canvas = document.getElementById('canvas');
//		canvas.width = config.roll.cols * config.cell.width;
//		canvas.height = config.roll.rows * config.cell.height;

		context = canvas.getContext('2d');
		context.font = '38pt Arial';
		context.fillStyle = 'cornflowerblue';
		context.strokeStyle = 'blue';

		drawGrid();
	};

	object.updateTempo = function(bpm) {
		clearInterval(interval);

		var ms = bpm; //???? set this better later

		interval = setInterval(update, ms);
	};

	var playerPos = 0;
	function update() {
		if(playerPos <= config.cell.width * config.roll.cols) {
			playerPos += config.cell.width / 10;
		} else {
			playerPos = 0;
		}

		drawGrid();
		drawPlayer();
	}

	function drawPlayer() {
		context.strokeStyle = 'red';

		context.strokeRect(playerPos, 0, 1, config.cell.height * config.roll.rows);

		context.strokeStyle = 'blue';

	}

	function drawGrid() {
		context.fillStyle = '#908f8f';
		context.fillRect(0, 0, canvas.width, canvas.height);



		var cols, rows;
		cols = grid.length;
		rows = grid[0].length;

		for (var i = 0; i < cols; i++) { //columns
			for (var j = 0; j < rows; j++) { //rows
				drawCell(i, j, grid[i][j]);
			}
		}

	}

	function drawCell(x, y, cell) {
		var cx, cy;
		//straddle those pixels
		cx = x * config.cell.width + 0.5;
		cy = y * config.cell.height + 0.5;


		//left
		context.beginPath();
		context.strokeStyle = '#adacac';
		context.moveTo(cx, cy);
		context.lineTo(cx, cy + config.cell.height - 2);
		context.stroke();

		//right
		context.beginPath();
		context.strokeStyle = '#747473';
		context.moveTo(cx + config.cell.width - 1, cy);
		context.lineTo(cx + config.cell.width - 1, cy + config.cell.height);
		context.stroke();

		//top
		context.beginPath();
		context.strokeStyle = '#adacac';
		context.moveTo(cx + 1, cy);
		context.lineTo(cx + config.cell.width, cy);
		context.stroke();

		//bottom
		context.beginPath();
		context.strokeStyle = '#747473';
		context.moveTo(cx, cy + config.cell.height - 1);
		context.lineTo(cx + config.cell.width, cy + config.cell.height - 1);
		context.stroke();



		if (cell.state === 0) {


		} else if (cell.state == 1) {


			context.fillStyle = 'pink';
			context.strokeStyle = 'red';

			context.fillRect(cx + 3, cy + 2, config.cell.width - 7, config.cell.height - 6);
			context.strokeRect(cx + 3, cy + 2, config.cell.width - 7, config.cell.height - 6);
		}

	}

	object.setCell = function (x, y, state) {
		if (isCellValid(x, y)) {


			grid[x][y].state = state;

		}
	};

	return object;
});