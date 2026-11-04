// Variables
// HTML
const tourList = document.querySelector('.tour-list__item-container');
const totalTours = document.querySelector('.tour-list__text');
const sortToursButton = document.querySelector('.tour-list__sort-box');
const sortDropDown = document.querySelector('.tour-list__box-option');
const optionProvinces = document.querySelectorAll('.tour-filter__option-box');
const tourFilterBox = document.querySelectorAll(
  '.tour-filter__box-input.province'
);
const tourFilterDropdown = document.querySelectorAll(
  '.tour-filter__option-box'
);

const tourFilterOptionBudget = document.querySelectorAll(
  '.tour-filter__option.budget'
);
const tourFilterOptionType = document.querySelectorAll(
  '.tour-filter__option.type'
);
const tourFilterOptionTransport = document.querySelectorAll(
  '.tour-filter__option.transport'
);

const buttonFilter = document.querySelector('.tour-filter__submit');

// Other
let pageNumber = -1; // Tổng số trang
let currentPageNumber = 1; // Số trang hiện tại
let isLoadingAPI = false; // Cờ check đang load trang hay k
let apiGetTours = '';

//* Hàm set lại options params cho url filter tours
let setAPIGetTours = (params) => {
  const startDateQuery = params.startDate
    ? `&startDate=${encodeURIComponent(params.startDate)}`
    : '';
  apiGetTours = `${URL_API_SERVER_V1}/tours/filter-tour?size=10&sort=${params.sort}&minBudget=${params.minBudget || ''}&maxBudget=${params.maxBudget || ''}&departure=${params.departure || ''}&destination=${params.destination || ''}&tourType=${params.tourType || ''}&transportId=${params.transportId || ''}${startDateQuery}`;
};

let currentDay = () => {
  let date = new Date();
  date = date.toISOString().split('T')[0];
  return date;
};

setAPIGetTours({
  sort: 'price,asc',
  minBudget: '',
  maxBudget: '',
  departure: '',
  destination: '',
  tourType: '',
  transportId: '',
  startDate: currentDay(),
});

// Function event click
let toggleEventButton = (button, dropDown, idButton, classDropdown) => {
  // Event
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropDown.classList.toggle('active');
  });

  document.addEventListener('click', (event) => {
    if (
      !event.target.matches(`.${idButton}`) &&
      !event.target.closest(`.${classDropdown}`)
    ) {
      dropDown.classList.remove('active');
    }
  });
};
// * Hàm tạo hiệu ứng cuộn trên box date
let eventScrollDate = () => {
  // Cuộn chuột trong Start date
  let boxStartDate = document.querySelectorAll('.tour-list__item-startDay');
  boxStartDate.forEach((item) => {
    item.addEventListener('wheel', (event) => {
      event.preventDefault();
      item.scrollLeft += event.deltaY;
    });
  });
};

