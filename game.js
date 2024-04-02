window.onload = function () {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    var moveplayer = true;
    var nbmove = 5;
    var movingDroite = false;
    var movingGauche = false;

    let player = {
        x: 50,
        y: 50,
        width: 30,
        height: 60,
        velocityY: 0,
        gravity: 0.5,
        isJumping: false,
        jumpForce: -15,
        timeoutJump: {},
        move: true,
        gravity: true
    };

    let platforms = [
        { x: 150, y: 550, width: 300, height: 20 },
        { x: 400, y: 300, width: 300, height: 20 }
    ];

    function drawPlayer() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawPlatforms() {
        ctx.fillStyle = 'green';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    function updatePlayer() {
        // Appliquer la gravité
        if (player.gravity) {
            player.velocityY += player.gravity;
            player.y += player.velocityY;
        }


        // Si le joueur touche le sol, réinitialiser la vélocité
        if (player.y + player.height >= canvasHeight) {
            player.velocityY = 0;
            player.y = canvasHeight - player.height;
        }

        // Vérifier les collisions avec les plateformes
        platforms.forEach(platform => {
            // Vérifier si le joueur touche le dessus de la plateforme
            if (player.y + player.height <= platform.y + platform.height &&
                player.y + player.height >= platform.y &&
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x) {
                player.velocityY = 0;
                player.y = platform.y - player.height;
                clearJump();
            } else if (player.y <= platform.y + platform.height &&
                player.y > platform.y &&
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x) {
                // Vérifier si le joueur touche le bas de la plateforme
                player.velocityY = 0;
                player.y = platform.y + platform.height;
            } else if (player.y + player.height > platform.y &&
                player.y < platform.y &&
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x) {
                // Vérifier si le joueur tombe sur la plateforme depuis le haut
                player.velocityY = 0;
                player.y = platform.y - player.height;
            } else {
                // Vérifier si le joueur touche le côté gauche de la plateforme
                if (player.x + player.width >= platform.x &&
                    player.x < platform.x &&
                    player.y < platform.y + platform.height &&
                    player.y + player.height > platform.y) {
                    player.x = platform.x - player.width;
                }

                // Vérifier si le joueur touche le côté droit de la plateforme
                if (player.x <= platform.x + platform.width &&
                    player.x > platform.x &&
                    player.y < platform.y + platform.height &&
                    player.y + player.height > platform.y) {
                    player.x = platform.x + platform.width;
                }
            }
        });



        // Si le joueur sort du canvas, activer la fonction de mort
        if (player.y > canvasHeight || player.y + player.height < 0) {
            mort();
        }

        if (movingDroite) {
            player.x += nbmove
        }
        if (movingGauche) {
            player.x -= nbmove
        }
    }

    function clearJump() {
        player.isJumping = false;
        clearTimeout(player.timeoutJump)
    }

    function mort() {
        console.log("Le joueur est mort !");
        // Ici la gestionde la mort
    }

    function jump() {
        if (!player.isJumping) {
            player.isJumping = true;
            player.velocityY = player.jumpForce;
            player.timeoutJump = setTimeout(() => {
                player.isJumping = false;
            }, 200); // Limitez la durée du saut (500 millisecondes)
        }
    }

    var nbDash = 100; // La distance que le joueur va parcourir lors du dash
    var dashDuration = 500; // Durée du dash en millisecondes
    var dashSpeed = nbDash / dashDuration; // Vitesse du dash

    function dash() {
        if (!player.isDashing) {
            player.isDashing = true;
            player.move = false;
            player.gravity = false
            var initialX = player.x;
            var targetX = false === movingDroite ? player.x - nbDash : player.x + nbDash;

            var startTime = performance.now();

            function dashStep(timestamp) {
                var elapsedTime = timestamp - startTime;
                var progress = Math.min(elapsedTime / dashDuration, 1); // Progression du dash (de 0 à 1)
                var newX = initialX + progress * (targetX - initialX); // Calcul de la nouvelle position

                player.x = newX;
                console.log(progress)

                if (progress < 1) {
                    requestAnimationFrame(function (timestamp) {
                        dashStep(timestamp);
                    });// Continuer le dash jusqu'à ce que la progression atteigne 1
                } else {
                    player.isDashing = false; // Fin du dash
                    player.move = true;
                    player.gravity = true;

                }
            }

            requestAnimationFrame(function (timestamp) {
                dashStep(timestamp);
            });
        }
    }


    function update() {
        updatePlayer();
    }

    function render() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawPlayer();
        drawPlatforms();
    }

    function gameLoop() {
        update();
        render();
        console.log(player.isJumping)
        requestAnimationFrame(gameLoop);
    }

    gameLoop();



    document.addEventListener("keydown", (e) => {
        console.log(e.key)
        if (player.move) { // Variable qui dit oui ou non l'utilisateur peut bouger.
            switch (e.key) {
                case "z":
                case " ":
                    jump(); // Jump
                    break;
                case "s":
                    // Action pour descendre
                    break;
                case "q":
                    movingGauche = true;
                    break;
                case "d":
                    movingDroite = true;
                    break;
                case "Shift":
                    dash() // dasho
                    break;
            }
        }
    });

    //Lorsque on lache la touche
    document.addEventListener("keyup", (e) => {
        if (player.move) {
            switch (e.key) {
                case "q":
                    movingGauche = false;
                    break;
                case "d":
                    movingDroite = false;
                    break;
            }
        }
    });

}

