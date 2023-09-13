let dy, dx;

dy = 1;
dx = 1;


let enMouvement = false;
let intervalle;
const vitesse = 1;

function deplacerImageUn() {
    const titre = document.getElementById('imageUn');
    const rectangle = document.getElementById('rectangle');

    if (enMouvement) {
        clearInterval(intervalle);
        enMouvement = false;
        console.log("Animation arrêtée");
        return;
    }

    enMouvement = true;
    intervalle = setInterval(() => {
        const titreTop = parseInt(getComputedStyle(titre).top);
        const titreLeft = parseInt(getComputedStyle(titre).left);
        const titreHeight = titre.offsetHeight;
        const titreWidth = titre.offsetWidth;
        const rectangleHeight = rectangle.offsetHeight;
        const rectangleWidth = rectangle.offsetWidth;

        let nouveauTop = titreTop + dy * vitesse;
        let nouveauLeft = titreLeft + dx * vitesse;
//	console.log("x : ", titreLeft, " y : ", titreTop, " dx : ", dx, " dy : ", dy);
        // Logique de collision pour la direction verticale
    if (nouveauTop <= 0) {
	createParticle(titreLeft + titreWidth / 2, 1, titreWidth,0);
        dy = -dy;
        nouveauTop = 0;
    } else if (nouveauTop + titreHeight > rectangleHeight) {
        dy = -dy;
        nouveauTop = rectangleHeight - titreHeight;
	createParticle(titreLeft + titreWidth / 2, rectangleHeight-10, titreWidth,0);
    }

        // Logique de collision pour la direction horizontale
    if (nouveauLeft <= 0) {
        dx = -dx;
        nouveauLeft = 0;
	createParticle(nouveauLeft, titreTop + titreHeight / 2, 0,titreHeight);
    } else if (nouveauLeft + titreWidth > rectangleWidth) {
        dx = -dx;
        nouveauLeft = rectangleWidth - titreWidth;
	createParticle(nouveauLeft + titreWidth, titreTop + titreHeight / 2, 0, titreHeight);
    }

        titre.style.top = nouveauTop + 'px';
        titre.style.left = nouveauLeft + 'px';
    }, 5);
}

function createParticle(x, y, w, z) {
    const numParticles = 30;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = getRandomColor(); 

        // Position initiale
	const randomOffsetX = (Math.random() - 0.5) * w;
	const randomOffsetY = (Math.random() - 0.5) * z;
        particle.style.top = (y + randomOffsetY) + 'px';
        particle.style.left = (x + randomOffsetX) + 'px';  // ici, nous ajoutons l'offset à x pour avoir la position finale


        // Vitesses et directions aléatoires
        const speed = (Math.random() * 100) + 2;  // vitesse entre 2 et 7
        const direction = Math.random() * 2 * Math.PI;  // direction aléatoire en radians

        // Durée d'animation aléatoire et compteur de temps
        const moveDuration = Math.random() * 3 + 0.5;
        let elapsedTime = 0;

        const particleIntervalle = setInterval(() => {
            elapsedTime += 0.01; // supposant que l'intervalle est appelé toutes les 10ms

            // Calculer le déplacement basé sur la durée écoulée
            const moveFactor = elapsedTime / moveDuration;
            particle.style.transform = `translate(${Math.cos(direction) * speed * moveFactor}px, ${Math.sin(direction) * speed * moveFactor}px)`;

            // Réduire l'opacité progressivement pour simuler l'animation fadeOutParticle
            particle.style.opacity = 1 - moveFactor;

            if (elapsedTime >= moveDuration) {
                clearInterval(particleIntervalle);
                particle.remove();
            }
        }, 10);

        document.getElementById('rectangle').appendChild(particle);
    }
}



function getRandomColor() {
    const r = 255;
    const g = Math.floor(Math.random() * 156) + 100;  // Des valeurs entre 100 et 255
    const b = Math.floor(Math.random() * 56);  // Des valeurs entre 0 et 55
    return `rgb(${r},${g},${b})`;
}
function getRandomDirection() {
    let val;
    do {
        val = Math.random() - 0.5;
    } while (Math.abs(val) < 0.1); // s'assurer que la valeur est suffisamment éloignée de zéro
    return val;
}

document.addEventListener("mousemove", function(event) {
    let conteneur = document.getElementById("sb1");
    let rect = conteneur.getBoundingClientRect();

    if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
        // La souris est à l'intérieur du conteneur
        conteneur.style.filter = "blur(0px)";
    } else {
        // Calculer la distance entre la souris et le point le plus proche sur le conteneur
        let dx = event.clientX < rect.left ? rect.left - event.clientX : event.clientX - rect.right;
        let dy = event.clientY < rect.top ? rect.top - event.clientY : event.clientY - rect.bottom;
        
        // S'assurer que dx et dy ne sont pas négatifs (c'est-à-dire que la souris est à l'intérieur de la boîte par rapport à cet axe)
        dx = Math.max(0, dx);
        dy = Math.max(0, dy);


        let distance = Math.sqrt(dx * dx + dy * dy);
//	console.log(dx,dy, distance);        
        const a = 0.001;  // Ajustez cette valeur pour contrôler l'intensité de l'effet de flou
        const b = 2;    // Cette valeur contrôle à quel point l'effet de flou est exponentiel
        
        let blurValue = Math.min(20, Math.sqrt(a * Math.pow(distance, b)));		
        conteneur.style.filter = `blur(${blurValue}px)`;
    }
});

