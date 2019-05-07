// version 0.2.0


let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true,
        },
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/img/study_area.png');
    this.load.image('bin_top', 'assets/img/bin_top.png');
    this.load.image('paper', 'assets/img/paper.png');
    this.load.image('banana', 'assets/img/banana-sprite.png');
    this.load.image('waterbottle', 'assets/img/water_bottle.png');

}


function create() {
    createBackground(this);

    this.queue = ['paper', 'banana', 'waterbottle'];

    // for (let i = 0; i < this.queue.length; i++) {
    //     this.hero = createProjectile(this, this.queue[i])
    // }

    // this.queue = [createProjectile(this, 'paper'), createProjectile(this, 'banana'),
    //     createProjectile(this, 'waterbottle')];


    this.hero = createProjectile(this, this.queue[Math.floor(Math.random() * 3)]);
    this.hero.visible = true;
    this.hero.setInteractive();
    this.hero.on('pointerdown', pointerDownHandler, this);
    createPhysicsObjects(this);


    // for (let i = 0; i < len(this.queue); i++){
    //     createPhysicsObjects(this, this.queue[i]);
    //
    // }

    // this.hero.debugShowBody = false;

    // function that does something when an object collides with the bounds
    // this.physics.world.on('worldbounds', function () {
    //     // console.log('You hit the bounds!');
    // });
    // let line = new Phaser.Geom.Line();
    // let gfx = this.add.graphics().setDefaultStyles({lineStyle: {width: 10, color: 0xffdd00, alpha: 0.5}});
}

function update() {
    if (this.hero.body.velocity.y > 0 && this.floorCollider.active === false) {
        this.floorCollider.active = true;
        console.log('inside' + this.hero.body.velocity.y)

        // console.log(this.hero)
    }

    // console.log(this.floorCollider.active);
    // console.log(this.hero.body.velocity.y)
}

function pointerDownHandler () {
        this.input.on('pointerup', pointerUpHandler, this);
}

function pointerUpHandler (pointer) {
    let velocityX = pointer.upX - pointer.downX;
    let velocityY = pointer.upY - pointer.downY;
    let velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
    velocity.scale(1000);
    this.hero.state = 'flying';
    this.hero.disableInteractive();
    this.hero.body.setVelocity(velocity.x * 0.2, velocity.y * 2.0);
    this.hero.body.setAngularVelocity(500);
    this.hero.body.setAccelerationY((velocity.y * -1) * 1.2);
    addProjectileScalingTween(this, this.hero);
    // gfx.clear().strokeLineShape(line);
    this.input.off('pointerup');
}

function createBackground (game) {
    let background = game.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerWidth;
}

// function createHeroProjectile (game, image) {
//     let hero = game.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.9, image);
//     hero.setInteractive();
//     hero.state = 'resting';
//     hero.displayHeight = 150;
//     hero.displayWidth = 150;
//     hero.setBounce(0.3);
//     hero.body.onWorldBounds = true;
//     hero.body.setCollideWorldBounds(true);
//     return hero;
// }

function createProjectile (game, image) {
    let hero = game.physics.add.image(window.innerWidth / 2, window.innerHeight * 0.9, image);

    hero.state = 'resting';
    hero.displayHeight = 150;
    hero.displayWidth = 150;
    hero.setBounce(0.3);
    hero.body.onWorldBounds = true;
    hero.body.setCollideWorldBounds(true);
    hero.visible = false;
    return hero;
}

// function addPhysicsObject(projectile) {
//
// }

function createPhysicsObjects (game) { // should be called only once
    let binOne = game.add.rectangle(window.innerWidth * 0.295, window.innerHeight * 0.430, 170, 1);
    let binTwo = game.add.rectangle(window.innerWidth * 0.640, window.innerHeight * 0.430, 170, 1);
    let floor = game.add.rectangle(window.innerWidth / 2, window.innerHeight * 0.559, window.innerWidth, 1);

    game.physics.add.existing(binOne, true);
    game.physics.add.existing(binTwo, true);
    game.physics.add.existing(floor, true);

    // Add physical interactions
    game.physics.add.overlap(game.hero, binOne, hitTarget, null, game);
    game.physics.add.overlap(game.hero, binTwo, hitTarget, null, game);
    game.floorCollider = game.physics.add.collider(game.hero, floor, missedTarget, null, game);
    game.floorCollider.active = false;
}

function hitTarget (projectile) {
    if (projectile.body.velocity.y > 0) {
        projectile.disableBody(false, true);
        resetProjectile(projectile);
        this.floorCollider.active = false;
    }
}

function missedTarget (projectile) {
    setProjectileDrag(projectile);
    if (projectile.body.angularVelocity === 0) {
        projectile.disableBody(false, false);
        resetProjectile(projectile);
        this.floorCollider.active = false;
    }
}

function spawnProjectile (projectile) {
    let scene = projectile.scene;

    // scene.hero = scene.queue[Math.floor(Math.random() * 3)];
    scene.hero = createProjectile(scene, scene.queue[Math.floor(Math.random() * 3)]);

    // projectile.enableBody(true, window.innerWidth / 2, window.innerHeight * 0.9, true, true);
    scene.hero.visible = true;
    scene.hero.setInteractive();
    scene.hero.on('pointerdown', pointerDownHandler, scene);

    createPhysicsObjects(scene)
}
function resetProjectile (projectile) {
    projectile.body.stop();
    console.log(projectile);
    projectile.scene.tweens.killTweensOf(projectile);
    // projectile.disableBody(false, true);
    // projectile.enableBody(true, window.innerWidth / 2, window.innerHeight * 0.9, true, true); // resets projectile position

    spawnProjectile(projectile);

    // let floor = scene.add.rectangle(window.innerWidth / 2, window.innerHeight * 0.559, window.innerWidth, 1);
    // scene.floorCollider = scene.physics.add.collider(scene.hero, floor, missedTarget, null, scene);
    // scene.floorCollider.active = true;

    // createPhysicsObjects(scene);


    // projectile.destroy();
    //
    // scene.hero = createHeroProjectile(scene, scene.queue[Math.floor(Math.random() * 3)]);
    // scene.hero.on('pointerdown', pointerDownHandler, scene);
    // createPhysicsObjects(scene);
}

function setProjectileDrag (projectile) {
    projectile.body.setAllowDrag(true);
    projectile.body.setDrag(20, 0);
    projectile.body.setAngularDrag(180);
}

function addProjectileScalingTween (game, projectile) {
    game.tweens.add({
        targets: projectile,
        displayWidth: 30,
        displayHeight: 30,
        ease: 'Linear',
        duration: 2500,
        repeat: 0,
        yoyo: false
    });
}

function turnLightsOff(game) {
    let lightsOff = game.add.rectangle(window.innerWidth / 2, window.innerHeight /2,
        window.innerWidth, window.innerHeight);
    lightsOff.setFillStyle(0x202030, 100);
    lightsOff.setBlendMode('MULTIPLY');
}

