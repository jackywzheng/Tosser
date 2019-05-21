export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('LeaderBoard');
    }

    create() {
        this.leaderboardCreated = false;
        this.createBackground();

        // Main Menu
        this.titleButton = this.add.text(
            window.innerWidth * 0.5, window.innerHeight * 0.8, 'Main Menu', LEADERBOARD_FONT);
        this.titleButton.setFontSize(100);
        this.titleButton.setOrigin(0.5);
        this.titleButton.setInteractive();
        this.titleButton.on('pointerdown', () => {this.scene.start('Title')});
    }

    update() {
        if (this.leaderboardCreated === false) {
            this.add.text(
                window.innerWidth * 0.5, window.innerHeight * 0.1, "Leaderboard", LEADERBOARD_FONT
            ).setOrigin(0.5
            ).setFontSize(100);
            let y = window.innerHeight * 0.15;
            let counter = 0;
            for (let i = 0; i < playerList.length; i++) {
                counter++;
                y += 100;
                this.add.text(window.innerWidth * 0.20, y, playerList[i][0], LEADERBOARD_FONT);
                this.add.text(window.innerWidth * 0.70, y, playerList[i][1], LEADERBOARD_FONT);
                if (counter === 8) {
                    break
                }
            }
            this.leaderboardCreated = true;
        }
    }

    createBackground() {
        let background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background_blur');
        background.displayHeight = window.innerHeight;
        background.displayWidth = window.innerWidth;
    }
}

