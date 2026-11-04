let resAPIInfo = async () => {
  try {
    let userId = sessionStorage.getItem('userID');
    let res = await axios.get(`http://localhost:3124/api/v1/users/${userId}`);
    return res.data.data;
  } catch (error) {
    alert('Lỗi call api');
    console.log(error);
    return {
      name: '',
      phone_number: '',
      address: '',
      email: '',
    };
  }
};

// Tạo option để lưu giữ liệu local
let optionTotal = {
  adult: {
    size: 1,
    price: 0,
    sale: 0,
  },
  young: {
    size: 0,
    price: 0,
    sale: 0.6,
  },
  children: {
    size: 0,
    price: 0,
    sale: 0.3,
  },
  baby: {
    size: 0,
    price: 0,
    sale: 0.1,
  },
};

// Hàm gán giá trị cho dữ liệu local
let setValueAttributes = (attribute, name, value) => {
  optionTotal[attribute][name] = value;
};

// Hàm lấy giá trị từ dữ liệu local
let getValueAttributes = (attribute, name) => {
  return optionTotal[attribute][name];
};

// Gán số lượng slot nhiều nhất có thể đặt bởi một người hoặc còn lại của một chuyến đi
let slot = (maximum = 5); //Giá trị slot còn trống trừ 1 slot mặc định

// load info customer
let loadInfoCustomer = async () => {
  let dataUser = await resAPIInfo();
  let customerName = document.querySelector(
    '.customer-info__box .box__item .name'
  );
  let customerPhone = document.querySelector(
    '.customer-info__box .box__item .phonenumber'
  );
  let customerEmail = document.querySelector(
    '.customer-info__box .box__item .email'
  );
  let customerAddress = document.querySelector(
    '.customer-info__box .box__item .address'
  );
  customerName.innerHTML = `${dataUser.name}`;
  customerPhone.innerHTML = `${dataUser.phone_number}`;
  customerEmail.innerHTML = `${dataUser.email}`;
  customerAddress.innerHTML = `${dataUser.address}`;
};
// Gắn giá trị của tour vào trong option lưu cục bộ
let setValueToOptionTotal = () => {
  let tourPrice = parseInt(
    document.querySelector('.customer-bill__tour-price').dataset.tourprice
  );
  setValueAttributes('adult', 'price', tourPrice);
  let youngPrice = getValueAttributes('young', 'sale') * tourPrice;
  setValueAttributes('young', 'price', youngPrice);
  let childrenPrice = getValueAttributes('children', 'sale') * tourPrice;
  setValueAttributes('children', 'price', childrenPrice);
  let babyPrice = getValueAttributes('baby', 'sale') * tourPrice;
  setValueAttributes('baby', 'price', babyPrice);
};

// Hàm hiển thị giá tour với mỗi loại đối tượng ra màn hình
let renderPriceHTML = () => {
  let itemsPrice = document.querySelectorAll('.customer-bill__tour-price');
  itemsPrice.forEach((item) => {
    if (item.classList.contains('adult')) return;
    let type = item.classList[1];
    let price = getValueAttributes(type, 'price');
    item.innerText = Intl.NumberFormat('vi-VN').format(price);
  });
};

// Hàm xử lí cấu hình giá đối với mỗi loại đối tượng tham gia vào tour
let configPriceTour = () => {
  setValueToOptionTotal(); // Gán giá trị
  renderPriceHTML(); // Hiển thị giá lên màn hình
};

let showFinalBill = () => {
  let tourPrice = parseInt(
    document.querySelector('.customer-bill__tour-price.adult').dataset.tourprice
  );
  let salePrice = parseInt(
    document.querySelector('.customer-bill__price-value.sale').dataset.value
  );
  let temp = tourPrice - salePrice;
  temp < 0 ? (temp = 0) : (temp = temp);
  let finalBill = document.querySelector('.customer-bill__final-value-bill');
  finalBill.dataset.value = temp;
  finalBill.innerText = Intl.NumberFormat('vi-VN').format(temp);
};
// Hàm chịu trách nhiệm load HTML sau khi trang tải hoàn tất
let loadHTML = async () => {
  await loadInfoCustomer();
  configPriceTour();
  showFinalBill();
};

// Event
let reloadBill = () => {
  let billCustomer = 0;
  for (let key in optionTotal) {
    billCustomer +=
      parseInt(optionTotal[key].size) * parseInt(optionTotal[key].price);
  }
  document.querySelector('.customer-bill__price-value.customer').innerHTML =
    Intl.NumberFormat('vi-VN').format(billCustomer);
  let salePrice = document.querySelector('.customer-bill__price-value.sale')
    .dataset.value;
  let finalBill = billCustomer - salePrice;
  let finalBillHTML = document.querySelector(
    '.customer-bill__final-value-bill'
  );
  finalBillHTML.innerText = Intl.NumberFormat('vi-VN').format(finalBill);
  finalBillHTML.dataset.value = finalBill;
};

