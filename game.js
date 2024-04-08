class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.width = width;
    this.height = height;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.isJumping = false;
    this.jumpForce = -15;
    this.timeoutJump = {};
    this.move = true;
    this.gravityEnabled = true;
    this.isDashing = false;
    this.nbmove = 5;
    this.movingDroite = false;
    this.movingGauche = false;
    this.dashDirection = null;
    this.morto = true;
  }

  /**
   * Dessine le joueur sur le canvas.
   * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu du canvas.
   */
  draw(ctx, cameraX, cameraY) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
  }

  /**
   * Permet de réinitialiser l'état de saut du joueur.
   */
  clearJump() {
    this.isJumping = false;
    clearTimeout(this.timeoutJump);
  }

  reset() {
    this.x = this.startX
    this.y = this.startY
  }

  /**
   * Effectue les actions nécessaires lorsque le joueur meurt.
   */
  mort() {

    if (!this.morto) {
      console.log("Le joueur est mort !");
      this.morto = true;
      window.location.reload();
    }

  }

  /**
   * Permet au joueur d'effectuer un saut.
   */
  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY = this.jumpForce;
      this.timeoutJump = setTimeout(() => {
        this.isJumping = false;
      }, 200); // Limitez la durée du saut
    }
  }

  dash() {
    let nbDash = 100; // La distance que le joueur va parcourir lors du dash
    let dashDuration = 250; // Durée du dash en millisecondes
    let dashSpeed = nbDash / dashDuration; // Vitesse du dash
    let player = this;
    if (!player.isDashing) {
      player.isDashing = true;
      player.move = false;
      player.gravity = false;
      var initialX = player.x;
      var targetX =
        false === this.movingDroite ? player.x - nbDash : player.x + nbDash;

      this.dashDirection = this.movingDroite ? "right" : "left";

      var startTime = performance.now();

      const dashStep = (timestamp) => {
        var elapsedTime = timestamp - startTime;
        var progress = Math.min(elapsedTime / dashDuration, 1); // Progression du dash (de 0 à 1)
        var newX = initialX + progress * (targetX - initialX); // Calcul de la nouvelle position

        player.x = newX;
        console.log(progress);

        if (progress < 1) {
          player.movingDroite = false;
          player.movingGauche = false;
          requestAnimationFrame((timestamp) => {
            dashStep(timestamp);
          }); // Continuer le dash jusqu'à ce que la progression atteigne 1
        } else {
          player.isDashing = false; // Fin du dash
          player.move = true;
          player.gravity = true;
        }
      };
      requestAnimationFrame((timestamp) => {
        dashStep(timestamp);
      });
    }
  }
}

class Cube {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.width = width;
    this.height = height;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.gravityDirection = "down";
  }

  draw(ctx, cameraX, cameraY) {
    // Dessiner le cube sur le canvas
    ctx.fillStyle = "red"; // Couleur de remplissage
    ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
  }

  reset() {
    this.x = this.startX
    this.y = this.startY
  }

}


class Door {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx, cameraX, cameraY) {
    // Dessiner sur le canvas
    ctx.fillStyle = "aqua"; // Couleur de remplissage
    ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
  }
}


class Platform {
  /**
   * Crée une instance de plateforme.
   * @param {number} x - La position horizontale de la plateforme.
   * @param {number} y - La position verticale de la plateforme.
   * @param {number} width - La largeur de la plateforme.
   * @param {number} height - La hauteur de la plateforme.
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Dessine la plateforme sur le canvas.
   * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu du canvas.
   */
  draw(ctx, cameraX, cameraY) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
  }
}

/**
 * Représente le jeu.
 */
class Game {
  /**
   * Crée une instance de jeu.
   */
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Définir la taille de la zone de vue (viewport)
    this.viewportWidth = this.canvas.width;
    this.viewportHeight = this.canvas.height;

    // Définir la taille de la carte (map)
    this.mapWidth = 1200; // Largeur de la carte
    this.mapHeight = 600; // Hauteur de la carte


    this.player = new Player(50, 50, 30, 60); // Création d'une isntance de Player
    this.cube = new Cube(90, 50, 40, 40); // Création d'une instance de Cube

    // Initialiser la position de la caméra (centrée sur le joueur)
    this.cameraX = this.player.x - this.viewportWidth / 2;
    this.cameraY = this.player.y - this.viewportHeight / 2;

