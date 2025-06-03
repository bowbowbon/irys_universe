// ==== Game variables ====
let scene, camera, renderer, clock;
let player = { position: new THREE.Vector3(0, 1.6, 0), rotation: { x: 0, y: 0 } };
let moveKeys = { w: false, a: false, s: false, d: false };
let pointerLocked = false;
let interactables = [];

// Quiz data
const multimediaQuizData = [
  {
    question: "What is Irys in the context of blockchain technology?",
    options: [
      "A blockchain-based social media platform",
      "A static data storage platform",
      "The world’s first programmable datachain",
      "A decentralized digital payment system"
    ],
    correct: 2
  },
  {
    question: "What is the key difference between traditional datachains and Irys?",
    options: [
      "Traditional datachains are faster than Irys",
      "Irys enables data to become active and programmable",
      "Traditional datachains support smart contracts, while Irys does not",
      "Irys stores only temporary data"
    ],
    correct: 1
  },
  {
    question: "Why is Irys considered an evolution from passive data storage?",
    options: [
      "Because Irys uses cloud technology for storage",
      "Because data on Irys can interact and adapt within applications",
      "Because Irys stores data in encrypted format",
      "Because Irys supports only text-based data"
    ],
    correct: 1
  },
  {
    question: "What does 'programmable datachain' mean in the context of Irys?",
    options: [
      "A chain that stores only static files",
      "A chain that allows data to execute logic and interact with applications",
      "A chain designed for video streaming",
      "A chain limited to financial transactions"
    ],
    correct: 1
  },
  {
    question: "How does Irys change the way data is used in applications?",
    options: [
      "By restricting data access to selected users",
      "By enabling data to be active and interoperable across applications",
      "By automatically deleting data after a certain time",
      "By storing data in a proprietary format"
    ],
    correct: 1
  }
];


let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

// Crossword data (contoh sudah diperbaiki sesuai permintaan)
const multimediaCrosswordData = {
  grid: [
    ['', '', '', '', '', '', '', 'D', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', 'A', '', '', '', '', '', '', ''],
    ['', '', '', '', 'S', 'T', 'O', 'R', 'A', 'G', 'E', '', '', '', ''],
    ['', '', '', '', '', '', '', 'A', '', '', '', '', '', '', ''],
    ['P', 'R', 'O', 'G', 'R', 'A', 'M', 'M', 'A', 'B', 'L', 'E', '', '', ''],
    ['', '', '', '', '', '', '', 'I', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', 'N', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', 'S', '', '', '', '', '', '', ''],
    ['', '', '', 'I', 'R', 'Y', 'S', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ],
  clues: {
    across: [
      { number: 1, clue: "The foundational layer Irys adds to data, enabling smart interaction.", answer: "PROGRAMMABLE", row: 4, col: 0 },
      { number: 2, clue: "Irys is the world's first ____ datachain.", answer: "PROGRAMMABLE", row: 4, col: 0 },
      { number: 3, clue: "Permanent, tamper-proof medium where Irys stores data.", answer: "STORAGE", row: 2, col: 4 },
      { number: 4, clue: "The protocol that enables active data interactions across apps.", answer: "IRYS", row: 8, col: 3 }
    ],
    down: [
      { number: 5, clue: "What makes Irys unique: not just storage but active, flexible data.", answer: "DATA", row: 0, col: 7 },
    ]
  }
};

// Inisialisasi & fungsi game
function init() {
    simulateLoading();
}

function simulateLoading() {
    const progressFill = document.getElementById('progressFill');
    let progress = 0;

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
                document.getElementById('mainMenu').classList.remove('hidden');
            }, 500);
        }
        progressFill.style.width = progress + '%';
    }, 200);
}

function showInstructions() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('instructionsMenu').classList.remove('hidden');
}

function hideInstructions() {
    document.getElementById('instructionsMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameControls').classList.remove('hidden');
    document.getElementById('crosshair').classList.remove('hidden');

    initThreeJS();
    createClassroom();
    animate();
    setupControls();
}

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('gameContainer').appendChild(renderer.domElement);

    clock = new THREE.Clock();

    camera.position.copy(player.position);
}

