carousel(document.querySelector(".carousel"));

/**
 * Функция-конструктор для карусели
 * @param {Object} root - HTML элемент
 */
function carousel(root) {
	let container = root.querySelector(".carousel-collection"); // HTML элемент, который содержит изображения
  let images = container.children;
  let imagesCount = images.length;
  let angle = 360 / imagesCount; // Стандарт шага угла для одного изображения
  let currentAngle = 0;

	
	setupCarousel(imagesCount, parseFloat(getComputedStyle(images[0]).width));
  // В момент изменения размера окна - ре-инициализировать карусель
	window.addEventListener("resize", () => setupCarousel(imagesCount, parseFloat(getComputedStyle(images[0]).width)));

  /**
   * Стартовая инициализация карусели
   * @param {Number} count количество HTMLImageElement
   * @param {Number} width ширина первого HTMLImageElement
   */
	function setupCarousel(count, width) {
		let apothem = width / (2 * Math.tan(Math.PI / count)); // Рассчёт точки вращения

		container.style.transformOrigin = `50% 50% ${- apothem}px`;

		for (i = 1; i < count; i++) {
			images[i].style.transformOrigin = `50% 50% ${- apothem}px`;
			images[i].style.transform = `rotateY(${i * angle}deg)`;
      
      images[i].setAttribute("draggable", false);
		}
		
		rotateCarousel(currentAngle);
    
    container.addEventListener("mousedown", onMouseDown);

    /**
     * Обработчик событий в момент нажатия левой клавиши мыши
     */
    function onMouseDown(e) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      
      // Относительная позиция курсора в момент клика
      let x = toPercentX(e.clientX);
      /**
       * Обработчик событий в момент отжатия левой клавиши мыши
       */
      function onMouseUp() {
        currentAngle = parseFloat(container.style.transform.match(/-?\d+/g)[0]);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        // console.log(currentAngle, "Стало");
      }
      /**
       * Обработчик событий в момент нажатия левой клавиши мыши и её перемещения
       * @param {MouseEvent} e объект события мыши, в момент её перемещения
       */
      function onMouseMove(e) {
        // На сколько процентов по соотношению с экраном был сдвинут курсор
        let movedByX = x - toPercentX(e.clientX);
        // console.log(`Сдвинуто на: ${movedByX}, было ${currentAngle}`);
        rotateCarousel(currentAngle + movedByX);
      }

      /**
       * Вспомогательная функция перевода координат курсора в проценты
       * @param {Number} position позиция курсора в окне
       * @returns процентное отношение позиции курсора относительно ширины экрана
       */
      function toPercentX(position) {
        return Math.round((position / window.innerWidth * 100));
      }
    }
	}

  /**
   * Вращение контейнера с изображениями вокруг оси Y
   * @param {Number} degree угол вращения
   */
	function rotateCarousel(degree) {
    container.style.transform = `rotateY(${degree}deg)`;
	}
	
}