const loadEventHTML = () => {
  // Gán event click
  toggleEventButton(
    sortToursButton,
    sortDropDown,
    sortToursButton.classList[0],
    sortDropDown.classList[0]
  );
  // Thêm event click chọn trong mỗi option của bộ lọc
  tourFilterBox.forEach((filterBox, index) => {
    toggleEventButton(
      filterBox,
      tourFilterDropdown[index],
      filterBox.classList[0],
      tourFilterDropdown[index].classList[0]
    );
  });
  tourFilterOptionBudget.forEach((button) => {
    button.addEventListener('click', (e) => {
      let hasActive = e.target.classList.contains('active');
      if (hasActive) {
        e.target.classList.remove('active');
      } else {
        tourFilterOptionBudget.forEach((button) => {
          button.classList.remove('active');
        });
        e.target.classList.add('active');
      }
    });
  });
  tourFilterOptionTransport.forEach((button) => {
    button.addEventListener('click', (e) => {
      let hasActive = e.target.classList.contains('active');
      if (hasActive) {
        e.target.classList.remove('active');
      } else {
        tourFilterOptionTransport.forEach((button) => {
          button.classList.remove('active');
        });
        e.target.classList.add('active');
      }
    });
  });
  tourFilterOptionType.forEach((button) => {
    button.addEventListener('click', (e) => {
      let hasActive = e.target.classList.contains('active');
      if (hasActive) {
        e.target.classList.remove('active');
      } else {
        tourFilterOptionType.forEach((button) => {
          button.classList.remove('active');
        });
        e.target.classList.add('active');
      }
    });
  });

  // Add sự kiện click lấy giá trị trong mỗi option của điểm đến và đi tour-filter__option-item
  let optionItemsOfDeparturePoint = document.querySelectorAll(
    '.tour-filter__box-input.departure-point .tour-filter__option-box .tour-filter__option-item'
  );
  let boxOptionItemsOfDeparturePoint = document.querySelector(
    '.tour-filter__box-input.departure-point>.tour-filter__box-text'
  );
  optionItemsOfDeparturePoint.forEach((optionItem) => {
    optionItem.addEventListener('click', (e) => {
      let hasActive = e.target.classList.contains('active');
      if (hasActive) return;
      optionItemsOfDeparturePoint.forEach((option) => {
        option.classList.remove('active');
      });
      e.target.classList.add('active');
      boxOptionItemsOfDeparturePoint.innerText = e.target.innerText;
      boxOptionItemsOfDeparturePoint.dataset.value = e.target.dataset.slug;
    });
  });
  //destination
  let optionItemsOfDestination = document.querySelectorAll(
    '.tour-filter__box-input.destination .tour-filter__option-box .tour-filter__option-item'
  );
  let boxOptionItemsOfDestination = document.querySelector(
    '.tour-filter__box-input.destination>.tour-filter__box-text'
  );
  optionItemsOfDestination.forEach((optionItem) => {
    optionItem.addEventListener('click', (e) => {
      let hasActive = e.target.classList.contains('active');
      if (hasActive) return;
      optionItemsOfDestination.forEach((option) => {
        option.classList.remove('active');
      });
      e.target.classList.add('active');
      boxOptionItemsOfDestination.innerText = e.target.innerText;
      boxOptionItemsOfDestination.dataset.value = e.target.dataset.slug;
    });
  });

  // option sorted
  let optionItemSorted = document.querySelectorAll('.tour-list__box-link');
  let boxItemSorted = document.querySelector(
    '.tour-list__sort-box .tour-list__sort-box-text'
  );
  optionItemSorted.forEach((optionItem) => {
    optionItem.addEventListener('click', (e) => {
      let hasActive = e.target.classList.contains('active');
      if (hasActive) return;
      optionItemSorted.forEach((option) => {
        option.classList.remove('active');
      });
      e.target.classList.add('active');
      boxItemSorted.innerText = e.target.innerText;
      boxItemSorted.dataset.value = e.target.dataset.value;
    });
  });

  // Hàm lấy option hiện tại
  let getCurrentOptionn = () => {
    let minBudget = '';
    let maxBudget = '';
    let budget = document.querySelector('.tour-filter__option.budget.active');
    if (budget) {
      minBudget = budget.dataset.minbudget;
      maxBudget = budget.dataset.maxbudget;
    }
    let departurePoint = document.querySelector(
      '.tour-filter__box-input.departure-point>.tour-filter__box-text'
    );
    let destination = document.querySelector(
      '.tour-filter__box-input.destination>.tour-filter__box-text'
    );
    let textDeparturePoint = departurePoint.dataset.value;
    let textDestination = destination.dataset.value;
    let type = document.querySelector('.tour-filter__option.type.active');
    let transport = document.querySelector(
      '.tour-filter__option.transport.active'
    );
    let sorted = document.querySelector('.tour-list__sort-box-text').dataset
      .value;
    let dateValueInput = document.querySelector('.tour-filter__input-date').value;
    let date = '';
    if (dateValueInput) {
      date = new Date(dateValueInput);
      date = date.toISOString().split('T')[0];
    }
    // Tạo option mới cho url filter tours
    let option = {
      sort: sorted,
      minBudget: minBudget,
      maxBudget: !maxBudget ? '' : maxBudget,
      departure: textDeparturePoint,
      destination: textDestination,
      tourType: !type ? `` : type.dataset.id,
      transportId: !transport ? `` : transport.dataset.id,
      startDate: date,
    };
    return option;
  };

  buttonFilter.addEventListener('click', async (e) => {
    e.preventDefault(); // Bỏ sự kiện mặc định của button
    let option = getCurrentOptionn();
    setAPIGetTours(option);
    let res = await resTourList(1);
    if (res.status !== 0) {
      alert(res.message);
      console.log(res.error); // Console.log lỗi
      tourList.innerHTML = ``;
      return;
    }
    let data = res.data;
    // Reset trạng thái về ban đầu
    currentPageNumber = 1;
    pageNumber = data.totalPages; // Gán số trang -> khi scroll gọi lại số lần api
    totalTours.innerHTML = `Chúng tôi tìm thấy <span>${data.totalElements}</span> chương trình tour cho quý khách`;
    let tours = data.content;
    // Gọi hàm chuyển đổi dữ liệu từ API -> HTML
    tourList.innerHTML = ``; // Bỏ các dữ liệu tour cũ trước đó
    generationToursHTML(tours);
    window.addEventListener('scroll', handleScrollRender); // Gán lại sự kiện scroll
  });
};

