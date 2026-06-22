const playlist = [
    {
        nome: "CONSUMIDO",
        artista: "YUNG JUSE",
        capa: "src/capas/consumido.jpg",      
        src: "src/musicas/consumido.mp3",
        bg: "src/backgrounds/consumido.mp4"  
    },
    {
        nome: "TOU NEM AI 🤷🏻‍♂️🤷🏻‍♂️",
        artista: "TIAGO MOB x CHAYLAN",
        capa: "src/capas/tounemai.jpg",      
        src: "src/musicas/tounemai.mp3",
        bg: "src/backgrounds/tounemai.mp4" 
    }
];

const traducoes = {
    pt: {
        overlay: "[ CLIQUE PARA ENTRAR ]",
        trackName: "Nome Da Música",
        trackArtist: "Artista",
        linkOotd: "OOTD (HCKE FOR 10€)",
        linkKukirin: "Kukirin Web",
        linkGithub: "Github",
        contact: "Contato",
        footerCopy: "© 2025 HECKA. Todos os direitos reservados.",
        shareTitle: "Compartilhar Link",
        shareDesc: "Scaneie o QR ou use os botões abaixo",
        copied: "Copiado!"
    },
    en: {
        overlay: "[ CLICK TO ENTER ]",
        trackName: "Song Name",
        trackArtist: "Artist",
        linkOotd: "OOTD (HCKE FOR 10€)",
        linkKukirin: "Kukirin Web",
        linkGithub: "Github",
        contact: "Contact",
        footerCopy: "© 2025 HECKA. All rights reserved.",
        shareTitle: "Share Link",
        shareDesc: "Scan the QR or use the buttons below",
        copied: "Copied!"
    }
};

let indexAtual = 0;
let volumeAnterior = 0.5;
let urlAtivaDoModal = "";

const overlay = document.getElementById('overlay');
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const trackName = document.getElementById('track-name');
const trackArtist = document.getElementById('track-artist');
const trackCover = document.getElementById('track-cover');
const volumeIcon = document.getElementById('volume-icon');
const volumeSlider = document.getElementById('volume-slider');
const videoBg = document.getElementById('video-bg');

function definirIdioma() {
    const idiomaNavegador = navigator.language || navigator.userLanguage;
    const idioma = idiomaNavegador.startsWith('pt') ? 'pt' : 'en';
    
    document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : 'en';
    
    document.querySelectorAll('[data-i18n]').forEach(elemento => {
        const chave = elemento.getAttribute('data-i18n');
        if (traducoes[idioma] && traducoes[idioma][chave]) {
            elemento.textContent = traducoes[idioma][chave];
        }
    });
}

function carregarMusica(index) {
    const musica = playlist[index];
    audio.src = musica.src;
    trackName.textContent = musica.nome;
    trackArtist.textContent = musica.artista;
    trackCover.src = musica.capa;
    videoBg.src = musica.bg;
    videoBg.currentTime = 0;
    videoBg.load();
    audio.volume = volumeSlider.value;
}

definirIdioma();
carregarMusica(indexAtual);

function entrarNoSite() {
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    audio.currentTime = 0;
    videoBg.currentTime = 0;
    audio.play().catch(err => console.log(err));
    videoBg.play().catch(err => console.log(err));
    atualizarBotaoPlay(true);
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        videoBg.play();
        atualizarBotaoPlay(true);
    } else {
        audio.pause();
        videoBg.pause();
        atualizarBotaoPlay(false);
    }
}

function atualizarBotaoPlay(tocando) {
    if (tocando) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function proximaMusica() {
    indexAtual = (indexAtual + 1) % playlist.length;
    carregarMusica(indexAtual);
    if (overlay.style.visibility === 'hidden') {
        audio.currentTime = 0;
        videoBg.currentTime = 0;
        audio.play().catch(err => console.log(err));
        videoBg.play().catch(err => console.log(err));
        atualizarBotaoPlay(true);
    }
}

function musicaAnterior() {
    indexAtual = (indexAtual - 1 + playlist.length) % playlist.length;
    carregarMusica(indexAtual);
    if (overlay.style.visibility === 'hidden') {
        audio.currentTime = 0;
        videoBg.currentTime = 0;
        audio.play().catch(err => console.log(err));
        videoBg.play().catch(err => console.log(err));
        atualizarBotaoPlay(true);
    }
}

function ajustarVolume(valor) {
    audio.volume = valor;
    atualizarIconeVolume(valor);
}

function toggleMute() {
    if (audio.volume > 0) {
        volumeAnterior = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        atualizarIconeVolume(0);
    } else {
        audio.volume = volumeAnterior;
        volumeSlider.value = volumeAnterior;
        atualizarIconeVolume(volumeAnterior);
    }
}

function atualizarIconeVolume(valor) {
    if (valor == 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (valor < 0.5) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
}

// --- INTEGRAÇÃO DO MODAL DE COMPARTILHAMENTO ---
function openModal(url) {
    urlAtivaDoModal = url;
    const qrOverlay = document.getElementById('qrOverlay');
    const qrImage = document.getElementById('qrImage');
    
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
    
    qrOverlay.style.display = 'flex';
}

function closeModal() {
    document.getElementById('qrOverlay').style.display = 'none';
}

document.getElementById('copyBtn').addEventListener('click', () => {
    if(urlAtivaDoModal) {
        navigator.clipboard.writeText(urlAtivaDoModal).then(() => {
            const idiomaNavegador = navigator.language || navigator.userLanguage;
            const idioma = idiomaNavegador.startsWith('pt') ? 'pt' : 'en';
            alert(traducoes[idioma].copied);
        });
    }
});

document.getElementById('shareBtn').addEventListener('click', () => {
    if (navigator.share && urlAtivaDoModal) {
        navigator.share({ title: 'H3CKE5 Link', url: urlAtivaDoModal }).catch(console.error);
    } else {
        alert(urlAtivaDoModal);
    }
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    if(urlAtivaDoModal) {
        const qrImageSrc = document.getElementById('qrImage').src;
        const a = document.createElement('a');
        a.href = qrImageSrc;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