function createClassroom() {
    // Lighting yang lebih cerah
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Floor biru muda cerah
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xadd8e6 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    createWalls();
    createBlackboard();
    createVideoAndPDFScreens();  // Fungsi baru untuk YouTube dan PDF
    createFurniture();
    createMultipleYouTubeAndPDFScreens();
}


function createWalls() {
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xE6E6FA });

    const backWallGeometry = new THREE.PlaneGeometry(20, 6);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 3, -10);
    scene.add(backWall);

    const frontWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    frontWall.position.set(0, 3, 10);
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    const sideWallGeometry = new THREE.PlaneGeometry(20, 6);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-10, 3, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(10, 3, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);
}

function createBlackboard() {
    const frameGeometry = new THREE.BoxGeometry(6, 3, 0.2);
    const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 3, -9.8);
    frame.castShadow = true;
    scene.add(frame);

    const boardGeometry = new THREE.PlaneGeometry(5.5, 2.5);
    const boardMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F2F });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.set(0, 3, -9.6);
    scene.add(board);

    // Fungsi helper buat bikin texture tulisan dari canvas
    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,0,0)'; // transparan
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px Arial';
        ctx.fillStyle = '#ffffff'; // warna putih
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        return new THREE.CanvasTexture(canvas);
    }

    // Area quiz
    const quizArea = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 2.5),
        new THREE.MeshLambertMaterial({ color: 0x2F4F2F, transparent: true, opacity: 0.01 })
    );
    quizArea.position.set(-1.5, 3, -9.5);
    quizArea.userData = { type: 'quiz', name: 'Quiz' };
    scene.add(quizArea);
    interactables.push(quizArea);

    // Label Quiz
    const quizLabelMaterial = new THREE.MeshBasicMaterial({
        map: createTextTexture('Quiz'),
        transparent: true
    });
    const quizLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), quizLabelMaterial);
    quizLabel.position.set(-1.5, 2.3, -9.4); // sedikit di atas quizArea
    scene.add(quizLabel);

    // Area crossword
    const crosswordArea = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 2.5),
        new THREE.MeshLambertMaterial({ color: 0x2F4F2F, transparent: true, opacity: 0.01 })
    );
    crosswordArea.position.set(1.5, 3, -9.5);
    crosswordArea.userData = { type: 'crossword', name: 'Crossword' };
    scene.add(crosswordArea);
    interactables.push(crosswordArea);

    // Label Crossword
    const crosswordLabelMaterial = new THREE.MeshBasicMaterial({
        map: createTextTexture('Crossword'),
        transparent: true
    });
    const crosswordLabel = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.6), crosswordLabelMaterial);
    crosswordLabel.position.set(1.5, 2.3, -9.4); // sedikit di atas crosswordArea
    scene.add(crosswordLabel);
}


function createVideoScreens() {
    const screenMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

    // Contoh screen di kiri dan kanan (sebelumnya)
    for (let i = 0; i < 3; i++) {
        const screenGeometry = new THREE.PlaneGeometry(3, 2);
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(-9.8, 2 + (i * 1.5), -6 + (i * 4));
        screen.rotation.y = Math.PI / 2;
        scene.add(screen);

        const videoArea = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2),
            new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.01 })
        );
        videoArea.position.copy(screen.position);
        videoArea.position.x = -9.7;
        videoArea.rotation.y = Math.PI / 2;
        videoArea.userData = { type: 'video', name: `Video Pembelajaran ${i + 1}` };
        scene.add(videoArea);
        interactables.push(videoArea);
    }

    for (let i = 0; i < 3; i++) {
        const screenGeometry = new THREE.PlaneGeometry(3, 2);
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(9.8, 2 + (i * 1.5), -6 + (i * 4));
        screen.rotation.y = -Math.PI / 2;
        scene.add(screen);

        const videoArea = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2),
            new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.01 })
        );
        videoArea.position.copy(screen.position);
        videoArea.position.x = 9.7;
        videoArea.rotation.y = -Math.PI / 2;
        videoArea.userData = { type: 'video', name: `Video Pembelajaran ${i + 4}` };
        scene.add(videoArea);
        interactables.push(videoArea);
    }
}

