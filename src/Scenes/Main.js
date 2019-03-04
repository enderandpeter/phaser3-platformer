import Phaser from 'phaser';

export default class Main extends Phaser.Scene {
    platforms = null
    player = null
    cursors = null
    stars = null
    bombs = null
    score = 0
    scoreText = null
    gameOver = false
    constructor() {
        super("Main");
    }

    /**
     * Typically called when a star is touched by the player
     * @param player
     * @param star
     */
    collectStar (player, star)
    {
        // Hide the star
        star.disableBody(true, true);

        // Add and display the new score when a star is picked up
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Create the bombs if no more stars are active
        if (this.stars.countActive(true) === 0)
        {
            // Re-enable all the stars
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    }

    /**
     * The player is hit by a bomb
     */
    hitBomb(){
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.gameOver = true;
    }

    preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create(){
        // Add the sky background
        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        // Put the platforms into a group of static physics aobjects
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(0, 536, 'ground')
            .setOrigin(0, 0)
            .setScale(2)
            .refreshBody();

        this.platforms.create(400, 384, 'ground').setOrigin(0, 0).refreshBody();
        this.platforms.create(-150, 234, 'ground').setOrigin(0, 0).refreshBody();
        this.platforms.create(550, 204, 'ground').setOrigin(0, 0).refreshBody();

        // Add the player's sprite to its physics object along with colliders
        this.player = this.physics.add.sprite(84, 436, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // The player collides with the platforms
        this.physics.add.collider(this.player, this.platforms);

        // Add the stars to their physics group
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        // Make the stars bounce randomly
        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        // The starts collide with the platforms
        this.physics.add.collider(this.stars, this.platforms);

        // The player can pick up the stars
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Add the bombs
        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        // Set the player movement animation
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }

    update(){
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}