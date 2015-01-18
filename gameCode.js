    window.onload = function() {
  //    var cursors, fireButton, bombButton;

      var reimu, reimuBullets, reimu_hp = 99;
      var lastDirection = [0,-1];
      var reimuLastFired = 0;

      var marisa, marisa_hp = 99;

      var gameTextR, gameTextM;

      var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
      });

      function preload() {

        //            game.load.image('logo', 'phaser.png');
        game.load.image('reimu', 'img/reimu.png');
        game.load.image('yinyang', 'img/yinyang.png?foo');
        game.load.image('reimu-bullet', 'img/reimu-bullet.png');
        game.load.image('marisa', 'img/marisa.png');
        game.load.image('grass', 'img/grass.jpg?');
      }

      function update() {
        if (reimu !== null) {
          reimu.body.velocity.x = 0;
          reimu.body.velocity.y = 0;

          var movespeed = 250;

          if (cursors.left.isDown) {
            reimu.body.velocity.x = -movespeed;
            lastDirection = [-1,0];
          }
          else if (cursors.right.isDown) {
            reimu.body.velocity.x = movespeed;
            lastDirection = [1,0];
          }

          // separate cause diagonals are allowed
          if (cursors.up.isDown) {
            reimu.body.velocity.y = -movespeed;
            lastDirection = [0,-1];
          } else if (cursors.down.isDown) {
            reimu.body.velocity.y = movespeed;
            lastDirection = [0, 1];
          }

          if (fireButton.isDown && (reimuLastFired + 300 < game.time.now)) {

            var bullet = reimuBullets.getFirstExists(false);
            if (bullet) {
                bullet.reset(reimu.x + lastDirection[1]*15, 
                  reimu.y + lastDirection[0] * 15);
                bullet.body.velocity.x = lastDirection[0] * movespeed * 1.5;
                bullet.body.velocity.y = lastDirection[1] * movespeed * 1.5;
            }
            bullet = reimuBullets.getFirstExists(false);
            if (bullet) {
                bullet.reset(reimu.x - lastDirection[1]*15, 
                  reimu.y - lastDirection[0] * 15);
                bullet.body.velocity.x = lastDirection[0] * movespeed * 1.5;
                bullet.body.velocity.y = lastDirection[1] * movespeed * 1.5;
            }

            reimuLastFired = game.time.now;

          }

        }

        game.physics.arcade.overlap(marisa,reimuBullets, enemyGotHit, null, this);

//        console.log('test');
      }

      function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  The background
        starfield = game.add.tileSprite(0, 0, 800, 600, 'grass');

        // init the player
        reimu = game.add.sprite(game.world.centerX, game.world.centerY, 'reimu');
        reimu.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(reimu);

        // init player bullets
        reimuBullets = game.add.group();
        reimuBullets.enableBody = true;
        reimuBullets.physicsBodyType = Phaser.Physics.ARCADE;
        reimuBullets.createMultiple(30, 'reimu-bullet');
        reimuBullets.setAll('anchor.x', 0.5);
        reimuBullets.setAll('anchor.y', 1);
        reimuBullets.setAll('outOfBoundsKill', true);
        reimuBullets.setAll('checkWorldBounds', true);

        // punching bag
        marisa = game.add.sprite(600, 500, 'marisa');
        marisa.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(marisa);

        // handle inputs
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);

        gameTextR = game.add.text(10, 25, reimu_hp.toString(), { font: '36px Arial', fill: '#fff' });
        gameTextM = game.add.text(game.world.width - 100, 25, marisa_hp.toString(), { font: '36px Arial', fill: '#fff' });

        updateHP();
      }

      function updateHP() {
        gameTextR.setText(reimu_hp.toString());
        gameTextM.setText(marisa_hp.toString());

      }

      function enemyGotHit(marisa, bullet) {
        if (marisa_hp <= 0) return;

        if (--marisa_hp === 0) {
          marisa.kill();
        }
        bullet.kill();


        updateHP();
      }

};