// Function get api
//* Lấy dữ liệu tours từ API
let resTourList = async (pageNumber) => {
  try {
    let api = `${apiGetTours.toString()}&pageNumber=${pageNumber}`;
    let res = await axios.get(api);
    res = res.data;
    return { status: 0, data: res };
  } catch (error) {
    return {
      status: 3,
      message: 'Hệ thống website hiện đang bị lỗi',
      error: error,
    };
  }
};

// Gọi API tỉnh thành miễn phí từ bên cung cấp thứ 3
let resProvinces = async () => {
  try {
    let res = await axios.get(
      // `https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`
      `http://localhost:3124/api/v1/provinces`
    );
    return {
      status: 0,
      data: {
        size: res.data.data.nItems,
        provinces: res.data.data.data,
      },
    };
  } catch (error) {
    return { status: 3, message: 'Lấy API không thành công', error: error };
  }
};

//* Hàm xử lí chuyển đổi dữ liệu từ API -> HTML
let generationToursHTML = (tours) => {
  let toursHTML = ``; // Biến để lưu trữ dữ liệu chuyển đổi HTML
  // Lưu dữ liệu tour từ API
  tours.forEach((tour) => {
    // Tạo HTML lịch nối vào tour
    calendars = tour.calendar;
    let calendarsHTML = ``;
    calendars.forEach((calendar) => {
      const date = new Date(calendar.calendarStartDate);
      const day = date.getUTCDate(); // Lấy ngày theo UTC
      const month = date.getUTCMonth() + 1; // Tháng (bắt đầu từ 0)
      calendarsHTML += `<li class="tour-list__item-day">${day
        .toString()
        .padStart(2, '0')}/${month.toString().padStart(2, '0')}</li>`;
    });
    // Đổi icon với mỗi phương tiện
    let transport =
      tour.transport.name === 'Máy bay'
        ? `<i class="fa-solid fa-plane"></i>`
        : `<i class="fa-solid fa-bus"></i>`;
    // Xác định loại tour để hiển thị
    tourType = tour.tourType.tourTypeId;
    tourTypeClass = '';
    switch (tourType) {
      case 1:
        tourTypeClass = '--thrifty';
        break;
      case 2:
        tourTypeClass = '--good-price';
        break;
      case 3:
        tourTypeClass = '--standard';
        break;
      case 4:
        tourTypeClass = '--high';
        break;
      default:
        tourType = '--good-price';
        break;
    }
    toursHTML += `
      <div class="tour-list__item">
        <div class="tour-list__item-img">
          <img
            src="${tour.tourImageLink}"
            alt="Ảnh minh họa tour"
            class="tour-img"
          />
          <span class="tour-list__item-type ${tourTypeClass}">
            ${tour.tourType.tourTypeName}
          </span>
        </div>
        <div class="tour-list__item-info">
          <div class="tour-list__item--top">
            <h5 class="tour-list__item-heading">
            ${tour.name}
            </h5>
            <ul class="tour-list__item-box">
              <li class="tour-list__item-col">
                <span class="icon"
                  ><i class="fa-solid fa-ticket"></i>
                </span>
                <span> Mã tour: </span>
                <span class="tour-list__item-value"> ${tour.tourId} 
                </span>
              </li>
              <li class="tour-list__item-col">
                <span class="icon">
                  <i class="fa-solid fa-location-dot"></i>
                </span>
                <span> Khởi hành:</span>
                <span class="tour-list__item-value">
                  ${tour.tourDeparturePoint}
                </span>
              </li>
              <li class="tour-list__item-col">
                <span class="icon">
                  <i class="fa-solid fa-clock"></i>
                </span>
                <span> Thời gian:</span>
                <span class="tour-list__item-value"> 3D4Đ</span>
              </li>
              <li class="tour-list__item-col">
                <span class="icon">
                  ${transport}
                </span>
                <span> Phương tiện:</span>
                <span class="tour-list__item-value"> ${tour.transport.name}
                </span>
              </li>
              <li class="tour-list__item-col --calendar">
                <span class="icon">
                  <i class="fa-solid fa-calendar-days"></i>
                </span>
                <span>Ngày khởi hành:</span>
                <div class="tour-list__item-day-container">
                  <ul class="tour-list__item-startDay">
                    ${calendarsHTML}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div class="tour-list__item--bottom">
            <p class="tour-list__item-price">
              <span>Giá từ:</span> <br />
              ${Intl.NumberFormat('vi-VN').format(tour.tourPrice)} &#x20AB;
            </p>
            <a href="/detail/${tour.tourId}" class="tour-list__item-btn-detail">
              Xem chi tiết
            </a>
          </div>
        </div>
      </div>
    `;
  });
  tourList.innerHTML += toursHTML; // Hiển thị dữ liệu tour
  eventScrollDate();
};