// Hàm cập nhật giá bill sau khi có sự thay đổi
let updateSizeBill = (itemPrice, currentValue) => {
  //* Cập nhật số lượng trong bill
  itemPrice.querySelector(
    '.customer-bill__box-value .customer-bill__value-size'
  ).innerText = currentValue;
  setValueAttributes(itemPrice.dataset.type, 'size', currentValue);
  reloadBill();
};

// Hàm xử lí UI giảm thành viên
let eventDiminishSize = (itemHTML, parentHTML, infoItemHTML, itemPrice) => {
  let currentValue = parseInt(itemHTML.dataset.value);
  if (slot === maximum) {
    // Check điều kiện === maximum trống -> không tính slot mặc định 1
    return;
  }
  if (currentValue === 0) {
    // Check điều kiện nếu value của element đang == 0 thì thoát không thực hiện gì cả
    return;
  }
  if (currentValue === 1 && parentHTML.classList.contains('index')) {
    // kiểm tra điều kiện nếu value của element đang = 1 và đang là element của "Người lớn" thì thoát không cho giảm
    return;
  }
  currentValue--;
  slot++;
  let itemsInfoChildren = infoItemHTML.querySelectorAll(
    '.item__list-customer .item__detail-customer'
  ); // Lấy các thẻ thành phần trong list
  itemsInfoChildren[itemsInfoChildren.length - 1].remove();
  if (currentValue === 0) {
    currentValue = 0;
    parentHTML.classList.add('no-active'); // Thêm class disable
    infoItemHTML.classList.remove('show'); // Xóa class hiện list khách hàng
    itemPrice.classList.add('hide');
  }
  itemHTML.dataset.value = currentValue;
  itemHTML.innerText = currentValue;
  updateSizeBill(itemPrice, currentValue); //* Cập nhật số lượng trong bill và reload giá
};

// Hàm xử lí UI tăng thành viên
let eventIncreaseSize = (itemHTML, parentHTML, infoItemHTML, itemPrice) => {
  let currentValue = parseInt(itemHTML.dataset.value);
  if (slot === 0) {
    swal('Lỗi!', 'Đạt giới hạn số lượng cho phép đặt', 'error');
    return;
  }
  currentValue++;
  slot--;
  if (currentValue === 1) {
    parentHTML.classList.remove('no-active');
    infoItemHTML.classList.add('show');
    itemPrice.classList.remove('hide');
  }
  itemHTML.dataset.value = currentValue; // Cập nhật value của box customer hiện tại
  itemHTML.innerText = currentValue;
  updateSizeBill(itemPrice, currentValue); //* Cập nhật số lượng trong bill và reload giá
  //* Add thành phần khai báo thông tin khách hàng
  let itemsInfoChildren = infoItemHTML.querySelector('.item__list-customer');
  let type = infoItemHTML.dataset.type;
  itemsInfoChildren.innerHTML += `<div class="item__detail-customer" data-type="${type}">
    <div class="customer__name">
      <label for="">Họ tên:</label>
      <input type="text" name="" id="" placeholder="Nhập họ tên" class="customer__input-name">
    </div>
    <div class="customer__gender">
      <label for="">Giới tính</label>
      <select name="" id="" class="customer__input-gender">
        <option value="NAM">Nam</option>
        <option value="NU">Nữ</option>
      </select>
    </div>
    <div class="customer__birthday">
      <label for="">Ngày sinh:</label>
      <input type="date" name="" id="" class="customer__input-birthday">
    </div>
  </div>`;
};

// Hàm xử lí thay đổi số lượng thành viên trong tour
let handleEventChangeSize = () => {
  let itemBoxCustomers = document.querySelectorAll('.member-box__item');
  let boxInfoCustomers = document.querySelectorAll('.customer-info__content');
  let itemsPriceBill = document.querySelectorAll('.customer-bill__item');
  // Gán sự kiện click cho mỗi item
  itemBoxCustomers.forEach((itemBoxCustomer, index) => {
    let buttonDiminish = itemBoxCustomer.querySelector(
      '.member-box__item-right .member-box__button-left'
    );
    let buttonIncrease = itemBoxCustomer.querySelector(
      '.member-box__item-right .member-box__button-right'
    );
    let currentValue = itemBoxCustomer.querySelector(
      '.member-box__current-value'
    );
    // Thêm sự kiện cho các nút
    buttonDiminish.addEventListener('click', () =>
      eventDiminishSize(
        currentValue,
        itemBoxCustomer,
        boxInfoCustomers[index],
        itemsPriceBill[index]
      )
    );
    buttonIncrease.addEventListener('click', () =>
      eventIncreaseSize(
        currentValue,
        itemBoxCustomer,
        boxInfoCustomers[index],
        itemsPriceBill[index]
      )
    );
  });
};

