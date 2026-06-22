const tableau = [
    { image: "image1.jpg", name: "Popeyes Kid", description: "Le mème de 'Dieunerst Collin' (Popeyes Kid) : un jeune garçon jetant un regard en coin (side-eye) méfiant, sceptique et amusé, utilisé pour exprimer le doute, la suspicion ou le jugement face à une situation." },
    { image: "image2.jpg", name: "Gavin", description: "Le mème de Gavin Thomas : un petit garçon en t-shirt rouge affichant un sourire forcé avec un regard plein de détresse ou de perplexité. Il est parfait pour illustrer une situation où l'on sourit poliment alors que l'on meurt d'envie de s'enfuir." },
    { image: "image1.jpg", name: "Popeyes Kid", description: "Le mème de 'Dieunerst Collin' (Popeyes Kid) : un jeune garçon jetant un regard en coin (side-eye) méfiant, sceptique et amusé, utilisé pour exprimer le doute, la suspicion ou le jugement face à une situation." },
    { image: "image3.jpg", name: "Roll Safe", description: "Le mème 'Roll Safe' : un homme qui se tapote la tempe avec un sourire malicieux pour proposer une solution totalement absurde mais infaillible. Par exemple : 'Tu ne peux pas rater tes examens si tu ne vas pas à l'école'." },
    { image: "image4.jpg", name: "Success Kid", description: "Le mème 'Success Kid' : un bébé sur la plage serrant le poing avec un regard ultra déterminé et victorieux. Il est utilisé pour célébrer un succès inattendu ou une petite revanche de la vie, comme retrouver un billet de 10€ dans une vieille veste." },
    { image: "image2.jpg", name: "Gavin", description: "Le mème de Gavin Thomas : un petit garçon en t-shirt rouge affichant un sourire forcé avec un regard plein de détresse ou de perplexité. Il est parfait pour illustrer une situation où l'on sourit poliment alors que l'on meurt d'envie de s'enfuir." },
    { image: "image4.jpg", name: "Success Kid", description: "Le mème 'Success Kid' : un bébé sur la plage serrant le poing avec un regard ultra déterminé et victorieux. Il est utilisé pour célébrer un succès inattendu ou une petite revanche de la vie, comme retrouver un billet de 10€ dans une vieille veste." },
    { image: "image3.jpg", name: "Roll Safe", description: "Le mème 'Roll Safe' : un homme qui se tapote la tempe avec un sourire malicieux pour proposer une solution totalement absurde mais infaillible. Par exemple : 'Tu ne peux pas rater tes examens si tu ne vas pas à l'école'." },
];

async function getCurrentTemperature(lat, long) {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&current=temperature_2m";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Statis: ${response.status}`);
        }
        const data = await response.json();
        return data.current.temperature_2m;
    } catch (error) {
        console.error("Error fetching current temperature:", error);
        return null;

    }
}

var container;
var pairesTrouvees = 0;
var temps = 0;
var timerId = null;
var firstFlippedCard = undefined;
var card1 = -1;
var lockBoard = false;

async function loaded() {
    console.log("loaded");
    melangerTableau(tableau);
    container = document.getElementById("container");
    await backgroundColor(container)
    for (const card of tableau) {
        generateCard(card);
    }
    timerId = setInterval(() => {
        temps++;
        document.getElementById("zoneTimer").innerText = "Temps : " + temps + "s";
    }, 1000);
    const cartes = document.getElementsByClassName("card");
    for (const [index, carte] of Array.from(cartes).entries()) {
        carte.addEventListener("click", function () {
            cardclick(carte, index);
        });
    }
}