let generationProvincesHTML = (dataProvinces) => {
  let provinces = ``;
  dataProvinces.forEach((province) => {
    provinces += `<li data-slug="${province.slug}" class="tour-filter__option-item">${province.name}</li>`;
  });
  optionProvinces.forEach((listProvinces) => {
    listProvinces.innerHTML += provinces;
  });
};

// Function render HTML
let renderTourList = async () => {
  let res = await resTourList(1);
  if (res.status !== 0) {
    alert(res.message);
    console.log(res.error); // Console.log lỗi
    tourList.innerHTML = ``;
    return;
  }
  let data = res.data;
  pageNumber = data.totalPages; // Gán số trang -> khi scroll gọi lại số lần api
  totalTours.innerHTML = `Chúng tôi tìm thấy <span>${data.totalElements}</span> chương trình tour cho quý khách`;
  let tours = data.content;
  // Gọi hàm chuyển đổi dữ liệu từ API -> HTML
  generationToursHTML(tours);
};

let renderProvinces = async () => {
  let res = await resProvinces();
  if (res.status !== 0) {
    alert(res.message);
    console.log(res.error);
  }
  res = res.data;
  generationProvincesHTML(res.provinces);
};

// Hàm render khi cuộn sử dụng theo infinite scroll
let handleScrollRender = async () => {
  if (isLoadingAPI) return;
  if (currentPageNumber === pageNumber) {
    window.removeEventListener('scroll', handleScrollRender);
    return;
  }
  let heightPage = window.innerHeight * 2; // Lấy chiều cao của màn hình
  let positionBottomTourList = tourList.getBoundingClientRect().bottom; // Lấy vị trí cuối cùng của tour trong list tour
  if (positionBottomTourList <= heightPage && currentPageNumber < pageNumber) {
    isLoadingAPI = true;
    currentPageNumber++;
    let res = await resTourList(currentPageNumber);
    isLoadingAPI = false;
    if (res.status !== 0) {
      alert(res.message);
    }
    let data = res.data;
    let tours = data.content;
    // Gọi hàm chuyển đổi dữ liệu từ API -> HTML
    generationToursHTML(tours);
  }
};

// Hàm set ngày hiện tại trong thẻ input ngày
let setDate = () => {
  let dataInput = document.querySelector('.tour-filter__input-date');
  dataInput.value = '';
  dataInput.min = '';
};

// Hàm tải HTML vào trong trang website
const loadHTML = async () => {
  await renderTourList(); // Tải tours
  await renderProvinces(); // Tải danh sách tỉnh thành
  setDate();
};

// Event action
window.addEventListener('scroll', handleScrollRender);

// Hiển thị dữ liệu sau khi đã tải trang
window.onload = async () => {
  await loadHTML();
  loadEventHTML();
};