// Hàm xác nhận dữ liệu hợp lệ hay không
let validatedValue = () => {
  let inputNames = document.querySelectorAll('.customer__input-name');
  let inputBirthday = document.querySelectorAll('.customer__input-birthday');
  let size = inputNames.length - 1;
  let check = true;
  let regex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỂếỄỆỈỊỌỎỐỒỔỖỘỚờỞỡỡỤỦỨỪỬỮỰỲỴÝỶỸửữựỲỴÝỶỸ\s]+$/;
  while (size > -1) {
    let value = inputNames[size].value;
    let valueBirthday = inputBirthday[size].value;
    if (value === '' || valueBirthday === '') {
      check = false;
      break;
    }
    if (!regex.test(value)) {
      check = false;
      break;
    }
    size--;
  }
  return check;
};

// Hàm lấy số lượng members tham gia
let getTotalMember = () => {
  let size = 0;
  for (let key in optionTotal) {
    size += optionTotal[key].size;
  }
  return size;
};

// Hàm lấy ngày tour bắt đầu -> Có convert sang giá trị hợp lệ
let getTourStartDate = () => {
  let startDate = document.querySelector(
    '.infor-detail__bottom .text'
  ).innerText;
  let [year, month, date] = startDate.split('-');
  return `${year}-${month}-${date}`;
};

// Hàm lấy các thành viên tham gia trong chuyến đi
let getMembers = () => {
  let membersHTML = document.querySelectorAll('.item__detail-customer');
  let arrayMembers = [];
  membersHTML.forEach((member) => {
    let name = member.querySelector('.customer__input-name').value;
    let gender = member.querySelector('.customer__input-gender').value;
    let birthday = member.querySelector('.customer__input-birthday').value;
    let [year, month, date] = birthday.split('-');
    let bod = new Date(`${year}-${month}-${date}`);
    let role = member.dataset.type;
    let dataMember = {
      name: name,
      gender: gender,
      bod: bod,
      role: role,
    };
    arrayMembers.push(dataMember);
  });
  return arrayMembers;
};

let handleOrderTour = async () => {
  let totalPrice = document.querySelector('.customer-bill__final-value-bill')
    .dataset.value;
  let note = document.querySelector('.customer__note').value;
  let totalMember = getTotalMember();
  let tourId = document.querySelector('.infor-tour-id-span').innerText.trim();
  let userId = sessionStorage.getItem('userID');
  let tourStartDate = getTourStartDate();
  let members = getMembers();
  let data = {
    totalPrice: totalPrice,
    note: note,
    totalMember: totalMember,
    tourId: tourId,
    userTourOrder: {
      user_Id: userId,
      tour_start_date: tourStartDate,
    },
    members: members,
  };
  await localStorage.setItem('dataOrderTour', JSON.stringify(data));
};

let getDataOrder = () => {
  let finalBill = document.querySelector('.customer-bill__final-value-bill')
    .dataset.value;
  let price = parseInt(finalBill) / 23000;
  let name = document.querySelector('.infor-tour-name').innerText;
  let username = document.querySelector('p.name').innerText;
  return {
    name: name,
    description: `${username} đặt tour du lịch tại 3TV tour`,
    price: price.toFixed(2),
  };
};

let handleAbateTour = () => {
  let buttonSubmit = document.querySelector('#btn-submit__order');
  buttonSubmit.addEventListener('click', async () => {
    let check = validatedValue();
    if (!check) {
      swal('Lỗi!', 'Yêu cầu nhập đầy đủ dữ liệu, đầy đủ, đúng!', 'error');
      return;
    } else {
      await handleOrderTour();
      try {
        let data = getDataOrder();
        let res = await axios.post('/api/v1/payment', data);
        window.location.href = res.data.url;
      } catch (error) {
        console.log(error);
        swal('Lỗi!', 'Lỗi thanh toán từ hệ thống', 'error');
      }
    }
  });
};

let loadEventHTML = () => {
  handleEventChangeSize();
  handleAbateTour();
};

// Hiển thị dữ liệu sau khi đã tải trang
window.onload = async () => {
  await loadHTML();
  loadEventHTML();
};
