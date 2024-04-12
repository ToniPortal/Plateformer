class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.gravityEnabled = true;
  }

  draw(ctx, cameraX, cameraY, color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x - cameraX, this.y - cameraY, this.width, this.height);
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
  }
}

class Player extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.startX = x;
    this.startY = y;
    this.isJumping = false;
    this.jumpForce = -10;
    this.move = true;
    this.isDashing = false;
    this.nbmove = 5;
    this.movingDroite = false;
    this.movingGauche = false;
    this.dashDirection = null;
    this.morto = true;
    this.isCarryingCube = false;
    this.timeoutJump = null;
  }

  clearJump() {
    this.isJumping = false;
    clearTimeout(this.timeoutJump);
  }

  reset() {
    super.reset();
    this.isCarryingCube = false;
  }

  mort() {
    if (!this.morto) {
      console.log("Le joueur est mort !");
      this.morto = true;
      window.location.reload();
    }
  }

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

    if (!this.isDashing) {
      this.isDashing = true;
      this.move = false;
      this.gravityEnabled = false;

      var initialX = this.x;
      var targetX = this.movingDroite ? this.x + nbDash : this.x - nbDash;
      var startTime = performance.now();

      const dashStep = (timestamp) => {
        var elapsedTime = timestamp - startTime;
        var progress = Math.min(elapsedTime / dashDuration, 1); // Progression du dash (de 0 à 1)
        var newX = initialX + progress * (targetX - initialX); // Calcul de la nouvelle position

        this.x = newX;

        if (progress < 1) {
          requestAnimationFrame(dashStep); // Continuer le dash jusqu'à ce que la progression atteigne 1
        } else {
          this.isDashing = false; // Fin du dash
          this.move = true;
          this.gravityEnabled = true;
        }
      };
      requestAnimationFrame(dashStep);
    }
  }
}

class Cube extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.startX = x;
    this.startY = y;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.gravityDirection = "down";
    this.gravityEnabled = true;
  }

  reset() {
    super.reset();
    //this.player.isCarryingCube = false;
    this.gravityEnabled = true;
    this.gravityDirection = "down";
  }
}

class Door extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}

class Platform extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}

class Button extends Entity {
  constructor(x, y, width, height) {
    super(x, y, width, height);
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
    this.mapHeight = 1000; // Hauteur de la carte


    this.player = new Player(50, 500, 30, 60); // Création d'une isntance de Player
    this.cube = new Cube(90, 500, 40, 40); // Création d'une instance de Cube

    // Initialiser la position de la caméra (centrée sur le joueur)
    this.cameraX = this.player.x - this.viewportWidth / 2;
    this.cameraY = this.player.y - this.viewportHeight / 2;

    this.levels = [
      {
        platforms: [
          { x: 300, y: 960, width: 200, height: 20 }, // Plateforme 

        ],
        door: { x: this.mapWidth - 50, y: this.mapHeight - 150, width: 50, height: 150 }
      },
      {
        platforms: [
          { x: 160, y: 763, width: 72, height: 231 },
          { x: 286, y: 665, width: 64, height: 335 },
          { x: 433, y: 664, width: 104, height: 316 },
          { x: 615, y: 607, width: 88, height: 385 },
          { x: 238, y: 446, width: 356, height: 78 },
          { x: 172, y: 379, width: 70, height: 145 },
          { x: 4, y: 290, width: 66, height: 94 },
          { x: 185, y: 204, width: 61, height: 66 },
          { x: 344, y: 203, width: 51, height: 58 },
          { x: 474, y: 202, width: 800, height: 66 }
        ],
        door: { x: 1092, y: 78, width: 108, height: 124 }

      },
      {
        platforms: [
          { x: 0, y: 960, width: 200, height: 40 }, // Plateforme Baso
          { x: 245, y: 405, width: 226, height: 40 },
          { x: 499, y: 602, width: 199, height: 40 },
          { x: 750, y: 287, width: 250, height: 40 },
          { x: 992, y: 601, width: 300, height: 40 }

        ],
        door: { x: 1100, y: 490, width: 100, height: 150 }

      },
      {
        platforms: [
          { x: 0, y: 960, width: 200, height: 40 }, // Plateforme Baso

          // La montée
          { x: 160, y: 763, width: 72, height: 335 },
          { x: 286, y: 665, width: 64, height: 335 },
          { x: 433, y: 664, width: 104, height: 335 },
          { x: 615, y: 607, width: 88, height: 400 },

          { x: 8, y: 314, width: 158, height: 40 } //Plateforme Btn

        ],
        door: { x: 1100, y: 490, width: 100, height: 150 },
        buttons: [
          { x: 38, y: 333, width: 97, height: 57 }
        ]

      },
    ];

    this.level = 2;
    this.loadLevel(this.level)


    this.touchStartX = 0;
    this.touchEndX = 0;


    this.boundHandleMouseClick = this.handleMouseClick.bind(this); // Pour l'éditeur de niveau
    this.editor = 1;
    this.editorAll = {};

    this.keyState = {}

    this.bindEvents();
    this.gameLoop();
  }

