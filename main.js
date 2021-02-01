import galleryItems from "./gallery-items.js";

//объект ссылок на елементы DOM 
const refs = {
    gallery: document.querySelector('.js-gallery'),
    lightbox: document.querySelector('.js-lightbox'),
    lightboxOverlay: document.querySelector('.lightbox__overlay'),
    lightboxImg: document.querySelector('.lightbox__image'),
    modalCloseBtn: document.querySelector('button[data-action="close-lightbox"]'),
};

// Рендерим галерею
renderGallery(galleryItems);

// Слушатели событий
refs.gallery.addEventListener('click', onClickModalOpen);
refs.modalCloseBtn.addEventListener('click', onClickModalClose);
refs.lightboxOverlay.addEventListener('click', onClickOverlayModalClose);

// Ф-ия рендеринга галереи
function renderGallery(images){
    const itemsArray = images.map((image) => {
            const liItemRef = document.createElement('li');
            const linkItemRef = document.createElement('a');
            const imgItemRef = document.createElement('img');
            
            liItemRef.classList.add('gallery__item');
            linkItemRef.classList.add('gallery__link');
            imgItemRef.classList.add('gallery__image');
            
            imgItemRef.src = image.preview;
            imgItemRef.dataset.source = image.original;
            imgItemRef.alt = image.description;

            linkItemRef.appendChild(imgItemRef);
            liItemRef.appendChild(linkItemRef);
            return liItemRef;
        });
    refs.gallery.append(...itemsArray);
}

//Ф-ия открытия модального окна
function onClickModalOpen(event){
    if(!event.target.classList.contains('gallery__image')) return;
    refs.lightbox.classList.add('is-open');
    const originalImgSrc = event.target.dataset.source;
    const originalImgAlt = event.target.alt;
    refs.lightboxImg.src = originalImgSrc;
    refs.lightboxImg.alt = originalImgAlt;

    // Вешаем слушатели кнопок управления контентом в модальном окне
    window.addEventListener('keydown', onPressEscapeModalClose);
    window.addEventListener('keydown', onArrovsPressImagesSwitch);
}

//Ф-ия закрытия модального окна
function onClickModalClose(){
    refs.lightbox.classList.remove('is-open');
    refs.lightbox.src = '';

    // Снимаем слушатели кнопок управления контентом в модальном окне, 
    // чтобы они не срабатывали когда модалка закрыта
    window.removeEventListener('keydown', onPressEscapeModalClose);
    window.removeEventListener('keydown', onArrovsPressImagesSwitch);
}

//Ф-ия закрытия модального окна кликом на фон модалки
function onClickOverlayModalClose(event){
    if(!event.target.classList.contains('lightbox__overlay')) return;
    onClickModalClose();
}

//Ф-ия закрытия модального окна нажатием Escape
function onPressEscapeModalClose(event){
    if(event.code === 'Escape') onClickModalClose();
}

//Ф-ия управления контентом модального окна
function onArrovsPressImagesSwitch(event){
    const srcImagesArray = galleryItems.map(image => image.original);
    const indexOfCurrentImg = srcImagesArray.indexOf(refs.lightboxImg.src);
    const lengthOfImagesArray = srcImagesArray.length - 1;
    
    if (event.code === 'ArrowLeft') {
        if (indexOfCurrentImg > 0) {
        refs.lightboxImg.src = srcImagesArray[indexOfCurrentImg - 1];
        }
        // Сделаем кольцевое перелистывание картинок в модальном окне для левой стрелки
        if (indexOfCurrentImg === 0) {
            refs.lightboxImg.src = srcImagesArray[indexOfCurrentImg + lengthOfImagesArray];
        }
    }
    if (event.code === 'ArrowRight') {
        if (indexOfCurrentImg < lengthOfImagesArray) {
            refs.lightboxImg.src = srcImagesArray[indexOfCurrentImg + 1];
        }
        // Сделаем кольцевое перелистывание картинок в модальном окне для правой стрелки
        if (indexOfCurrentImg === lengthOfImagesArray) {
            refs.lightboxImg.src = srcImagesArray[indexOfCurrentImg - lengthOfImagesArray];
        }
    }
}