// Fungsi tambahan untuk YouTube thumbnail dan PDF di dinding kiri kelas
function createVideoAndPDFScreens() {
    const screenMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    // YouTube thumbnail
    const ytScreenGeometry = new THREE.PlaneGeometry(4, 2.25);
    const ytScreen = new THREE.Mesh(ytScreenGeometry, screenMaterial);
    ytScreen.position.set(-9.8, 3, 0);
    ytScreen.rotation.y = Math.PI / 2;
    ytScreen.userData = { type: 'youtube', videoId: 'dP75Khfy4s4' };
    scene.add(ytScreen);
    interactables.push(ytScreen);

    // PDF thumbnail (gunakan warna atau gambar thumbnail)
    const pdfScreenGeometry = new THREE.PlaneGeometry(4, 2.25);
    const pdfScreen = new THREE.Mesh(pdfScreenGeometry, screenMaterial);
    pdfScreen.position.set(-9.8, 1, 5);
    pdfScreen.rotation.y = Math.PI / 2;
    pdfScreen.userData = { type: 'pdf', pdfUrl: 'https://github.com/bowbowbon/irys_universe/blob/60d699e79722befd575db578e4c24cdfc6d9379f/file/pdf.pdf' }; // Ganti dengan path PDF kamu
    scene.add(pdfScreen);
    interactables.push(pdfScreen);

    
}

function createFurniture() {
    const deskMaterial = new THREE.MeshLambertMaterial({ color: 0xD2691E });

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            const deskGeometry = new THREE.BoxGeometry(1.5, 0.8, 1);
            const desk = new THREE.Mesh(deskGeometry, deskMaterial);
            desk.position.set(-4.5 + col * 3, 0.4, 2 + row * 2.5);
            desk.castShadow = true;
            scene.add(desk);

            const chairGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.8);
            const chairMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const chair = new THREE.Mesh(chairGeometry, chairMaterial);
            chair.position.set(-4.5 + col * 3, 0.75, 3.5 + row * 2.5);
            chair.castShadow = true;
            scene.add(chair);
        }
    }

    const teacherDeskGeometry = new THREE.BoxGeometry(3, 0.8, 1.5);
    const teacherDesk = new THREE.Mesh(teacherDeskGeometry, deskMaterial);
    teacherDesk.position.set(0, 0.4, -7);
    teacherDesk.castShadow = true;
    scene.add(teacherDesk);
}

// Controls setup, pointer lock, movement & interaction
function setupControls() {
    document.addEventListener('click', () => {
    const panelAktif = !document.getElementById('quizPanel').classList.contains('hidden') ||
                       !document.getElementById('crosswordPanel').classList.contains('hidden') ||
                       !document.getElementById('videoPanel').classList.contains('hidden') ||
                       !document.getElementById('youtubePanel').classList.contains('hidden') ||
                       !document.getElementById('pdfPanel').classList.contains('hidden');

    if (!pointerLocked && !panelAktif) {
        renderer.domElement.requestPointerLock();
    }
});


    document.addEventListener('pointerlockchange', () => {
        pointerLocked = document.pointerLockElement === renderer.domElement;
    });

    document.addEventListener('mousemove', (event) => {
    if (pointerLocked) {
        const mouseX = event.movementX || 0;
        const mouseY = event.movementY || 0;

        // Rotasi badan kiri kanan (yaw)
        player.rotation.y -= mouseX * 0.002;

        // Geser posisi kamera naik turun berdasarkan mouseY
        player.position.y -= mouseY * 0.01; // sesuaikan sensitivitas

        // Batasi posisi Y supaya gak terlalu tinggi atau rendah
        player.position.y = Math.min(Math.max(player.position.y, 1), 3);

        // Update posisi dan rotasi kamera
        camera.position.copy(player.position);
        camera.rotation.y = player.rotation.y;
        camera.rotation.x = 0; // tetap lurus, tidak miring
        camera.rotation.z = 0;
    }
    });

    
    document.addEventListener('keydown', (event) => {
    if (!document.getElementById('crosswordPanel').classList.contains('hidden')) {
        // Jangan jalankan kontrol game jika crossword aktif
        return;
    }
    // ... kode kontrol game seperti WASD dll ...
});
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW': moveKeys.w = true; break;
            case 'KeyA': moveKeys.a = true; break;
            case 'KeyS': moveKeys.s = true; break;
            case 'KeyD': moveKeys.d = true; break;
            case 'Escape': handleEscape(); break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW': moveKeys.w = false; break;
            case 'KeyA': moveKeys.a = false; break;
            case 'KeyS': moveKeys.s = false; break;
            case 'KeyD': moveKeys.d = false; break;
        }
    });

    renderer.domElement.addEventListener('click', handleInteraction);
}