  loadLevel(lvlN) { // LevelNumber
    const lvlI = lvlN - 1;
    const level = this.levels[lvlI];


    // Getsion Plateforme
    this.platforms = level.platforms.map(platD => new Platform(platD.x, platD.y, platD.width, platD.height));

    let nAV = [1, 2]; // Niveau a mettre plateforme en bas
    if (nAV.includes(lvlN)) {
      this.platforms.push(new Platform(0, this.mapHeight - 20, this.mapWidth, 20));
    }
    console.log("This.LoadPlat -> ", this.platforms)


    // Load de porte
    if (level.door) {
      this.door = new Door(level.door.x, level.door.y, level.door.width, level.door.height); //Ajouter la porte
    } else {
      console.warn("PAS DE PORTE DE PROCHAIN NIVEAU")
    }

    // Load button
    if (level.buttons) {
      this.buttons = level.buttons.map(btnD => new Button(btnD.x, btnD.y, btnD.width, btnD.height));
    }

    //Si c'est pas le niveau 1 reset la position du cube et du joueurs :
    if (lvlN != 1) {
      this.player.reset();
      this.cube.reset();
    }


  }

  draw() {
    this.ctx.clearRect(0, 0, this.viewportWidth, this.viewportHeight);

    // Dessiner les éléments de la carte en fonction de la position de la caméra
    this.player.draw(this.ctx, this.cameraX, this.cameraY, "blue");
    this.cube.draw(this.ctx, this.cameraX, this.cameraY, "red");
    this.door.draw(this.ctx, this.cameraX, this.cameraY, "aqua");

    // Dessiner les plateformes
    this.platforms.forEach((plat) => {
      plat.draw(this.ctx, this.cameraX, this.cameraY, "green");
    });

    //Dessiner les btn
    if (this.level.buttons) {
      this.buttons.forEach((btn) => {
        btn.draw(this.ctx, this.cameraX, this.cameraY, "red");
      });
    }
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
    this.checkCol(this.platforms, this.player);
    this.checkCol(this.platforms, this.cube);

    //Button
    if (this.level.buttons) {
      this.checkCol(this.buttons, this.player);
      this.checkCol(this.buttons, this.cube);
    }



    //Porte le cube :
    if (this.keyState['KeyX'] && !this.player.isCarryingCube) {
      this.player.isCarryingCube = true; // Activer le fait de porter le cube
      this.cube.gravityEnabled = false
    } else if (this.keyState['KeyC'] && this.player.isCarryingCube) {
      this.player.isCarryingCube = false; // Activer le fait de porter le cube
      this.cube.gravityEnabled = true;
    }

    if (this.player.isCarryingCube) {
      this.cube.x = this.player.x + (this.player.width / 2) - (this.cube.width / 2); // Placer le cube au centre horizontal du joueur
      this.cube.y = this.player.y - this.cube.height; // Placer le cube juste au-dessus du joueur
    }

  }

  checkCol(what, objet) {
    what.forEach((platform, i) => {
      let playerBottom = objet.y + objet.height;
      let playerRight = objet.x + objet.width;
      let platformTop = platform.y;
      let platformBottom = platform.y + platform.height;
      let platformLeft = platform.x;
      let platformRight = platform.x + platform.width;

      // Collision sur le haut de la plateforme
      if (playerBottom >= platformTop &&
        objet.y < platformTop &&
        playerRight > platformLeft &&
        objet.x < platformRight &&
        objet.velocityY >= 0) {

        objet.velocityY = 0;
        objet.y = platformTop - objet.height;
        if (objet === this.player) {
          objet.clearJump();
        }

        if (this.level.buttons) {
          if (platform == this.buttons[i]) {
            platform.height /= 2;
            this.cube.gravityDirection = "down"
            objet.y += 200;
            this.cube.y += 200;
          }
        }


      }

      // Collision sur le bas de la plateforme
      if (
        (
          (this.cube.gravityDirection === "down" && objet.y <= platformBottom && objet.y > platformTop && objet.velocityY <= 0) ||
          (this.cube.gravityDirection === "up" && objet.y + objet.height >= platformTop && objet.y + objet.height < platformBottom && objet.velocityY >= 0)
        ) &&
        playerRight > platformLeft &&
        objet.x < platformRight
      ) {
        console.log("Bas ?");

        objet.velocityY = 0;
        objet.y = platformBottom;
        this.cube.gravityDirection = "down";

        if (this.level.buttons) {
          if (platform === this.buttons[i]) {
            objet.y -= 50;
            platform.height /= 2;
          }
        }
      }



      // Collision avec les côtés
      if (objet.x + objet.width >= platformLeft &&
        objet.x < platformLeft &&
        playerBottom > platformTop &&
        objet.y < platformBottom &&
        objet.x + objet.width - platformLeft < objet.y + objet.height - platformTop) {
        objet.x = platformLeft - objet.width - this.player.nbmove;
      }

      if (objet.x <= platformRight &&
        objet.x + objet.width > platformRight &&
        playerBottom > platformTop &&
        objet.y < platformBottom &&
        platformRight - objet.x < objet.y + objet.height - platformTop) {
        objet.x = platformRight + this.player.nbmove;
      }
    });
  }