    this.levels = [
      {
        platforms: [
          { x: 100, y: 200, width: 150, height: 20 }, // Plateforme 1
          { x: 300, y: 300, width: 200, height: 20 }, // Plateforme 2
        ],
        door: { x: this.mapWidth - 50, y: this.mapHeight - 150, width: 50, height: 150 }
      },
      {
        platforms: [
          { x: 50, y: 150, width: 100, height: 20 }, // Plateforme 1
          { x: 200, y: 250, width: 150, height: 20 }, // Plateforme 2
        ]
      },
    ];

    this.level = 1
    this.loadLevel(this.level)


    this.touchStartX = 0;
    this.touchEndX = 0;

    this.bindEvents();
    this.gameLoop();
  }

  loadLevel(levelNumber) {
    const lvlI = levelNumber - 1;
    const level = this.levels[lvlI];

    this.platforms = level.platforms.map(platformData => new Platform(platformData.x, platformData.y, platformData.width, platformData.height));
    this.platforms.push(new Platform(0, this.mapHeight - 20, this.mapWidth, 20));
    console.log("LoadLvl", this.platforms)
    if (level.door) {
      this.door = new Door(level.door.x, level.door.y, level.door.width, level.door.height); //Ajouter la porte
    } else {
      console.warn("PAS DE PORTE DE PROCHAIN NIVEAU")
    }

    //Si c'est pas le niveau 1 reset la position du cube et du joueurs :
    if (levelNumber != 1) {
      this.player.reset();
      this.cube.reset();
    }

  }

  draw() {
    this.ctx.clearRect(0, 0, this.viewportWidth, this.viewportHeight);

    // Dessiner les éléments de la carte en fonction de la position de la caméra
    this.player.draw(this.ctx, this.cameraX, this.cameraY);
    this.cube.draw(this.ctx, this.cameraX, this.cameraY);
    this.door.draw(this.ctx, this.cameraX, this.cameraY);

    // Dessiner les plateformes
    this.platforms.forEach((platform) => {
      platform.draw(this.ctx, this.cameraX, this.cameraY);
    });
  }

  /**
   * Met à jour le joueur dans le jeu.
   */
  updatePlayer() {
    // Votre logique de mise à jour du joueur ici
    let player = this.player;
    // Appliquer la gravité
    if (player.gravity) {
      player.velocityY += player.gravity;
      player.y += player.velocityY;
    }

    // Si le joueur touche le sol, réinitialiser la vélocité
    if (player.y + player.height >= this.canvasHeight) {
      player.velocityY = 0;
      player.y = this.canvasHeight - player.height;
    }

    // Si le joueur sort du canvas, activer la fonction de mort
    if (player.y > this.viewportHeight || player.y + player.height < 0) {
      this.player.mort();
    }

    if (player.movingDroite) {
      player.x += player.nbmove;
    }
    if (player.movingGauche) {
      player.x -= player.nbmove;
    }

    //Platform
    this.checkCol(this.platforms, player);
    this.checkCol(this.platforms, this.cube);
  }

  checkCol(what, objet) {
    what.forEach((platform) => {
      if (
        // Collision depuis le dessous
        objet.y + objet.height >= platform.y &&
        objet.y + objet.height <= platform.y + platform.height &&
        objet.x < platform.x + platform.width &&
        objet.x + objet.width > platform.x
      ) {
        // Réaction à la collision depuis le dessous
        objet.velocityY = 0;
        objet.y = platform.y - objet.height;
        if (objet === this.player) {
          objet.clearJump();
        }
      } else if (
        // Collision depuis le dessus
        objet.y <= platform.y + platform.height &&
        objet.y > platform.y &&
        objet.x < platform.x + platform.width &&
        objet.x + objet.width > platform.x
      ) {
        // Réaction à la collision depuis le dessus
        objet.velocityY = 0;
        objet.y = platform.y + platform.height;
      } else {
        // Collision avec les côtés
        if (
          objet.x + objet.width >= platform.x &&
          objet.x + objet.width <= platform.x + platform.width &&
          objet.y + objet.height > platform.y &&
          objet.y < platform.y + platform.height
        ) {
          // Réaction à la collision avec le côté gauche de la plateforme
          objet.x = platform.x - objet.width;
        }
        if (
          objet.x <= platform.x + platform.width &&
          objet.x >= platform.x &&
          objet.y + objet.height > platform.y &&
          objet.y < platform.y + platform.height
        ) {
          // Réaction à la collision avec le côté droit de la plateforme
          objet.x = platform.x + platform.width;
        }
      }
    });
  }

  updateCube() {
    if (this.cube.gravityDirection == "down") {
      this.cube.velocityY += this.cube.gravity;
      this.cube.y += this.cube.velocityY;

      if (this.cube.y + this.cube.height >= this.canvasHeight) {
        this.cube.velocityY = 0;
        this.cube.y = this.canvasHeight - this.cube.height;
      }
    } else if (this.cube.gravityDirection === "up") {
      // Appliquer la gravité vers le haut
      this.cube.velocityY += this.cube.gravity;
      this.cube.y -= this.cube.velocityY;
      this.cube.velocityY = this.cube.velocityY / 1.1;
    }
  }

  checkCollisionBetweenPlayerAndCube() {
    let objet = this.player;
    let platform = this.cube;
    if (
      // Collision depuis le dessous
      objet.y + objet.height >= platform.y &&
      objet.y + objet.height <= platform.y + platform.height &&
      objet.x < platform.x + platform.width &&
      objet.x + objet.width > platform.x
    ) {
      // Réaction à la collision depuis le dessous
      objet.velocityY = 0;
      objet.y = platform.y - objet.height;
      if (objet === this.player) {
        objet.clearJump();
      }
    } else if (
      // Collision depuis le dessus
      objet.y <= platform.y + platform.height &&
      objet.y > platform.y &&
      objet.x < platform.x + platform.width &&
      objet.x + objet.width > platform.x
    ) {
      // Réaction à la collision depuis le dessus
      objet.velocityY = 0;
      objet.y = platform.y + platform.height;
    } else {
      // Collision avec les côtés
      if (
        objet.x + objet.width >= platform.x &&
        objet.x + objet.width <= platform.x + platform.width &&
        objet.y + objet.height > platform.y &&
        objet.y < platform.y + platform.height
      ) {
        // Réaction à la collision avec le côté gauche de la plateforme
        objet.x = platform.x - objet.width - this.player.nbmove;
      }
      if (
        objet.x <= platform.x + platform.width &&
        objet.x >= platform.x &&
        objet.y + objet.height > platform.y &&
        objet.y < platform.y + platform.height
      ) {
        // Réaction à la collision avec le côté droit de la plateforme
        objet.x = platform.x + platform.width + this.player.nbmove;
      }
    }

    // Function de balade droite/gauche
    if (
      // Vérifie si le personnage est sur le cube
      this.player.y + this.player.height >= this.cube.y &&
      this.player.y < this.cube.y + this.cube.height &&
      this.player.x < this.cube.x + this.cube.width &&
      this.player.x + this.player.width > this.cube.x
    ) {

      // Vérifie si le personnage est sur le côté droit du cube
      if (this.player.x > this.cube.x + this.cube.width / 3) {
        let nbmove = 2;
        this.player.x += nbmove;
        this.cube.x += nbmove;
      }

      // Vérifie si le personnage est sur le côté Gauche du cube
      if (this.player.x < this.cube.x - this.cube.width / 3) {
        let nbmove = 2;
        this.player.x -= nbmove;
        this.cube.x -= nbmove;

      }

    }
  }

  updateCam() {
    // Mettre à jour la position de la caméra pour suivre le joueur
    this.cameraX = this.player.x - this.viewportWidth / 2;
    this.cameraY = this.player.y - this.viewportHeight / 2;

    // Limiter la caméra pour qu'elle ne sorte pas des limites de la carte
    this.cameraX = Math.max(0, Math.min(this.mapWidth - this.viewportWidth, this.cameraX));
    this.cameraY = Math.max(0, Math.min(this.mapHeight - this.viewportHeight, this.cameraY));

    // Ajuster la position de la caméra si le joueur est près des bords de la carte
    if (this.player.x < this.viewportWidth / 2) {
      this.cameraX = 0;
    } else if (this.player.x > this.mapWidth - this.viewportWidth / 2) {
      this.cameraX = this.mapWidth - this.viewportWidth;
    }

    if (this.player.y < this.viewportHeight / 2) {
      this.cameraY = 0;
    } else if (this.player.y > this.mapHeight - this.viewportHeight / 2) {
      this.cameraY = this.mapHeight - this.viewportHeight;
    }
  }

  winDoor() {

    //Détection si cube touchée porte
    if (!this.hasCubeTouchedDoor && this.cube.x < this.door.x + this.door.width &&
      this.cube.x + this.cube.width > this.door.x &&
      this.cube.y < this.door.y + this.door.height &&
      this.cube.y + this.cube.height > this.door.y) {

      this.hasCubeTouchedDoor = true;
      this.cube.x = -50;
    }

    //Collsiion joeurs porte
    if (this.player.x < this.door.x + this.door.width &&
      this.player.x + this.player.width > this.door.x &&
      this.player.y < this.door.y + this.door.height &&
      this.player.y + this.player.height > this.door.y) {
      if (this.hasCubeTouchedDoor) {
        this.hasCubeTouchedDoor = false;
        this.level += 1
        this.loadLevel(this.level)
      } else {
        // Traitement de collision simple
      }
    }
  }


  /**
   * Gère le mouvement du balayage sur l'écran tactile.
   */
  handleSwipe() {
    let swipeDistance = this.touchEndX - this.touchStartX;
    let minSwipeDistance = 50;
    if (swipeDistance > minSwipeDistance) {
      console.log("Balayage vers la droite détecté !");
      this.player.x = 250;
    }
  }

  /**
   * Boucle de jeu principale.
   */
  gameLoop() {
    this.updatePlayer();
    this.updateCube();
    this.checkCollisionBetweenPlayerAndCube();
    this.updateCam();
    this.winDoor()

    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Associe les événements aux gestionnaires d'événements appropriés.
   */
  bindEvents() {
    document.addEventListener("keydown", (e) => {
      console.log(this.cube.gravityDirection);

      if (this.player.move) {
        // Variable qui dit oui ou non l'utilisateur peut bouger.
        switch (e.key) {
          case "z":
          case " ":
            this.player.jump(); // Jump
            break;
          case "s":
            // Action pour descendre
            break;
          case "q":
            this.player.movingGauche = true;
            this.dashDirection = null; // Réinitialiser la direction du dash si la direction de déplacement change

            break;
          case "d":
            this.player.movingDroite = true;
            this.dashDirection = null; // Réinitialiser la direction du dash si la direction de déplacement change

            break;
          case "Shift":
            this.player.dash(); // dasho
            break;

          // Cube
          case "u":
            this.cube.gravityDirection = "up";
            break;
          case "j":
            this.cube.gravityDirection = "down";
            break;
        }
      }
    });

    //Lorsque on lache la touche
    document.addEventListener("keyup", (e) => {
      if (this.player.move) {
        switch (e.key) {
          case "q":
            this.player.movingGauche = false;
            break;
          case "d":
            this.player.movingDroite = false;
            break;
        }
      }
    });

    document.addEventListener("touchstart", (event) => {
      this.touchStartX = event.touches[0].clientX;
    });

    document.addEventListener("touchmove", (event) => {
      event.preventDefault();
    });

    document.addEventListener("touchend", (event) => {
      this.touchEndX = event.changedTouches[0].clientX;
      this.handleSwipe();
    });
  }
}

// Démarrer le jeu lorsque la fenêtre est chargée
window.onload = function () {
  let game = new Game();


  document.addEventListener('mousemove', function (event) {
    const rect = game.canvas.getBoundingClientRect(); // Obtenez les coordonnées du rectangle de votre canvas
    const mouseX = event.clientX - rect.left; // Coordonnée X de la souris par rapport à votre canvas
    const mouseY = event.clientY - rect.top; // Coordonnée Y de la souris par rapport à votre canvas

    // Ajustez les coordonnées de la souris en fonction de la position de la caméra
    console.log(game.cameraX)
    const adjustedMouseX = mouseX + game.cameraX;
    const adjustedMouseY = mouseY + game.cameraY;

    // Affichez les coordonnées de la souris ajustées
    document.getElementById("mousePosition").textContent = `Position de la souris : X = ${adjustedMouseX}, Y = ${adjustedMouseY}`;
});

};