function handleEscape() {
    if (document.getElementById('quizPanel').classList.contains('hidden') &&
        document.getElementById('crosswordPanel').classList.contains('hidden') &&
        document.getElementById('videoPanel').classList.contains('hidden') &&
        document.getElementById('youtubePanel').classList.contains('hidden') &&
        document.getElementById('pdfPanel').classList.contains('hidden')
    ) {
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('gameControls').classList.add('hidden');
        document.getElementById('crosshair').classList.add('hidden');
    } else {
        closeAllPanels();
    }
}

function handleInteraction() {
    if (!pointerLocked) return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const intersects = raycaster.intersectObjects(interactables);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        const userData = object.userData;

        if (userData.type === 'quiz') {
            openPanel('quiz');
            initQuiz();
        } else if (userData.type === 'crossword') {
            openPanel('crossword');
            initCrossword();
        } else if (userData.type === 'video') {
            openPanel('video');
        } else if (userData.type === 'youtube') {
            openYouTubePanel(userData.videoId);
        } else if (userData.type === 'pdf') {
            openPDFPanel(userData.pdfUrl);
        }
    }
}

function openPanel(type) {
    closeAllPanels();
    const panel = document.getElementById(type + 'Panel');
    panel.classList.remove('hidden');

    // Matikan pointer lock jika masih aktif (untuk semua jenis panel)
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }

    pointerLocked = false;  // pastikan status kontrol juga diupdate

    // Fokus input pertama jika crossword
    if (type === 'crossword') {
        const inputs = panel.querySelectorAll('input');
        for (const input of inputs) {
            if (input.value.trim() === '') {
                input.focus();
                break;
            }
        }
    }
}


function closeAllPanels() {
    closePanel('quiz');
    closePanel('crossword');
    closePanel('video');
    closePanel('youtube');
    closePanel('pdf');
}

function openYouTubePanel(videoId) {
    closeAllPanels();
    const panel = document.getElementById('youtubePanel');
    panel.classList.remove('hidden');
    const iframe = document.getElementById('youtubeIframe');
    iframe.src = `https://docs.irys.xyz/`;
    if (document.pointerLockElement) document.exitPointerLock();
    pointerLocked = false;
}