function cardclick(currentlyFlippedCard, cardNumber) {
    if (lockBoard) return;
    console.log("cardclick " + cardNumber);
    if (card1 === -1) {
        toggleCard(currentlyFlippedCard);
        flipSound()
        card1 = cardNumber;
        firstFlippedCard = currentlyFlippedCard;
    }
    else {
        if (cardNumber === card1) {
            console.log("card " + cardNumber + "already flipped");
        }
        else {
            toggleCard(currentlyFlippedCard);
            flipSound()
            var cardName = tableau[cardNumber].name;
            var cardName1 = tableau[card1].name;
            if (cardName === cardName1) {
                lockBoard = true;
                const texteAAfficher = tableau[cardNumber].description;
                setTimeout(() => {
                    clearInterval(timerId);
                    document.getElementById("texteDescription").innerText = texteAAfficher;
                    document.getElementById("ecranVictoire").classList.remove("cache");
                    document.getElementById("btnContinuer").onclick = function () {
                        hideCard(firstFlippedCard);
                        hideCard(currentlyFlippedCard);
                        document.getElementById("ecranVictoire").classList.add("cache");
                        pairesTrouvees = pairesTrouvees + 1;
                        const totalPaires = tableau.length / 2
                        if (pairesTrouvees === totalPaires) {
                            let ancienRecord = localStorage.getItem("meilleurChrono");
                            let messageRecord = "";
                            if (ancienRecord === null) {
                                localStorage.setItem("meilleurChrono", temps);
                                messageRecord = "🥇 Premier record enregistré !";
                            } else {
                                ancienRecord = parseInt(ancienRecord);

                                if (temps < ancienRecord) {
                                    localStorage.setItem("meilleurChrono", temps);
                                    messageRecord = "🔥 Nouveau record !";
                                } else {
                                    messageRecord = "Meilleur score : " + ancienRecord + "s";
                                }
                            }
                            document.getElementById("tempsFinal").innerText = "Votre temps : " + temps + " secondes";
                            document.getElementById("meilleurScore").innerText = messageRecord;
                            confetti();
                            confetti();
                            confetti();
                            confetti();
                            confetti();
                            confetti();
                            confetti();
                            confetti();
                            document.getElementById("tempsFinal").innerText = "Votre temps : " + temps + " secondes";
                            document.getElementById("ecranFin").classList.remove("cache");
                            document.getElementById("btnRejouer").onclick = function () {
                                location.reload();
                            }
                        } else {
                            timerId = setInterval(() => {
                                temps++
                                document.getElementById("zoneTimer").innerText = "Temps : " + temps + "s"
                            }, 1000);
                        }
                        card1 = -1;
                        firstFlippedCard = undefined;
                        lockBoard = false;
                    }
                }, 1000)
            }
            else {
                lockBoard = true
                setTimeout(() => {
                    toggleCard(firstFlippedCard);
                    toggleCard(currentlyFlippedCard);
                    flipSound()
                    card1 = -1;
                    firstFlippedCard = undefined;
                    lockBoard = false
                }, 1000);
            }
        }
    }
}

function toggleCard(card) {
    card.classList.toggle("retourner");
}

function hideCard(card) {
    card.classList = ["hiddenCard"];
}

function generateCard(card) {
    console.log(card.name + ":" + card.image);

    const avantDiv = document.createElement("div");
    avantDiv.classList.add("face", "avant");

    const arriereDiv = document.createElement("div");
    arriereDiv.classList.add("face", "arriere");

    const img = document.createElement("img");
    img.src = card.image;
    img.alt = card.name;

    arriereDiv.append(img)

    const carteDiv = document.createElement("div");
    carteDiv.classList.add("card");
    carteDiv.append(avantDiv);
    carteDiv.append(arriereDiv);

    container.append(carteDiv);
}

window.addEventListener("load", loaded)

function melangerTableau(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function backgroundColor(container) {
    const currentTemp = await getCurrentTemperature(48.5839, 7.7455)
    console.log("Current temperature:", currentTemp)
    if (currentTemp !== null) {
        if (currentTemp >= 35) {
            container.style.backgroundColor = "#8b0000";
        } else if (currentTemp >= 22 && currentTemp < 35) {
            container.style.backgroundColor = "#cc5533"
        } else if (currentTemp >= 12 && currentTemp < 22) {
            container.style.backgroundColor = "#2d5a27"
        } else if (currentTemp >= 0 && currentTemp < 12) {
            container.style.backgroundColor = "#0691ee"
        } else {
            container.style.backgroundColor = "#0a2c72"
        }
    }
}

function flipSound() {
    const flipSound = document.getElementById("cardFlip");
    if (flipSound) {
        flipSound.currentTime = 0;
        flipSound.play().catch(error => console.log("Audio playback prevented:", error));
    }
}