  updateCube() {
    if (this.cube.gravityDirection == "down") {

      if (this.cube.gravityEnabled) {
        this.cube.velocityY += this.cube.gravity;
        this.cube.y += this.cube.velocityY;

        // if (this.cube.y + this.cube.height >= this.canvasHeight) {
        //   this.cube.velocityY = 0;
        //   this.cube.y = this.canvasHeight - this.cube.height;
        // }
      }

    } else if (this.cube.gravityDirection === "up") {
      // Appliquer la gravité vers le haut
      this.cube.velocityY -= this.cube.gravity * 0.3; // Réduire la gravité vers le haut
      this.cube.y += this.cube.velocityY;

      // Assurer que le cube ne s'échappe pas en haut de l'écran
      if (this.cube.y < 0) {
        this.cube.y = 0;
        this.cube.velocityY = 0;
      }
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

        this.player.x -= this.player.nbmove;

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
    if (this.cube.gravityEnabled) {
      this.checkCollisionBetweenPlayerAndCube();
    }
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
      this.keyState[e.code] = true;
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
      this.keyState[e.code] = false;
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


    //Mobile !
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

    // document.addEventListener('mousemove', function (event) {
    //   const rect = this.canvas.getBoundingClientRect(); // Obtenez les coordonnées du rectangle de votre canvas
    //   const mouseX = event.clientX - rect.left; // Coordonnée X de la souris par rapport à votre canvas
    //   const mouseY = event.clientY - rect.top; // Coordonnée Y de la souris par rapport à votre canvas

    //   // Ajustez les coordonnées de la souris en fonction de la position de la caméra
    //   console.log(this.cameraX)
    //   const adjustedMouseX = mouseX + this.cameraX;
    //   const adjustedMouseY = mouseY + this.cameraY;

    //   // Affichez les coordonnées de la souris ajustées
    //   document.getElementById("mousePosition").textContent = `Position de la souris : X = ${adjustedMouseX}, Y = ${adjustedMouseY}`;
    // });



    this.canvas.addEventListener('click', this.boundHandleMouseClick);

  }

  removeListeners() {
    // Supprimez l'écouteur d'événements
    this.canvas.removeEventListener('click', this.boundHandleMouseClick);
  }


  handleMouseClick(event) {

    var rect = this.canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    var adjustedMouseX = mouseX + this.cameraX;
    var adjustedMouseY = mouseY + this.cameraY;

    if (this.editor == 1) {

      const newPlatform = new Platform(adjustedMouseX, adjustedMouseY, 100, 20); // Création d'une nouvelle plateforme à l'emplacement du clic
      let nb = this.platforms.push(newPlatform);
      this.editorAll = { "nb": nb - 1, "mouseX": adjustedMouseX, "mouseY": adjustedMouseY }; // Ajouter la nouvelle plateforme à la liste des plateformes

      this.editor = 2;
    } else if (this.editor == 2) {


      this.platforms[this.editorAll.nb].width = Math.abs(adjustedMouseX - this.editorAll.mouseX);
      this.platforms[this.editorAll.nb].height = Math.abs(adjustedMouseY - this.editorAll.mouseY);

      console.log(this.platforms[this.editorAll.nb])

      this.editor = 1;
    } else if (this.editor == 3) {

      console.log("Wait,what do you doing here ?")

    } else {
      console.log("You wan activate the builder mode !")
    }


  }


}

// Démarrer le jeu lorsque la fenêtre est chargée
window.onload = function () {
  let game = new Game();

};
