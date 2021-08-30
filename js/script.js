class Melodia {
   constructor(group, counter, pathFloors, main, modal, viewFlats, pathFlats, flatList) {
      this.counterGroup = document.querySelector(group);
      this.counter = document.querySelectorAll(counter);
      this.pathFloors = document.querySelectorAll(pathFloors);
      this.pathFlats = document.querySelectorAll(pathFlats);
      this.mainImage = document.querySelector(main);
      this.flatList = document.querySelector(flatList);
      this.modal = document.querySelector(modal);
      this.viewFlatsBtn = document.querySelector(viewFlats);
      this.currentCounter = +this.counter[0].textContent;
      this.startSelectedArrow = this.selectedArrow.bind(this);
      this.startSelectedFloor = this.selectedFloor.bind(this);
      this.startSelectedModalFloor = this.selectedModalFloor.bind(this);
      this.startSelectFlat = this.selectFlat.bind(this);
      this.flatLinks = '';
      this.selectedFlat = 0;
      this.setData = [];
   }
   render() {
      if (localStorage.setData) {
         this.setData = JSON.parse(localStorage.setData);
         this.setData.forEach(item => {
            this.currentCounter = item.currentFloor;
            this.selectedFlat = item.currentFlat;
         });
         this.currentFloor();
      } else if (!localStorage.setData || this.setData.length !== 0) {
         this.currentFloor();
      }

   }
   currentFloor() {
      this.pathFloors.forEach((item, index) => {
         if (index === this.currentCounter - 2) {
            item.classList.add('active');
         } else {
            item.classList.remove('active');
         }
      });
      this.setCounter();
   }
   setCounter() {
      if (this.currentCounter < 10) {
         this.counter.forEach(item => item.textContent = `${'0' + this.currentCounter}`);
      } else {
         this.counter.forEach(item => item.textContent = this.currentCounter);
      }
   }
   setLocalStorage() {
      this.setData = [
         {
            currentFloor: this.currentCounter,
            currentFlat: this.selectedFlat
         }
      ];
      localStorage.setData = JSON.stringify(this.setData);
   }
   counterEventListener() {
      this.counterGroup.addEventListener('click', this.startSelectedArrow);
      this.mainImage.addEventListener('click', this.startSelectedFloor);
      this.mainImage.addEventListener('mouseover', this.startSelectedFloor);
      this.modal.addEventListener('click', this.startSelectedModalFloor);
      this.modal.addEventListener('click', this.startSelectFlat);
      this.modal.addEventListener('mouseover', this.startSelectFlat);
      this.viewFlatsBtn.addEventListener('click', this.startSelectedModalFloor);
   }
   selectedArrow(event) {
      const target = event.target;
      if (target.closest('.counter-up')) {
         if (this.currentCounter !== this.pathFloors.length + 1) {
            this.currentCounter += 1;
            this.currentFloor();
            this.setCounter();
         }
      } else if (target.closest('.counter-down')) {
         if (this.currentCounter !== 2) {
            this.currentCounter -= 1;
            this.currentFloor();
            this.setCounter();
         }
      }
      this.setLocalStorage();
   }
   selectedFloor(event) {
      const target = event.target;
      if (event.type === 'click') {
         this.mainImage.removeEventListener('mouseover', this.startSelectedFloor);
         this.modal.classList.toggle('is-open');
      }
      this.pathFloors.forEach((item, index) => {
         if (target === item) {
            this.currentCounter = index + 2;
            item.classList.add('active');
            if (this.currentCounter < 10) {
               this.counter.forEach(item => item.textContent = `${'0' + this.currentCounter}`);
            } else {
               this.counter.forEach(item => item.textContent = this.currentCounter);
            }
         } else {
            item.classList.remove('active');
         }
      });
      if (!target.closest('.active')) {
         this.currentFloor();
      }
      this.setLocalStorage();
   }
   selectedModalFloor(event) {
      const target = event.target;
      if (target.closest('.modal-close-button') || !target.closest('.modal-dialog')) {
         this.modal.classList.toggle('is-open');
         this.mainImage.addEventListener('mouseover', this.startSelectedFloor);
      }
   }
   currentFlat() {
      this.pathFlats.forEach((item, index) => {
         if (index === this.pathFlats.length - (this.selectedFlat + 1)) {
            item.classList.add('active');
         } else {
            item.classList.remove('active');
         }
      });
      this.flatLinks.forEach((item, index) => {
         if (index === this.selectedFlat) {
            item.classList.add('active');
         } else {
            item.classList.remove('active');
         }
      });
   }
   selectFlat(event) {
      const target = event.target;
      if (event.type === 'click') {
         event.preventDefault();
      } else if (event.type === 'mouseover') {
         if (target.closest('.modal-image')) {
            this.pathFlats.forEach((item, index) => {
               if (target === item) {
                  this.flatLinks.forEach(item => item.classList.remove('active'));
                  item.classList.add('active');
                  this.selectedFlat = this.pathFlats.length - (index + 1);
                  this.flatLinks[this.selectedFlat].classList.add('active');
               } else {
                  item.classList.remove('active');
               }
            });
         }
         if (target.closest('.flat-list')) {
            this.flatLinks.forEach((item, index) => {
               if (target === item) {
                  this.pathFlats.forEach(item => item.classList.remove('active'));
                  item.classList.add('active');
                  this.selectedFlat = index;
                  this.pathFlats[this.flatLinks.length - (index + 1)].classList.add('active');
               } else {
                  item.classList.remove('active');
               }
            });
         }
      }
      if (!target.closest('.active')) {
         this.currentFlat();
      }
      this.setLocalStorage();
   }
   init() {
      this.getFlats();
      this.render();
      this.counterEventListener();
   }
   getFlats() {
      fetch('./dbFlats.json')
         .then(response => response.json())
         .then(data => this.floorFlats(data))
         .catch(error => console.error(error));
   }
   floorFlats(data) {
      data.forEach(item => {
         const flatItem = document.createElement('li');
         flatItem.innerHTML = `
            <a href="#" class="flat-link">
            кв. ${item.number}, ${item.type} ${item.size} ${item.unit}
            </a>
         `;
         flatItem.classList.add('flat-item');
         this.flatList.append(flatItem);
      });
      this.flatLinks = document.querySelectorAll('.flat-link');
      this.currentFlat();
   }
}
const melodia = new Melodia('.counter-group',
   '.counter',
   '.home-image>path',
   '.main-image',
   '.modal',
   '.view-flats',
   '.flats>path',
   '.flat-list'
);
melodia.init();