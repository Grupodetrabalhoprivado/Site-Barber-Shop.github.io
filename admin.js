// admin.js - Lógica do Painel Administrativo

// Dados simulados (em produção, viriam de um backend)
let services = [
    { id: 1, name: "Corte Clássico", price: 45.00, image: "https://via.placeholder.com/300x200?text=Corte+Clássico", category: "cortes" },
    { id: 2, name: "Degradê", price: 55.00, image: "https://via.placeholder.com/300x200?text=Degradê", category: "cortes" },
    { id: 3, name: "Barba Completa", price: 35.00, image: "https://via.placeholder.com/300x200?text=Barba+Completa", category: "barbas" },
];

let gallery = [
    { id: 1, image: "https://via.placeholder.com/400x400?text=Trabalho+1", label: "Degradê Moderno" },
    { id: 2, image: "https://via.placeholder.com/400x400?text=Trabalho+2", label: "Barba Alinhada" },
];

// Inicializar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    renderServices();
    renderGallery();
    setupFilePreviewListeners();
});

// Função para mostrar/ocultar seções
function showSection(event, sectionId) {
    event.preventDefault();
    
    // Remover classe active de todas as seções
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover classe active de todos os itens de navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe active à seção e item selecionado
    document.getElementById(sectionId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ── SERVIÇOS ──
function renderServices() {
    const serviceList = document.getElementById('service-list');
    serviceList.innerHTML = '';
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <img src="${service.image}" alt="${service.name}" class="service-card-img">
            <div class="service-card-info">
                <div class="service-card-name">${service.name}</div>
                <div class="service-card-price">R$ ${service.price.toFixed(2).replace(".", ",")}</div>
                <div class="service-card-actions">
                    <button class="btn-edit" onclick="editService(${service.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteService(${service.id})">Excluir</button>
                </div>
            </div>
        `;
        serviceList.appendChild(card);
    });
}

function openServiceModal(serviceId = null) {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    form.reset();
    
    if (serviceId) {
        const service = services.find(s => s.id === serviceId);
        if (service) {
            document.getElementById('service-id').value = service.id;
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-price').value = service.price;
            document.getElementById('service-category').value = service.category;
        }
    } else {
        document.getElementById('service-id').value = '';
    }
    
    modal.classList.add('show');
}

function closeServiceModal() {
    document.getElementById('service-modal').classList.remove('show');
}

function editService(id) {
    openServiceModal(id);
}

function deleteService(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        services = services.filter(s => s.id !== id);
        renderServices();
        alert('Serviço excluído! (Simulação)');
    }
}

function saveService(event) {
    event.preventDefault();
    
    const id = document.getElementById('service-id').value;
    const name = document.getElementById('service-name').value;
    const price = parseFloat(document.getElementById('service-price').value);
    const category = document.getElementById('service-category').value;
    const imageFile = document.getElementById('service-image').files[0];
    
    if (!imageFile && !id) {
        alert('Por favor, selecione uma imagem!');
        return;
    }
    
    // Simular leitura de arquivo local
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            
            if (id) {
                // Editar
                const service = services.find(s => s.id == id);
                if (service) {
                    service.name = name;
                    service.price = price;
                    service.category = category;
                    service.image = imageData;
                }
            } else {
                // Adicionar novo
                const newId = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
                services.push({ id: newId, name, price, category, image: imageData });
            }
            
            renderServices();
            closeServiceModal();
            alert('Serviço salvo! (Simulação)');
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert('Serviço salvo! (Simulação)');
        renderServices();
        closeServiceModal();
    }
}

// ── GALERIA ──
function renderGallery() {
    const galleryList = document.getElementById('gallery-list');
    galleryList.innerHTML = '';
    
    gallery.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-item';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.label}" class="gallery-item-img">
            <div class="gallery-item-label">${item.label}</div>
            <div class="gallery-item-actions">
                <button class="btn-delete" onclick="deleteGalleryItem(${item.id})">Excluir</button>
            </div>
        `;
        galleryList.appendChild(card);
    });
}

function openGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    document.getElementById('gallery-form').reset();
    document.getElementById('gallery-id').value = '';
    modal.classList.add('show');
}

function closeGalleryModal() {
    document.getElementById('gallery-modal').classList.remove('show');
}

function deleteGalleryItem(id) {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
        gallery = gallery.filter(item => item.id !== id);
        renderGallery();
        alert('Imagem excluída! (Simulação)');
    }
}

function saveGallery(event) {
    event.preventDefault();
    
    const imageFile = document.getElementById('gallery-image').files[0];
    const label = document.getElementById('gallery-label').value;
    
    if (!imageFile) {
        alert('Por favor, selecione uma imagem!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        const newId = gallery.length ? Math.max(...gallery.map(item => item.id)) + 1 : 1;
        gallery.push({ id: newId, image: imageData, label });
        
        renderGallery();
        closeGalleryModal();
        alert('Imagem adicionada à galeria! (Simulação)');
    };
    reader.readAsDataURL(imageFile);
}

// ── BARBEIRO ──
function saveBarberInfo(event) {
    event.preventDefault();
    
    const barberData = {
        name: document.getElementById('barber-name').value,
        title: document.getElementById('barber-title').value,
        bio: document.getElementById('barber-bio').value,
        experience: document.getElementById('barber-exp').value,
        clients: document.getElementById('barber-clients').value,
        rating: document.getElementById('barber-rating').value,
    };
    
    const photoFile = document.getElementById('barber-photo').files[0];
    
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            barberData.photo = e.target.result;
            console.log('Dados do Barbeiro Salvos:', barberData);
            alert('Informações do Barbeiro salvas! (Simulação)');
        };
        reader.readAsDataURL(photoFile);
    } else {
        console.log('Dados do Barbeiro Salvos:', barberData);
        alert('Informações do Barbeiro salvas! (Simulação)');
    }
}

// ── CONFIGURAÇÕES ──
function showConfigTab(event, tabId) {
    event.preventDefault();
    
    document.querySelectorAll('.config-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.config-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function saveGeneralInfo(event) {
    event.preventDefault();
    alert('Informações gerais salvas! (Simulação)');
}

function saveContactInfo(event) {
    event.preventDefault();
    alert('Informações de contato salvas! (Simulação)');
}

function saveHours(event) {
    event.preventDefault();
    alert('Horários salvos! (Simulação)');
}

// ── PREVIEW DE IMAGENS ──
function setupFilePreviewListeners() {
    // Preview de foto do barbeiro
    const barberPhotoInput = document.getElementById('barber-photo');
    if (barberPhotoInput) {
        barberPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('barber-preview').src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Preview de imagem de serviço
    const serviceImageInput = document.getElementById('service-image');
    if (serviceImageInput) {
        serviceImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('service-preview');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Preview de imagem da galeria
    const galleryImageInput = document.getElementById('gallery-image');
    if (galleryImageInput) {
        galleryImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('gallery-preview');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Fechar modais ao clicar fora deles
document.addEventListener('click', (e) => {
    const serviceModal = document.getElementById('service-modal');
    const galleryModal = document.getElementById('gallery-modal');
    
    if (e.target === serviceModal) {
        closeServiceModal();
    }
    if (e.target === galleryModal) {
        closeGalleryModal();
    }
});

// Verificar se está logado
function checkAuth() {
    const isLogged = localStorage.getItem('admin_logged');
    if (!isLogged) {
        window.location.href = 'index.html';
    }
}

// Logout
function handleLogout() {
    localStorage.removeItem('admin_logged');
    window.location.href = 'index.html';
}

// Verificar auth ao carregar
checkAuth();