function openPDFPanel(pdfUrl) {
    closeAllPanels();
    const panel = document.getElementById('pdfPanel');
    panel.classList.remove('hidden');
    const iframe = document.getElementById('pdfIframe');
    iframe.src = pdfUrl;
    if (document.pointerLockElement) document.exitPointerLock();
    pointerLocked = false;
}
function createMultipleYouTubeAndPDFScreens() {
  const screenMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

  // YouTube screens
const loader = new THREE.TextureLoader();

const ytData = [
  { videoId: 'VzVmDLyXAyc', position: new THREE.Vector3(-9.8, 3, -5) },
  { videoId: 'UgAReavC7II', position: new THREE.Vector3(-9.8, 3, 0) },
  { videoId: 'Kbna8w1yQ_4', position: new THREE.Vector3(-9.8, 3, 5) },
];


ytData.forEach((yt) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${yt.videoId}/hqdefault.jpg`;
  loader.load(thumbnailUrl, (texture) => {
    const ytScreenGeometry = new THREE.PlaneGeometry(4, 2.25);
    const ytScreenMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const ytScreen = new THREE.Mesh(ytScreenGeometry, ytScreenMaterial);
    ytScreen.position.copy(yt.position);
    ytScreen.rotation.y = Math.PI / 2;
    ytScreen.userData = { type: 'youtube', videoId: yt.videoId };
    scene.add(ytScreen);
    interactables.push(ytScreen);
  });
});

  // PDF screens
  const pdfData = [
  {
    pdfUrl: 'file/Irys _ What a Datachain Is.pdf',
    thumbUrl: 'file/buku_pak_ahmad.png', // ini harus kamu buat dulu gambarnya
    position: new THREE.Vector3(9.8, 3, 0)
  },
  {
    pdfUrl: 'file/Irys _ What a Datachain Is.pdf',
    thumbUrl: 'file/buku_distributed.png',
    position: new THREE.Vector3(9.8, 3, 3)
  },
  {
    pdfUrl: 'file/Irys _ What a Datachain Is.pdf',
    thumbUrl: 'file/buku3.png',
    position: new THREE.Vector3(9.8, 3, 6)
  },
];


  pdfData.forEach((pdf, i) => {
    const pdfScreenGeometry = new THREE.PlaneGeometry(4, 2.25);
    const pdfScreen = new THREE.Mesh(pdfScreenGeometry, screenMaterial);
    pdfScreen.position.copy(pdf.position);
    pdfScreen.rotation.y = -Math.PI / 2;
    pdfScreen.userData = { type: 'pdf', pdfUrl: pdf.pdfUrl };
    scene.add(pdfScreen);
    interactables.push(pdfScreen);
  });
}

function closePanel(type) {
    document.getElementById(type + 'Panel').classList.add('hidden');
    if(type === 'youtube'){
        document.getElementById('youtubeIframe').src = '';
    }
    if(type === 'pdf'){
        document.getElementById('pdfIframe').src = '';
    }
}

function updatePlayer() {
    const speed = 0.1;
    const direction = new THREE.Vector3();

    if (moveKeys.w) direction.z -= 1;
    if (moveKeys.s) direction.z += 1;
    if (moveKeys.a) direction.x -= 1;
    if (moveKeys.d) direction.x += 1;

    if (direction.length() > 0) {
        direction.normalize();
        direction.multiplyScalar(speed);
        direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y);

        const newPosition = player.position.clone().add(direction);

        if (Math.abs(newPosition.x) < 9.5 && Math.abs(newPosition.z) < 9.5) {
            player.position.copy(newPosition);
        }
    }

    camera.position.copy(player.position);
    camera.rotation.x = player.rotation.x;
    camera.rotation.y = player.rotation.y;
}

function animate() {
    requestAnimationFrame(animate);

    if (pointerLocked) {
        updatePlayer();
    }

    renderer.render(scene, camera);
}

// ==== Quiz functions ====
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    showQuestion();
}

function showQuestion() {
    const question = multimediaQuizData[currentQuestion];
    document.getElementById('questionText').textContent = `${currentQuestion + 1}. ${question.question}`;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index, optionDiv);
        optionsContainer.appendChild(optionDiv);
    });

    document.getElementById('nextBtn').style.display = 'none';
    selectedAnswer = null;
}

function selectOption(index, element) {
    if (selectedAnswer !== null) return;

    selectedAnswer = index;
    const question = multimediaQuizData[currentQuestion];
    const options = document.querySelectorAll('#optionsContainer .option');

    options.forEach((option, i) => {
        if (i === question.correct) {
            option.classList.add('correct');
        } else if (i === index && i !== question.correct) {
            option.classList.add('incorrect');
        } else {
            option.style.opacity = '0.5';
        }
    });

    if (index === question.correct) {
        score++;
    }

    document.getElementById('nextBtn').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < multimediaQuizData.length) {
        showQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    document.getElementById('finalScore').textContent = `Your Score: ${score}/${multimediaQuizData.length}`;
}

function restartQuiz() {
    initQuiz();
}

// ==== Crossword functions ====
// ==== Crossword functions ====

function initCrossword() {
    const crosswordGridElem = document.getElementById('crosswordGrid');
    const cols = multimediaCrosswordData.grid[0].length;
    crosswordGridElem.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

    createCrosswordGrid();
    showCrosswordClues();
    addArrowKeyNavigation(); // tambahkan navigasi panah atas/bawah
}

function createCrosswordGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';

    const rows = multimediaCrosswordData.grid.length;
    const cols = multimediaCrosswordData.grid[0].length;

    // Simpan array nomor per posisi, karena bisa lebih dari satu nomor di satu kotak
    const numberPositions = {};

    multimediaCrosswordData.clues.across.forEach(clue => {
        const key = `${clue.row}-${clue.col}`;
        if (!numberPositions[key]) {
            numberPositions[key] = [];
        }
        numberPositions[key].push(clue.number);
    });

    multimediaCrosswordData.clues.down.forEach(clue => {
        const key = `${clue.row}-${clue.col}`;
        if (!numberPositions[key]) {
            numberPositions[key] = [];
        }
        numberPositions[key].push(clue.number);
    });

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'crossword-cell';

            if (multimediaCrosswordData.grid[i][j] === '') {
                cell.classList.add('black');
            } else {
                cell.classList.add('white');
                cell.style.position = 'relative';

                const key = `${i}-${j}`;
                if (numberPositions[key]) {
                    const numberLabel = document.createElement('div');
                    // Gabungkan semua nomor dalam array, misal: "1,3"
                    numberLabel.textContent = numberPositions[key].join(',');
                    numberLabel.style.position = 'absolute';
                    numberLabel.style.top = '2px';
                    numberLabel.style.left = '2px';
                    numberLabel.style.fontSize = '10px';
                    numberLabel.style.fontWeight = 'bold';
                    numberLabel.style.color = '#667eea';
                    numberLabel.style.userSelect = 'none';
                    cell.appendChild(numberLabel);
                }

                const input = document.createElement('input');
                input.maxLength = 1;
                input.dataset.row = i;
                input.dataset.col = j;
                input.dataset.answer = multimediaCrosswordData.grid[i][j];
                cell.appendChild(input);
            }

            grid.appendChild(cell);
        }
    }
}

function showCrosswordClues() {
    const acrossClues = document.getElementById('acrossClues');
    const downClues = document.getElementById('downClues');

    acrossClues.innerHTML = '';
    downClues.innerHTML = '';

    multimediaCrosswordData.clues.across.forEach(clue => {
        const clueDiv = document.createElement('div');
        clueDiv.className = 'clue';
        clueDiv.textContent = `${clue.number}. ${clue.clue}`;
        acrossClues.appendChild(clueDiv);
    });

    multimediaCrosswordData.clues.down.forEach(clue => {
        const clueDiv = document.createElement('div');
        clueDiv.className = 'clue';
        clueDiv.textContent = `${clue.number}. ${clue.clue}`;
        downClues.appendChild(clueDiv);
    });
}

function checkCrossword() {
    const inputs = document.querySelectorAll('#crosswordGrid input');
    let correct = 0;
    let total = 0;

    inputs.forEach(input => {
        total++;
        if (input.value.toUpperCase() === input.dataset.answer) {
            input.style.backgroundColor = '#d4edda';
            input.style.borderColor = '#28a745';
            correct++;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.borderColor = '#dc3545';
        }
    });

    alert(`You answer ${correct} from ${total} correct box!`);
}

function resetCrossword() {
    const inputs = document.querySelectorAll('#crosswordGrid input');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.borderColor = '';
    });
}

// Fungsi tambahan untuk navigasi dengan tombol panah atas dan bawah
function addArrowKeyNavigation() {
    const inputs = document.querySelectorAll('#crosswordGrid input');
    inputs.forEach(input => {
        input.addEventListener('keydown', (event) => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            let targetInput;

            switch(event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    targetInput = document.querySelector(`#crosswordGrid input[data-row="${row - 1}"][data-col="${col}"]`);
                    if (targetInput) targetInput.focus();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    targetInput = document.querySelector(`#crosswordGrid input[data-row="${row + 1}"][data-col="${col}"]`);
                    if (targetInput) targetInput.focus();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    targetInput = document.querySelector(`#crosswordGrid input[data-row="${row}"][data-col="${col - 1}"]`);
                    if (targetInput) targetInput.focus();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    targetInput = document.querySelector(`#crosswordGrid input[data-row="${row}"][data-col="${col + 1}"]`);
                    if (targetInput) targetInput.focus();
                    break;
            }
        });
    });
}



// Window resize handler
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

init();
