let vouchers = []; // Mảng lưu trữ dữ liệu voucher sau khi tải về từ API
let voucherById = [];
let pageCurrent = 1;
let size = 10;
let sort = 'id,asc';
let totalPages = 0;

// Hàm chuyển đổi kiểu voucher
function changeTypeVoucher(type) {
  switch (type) {
    case 0:
      return 'Phần trăm';
    case 1:
      return 'Tiền';
    default:
      return 'Không xác định';
  }
}

// Hàm format ngày
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Hàm tải danh sách voucher từ API
async function getVouchers(pageNumber, size, sort) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/vouchers/page?pageNumber=${pageNumber}&size=${size}&sort=${sort}`
    );
    if (response.status === 200) {
      vouchers = response.data.content;
      totalPages = response.data.totalPages;
      document.querySelector('.total-voucher').innerHTML =
        response.data.totalElements;

      if (vouchers.length > 0) {
        renderVouchers(vouchers);
        countValidVouchers(vouchers);
        countExpiredVouchers(vouchers);
        // Cập nhật phân trang
        getPaginationItems(pageCurrent, totalPages); // Truyền currentPage và totalPages
      } else {
        alert('Lỗi khi lấy vouchers');
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách voucher:', error);
  }
}

// Hàm xử lý phân trang
const getPaginationItems = (currentPage, totalPages) => {
  const paginationItems = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(i);
    }
  } else if (currentPage <= 4) {
    paginationItems.push(1, 2, 3, 4, 5, '...', totalPages);
  } else if (currentPage > totalPages - 4) {
    paginationItems.push(
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  } else {
    paginationItems.push(
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    );
  }

  // Tạo HTML
  let pageHtml = `
        <div class="page-item">
            <button class="prev-page ${currentPage === 1 ? 'disabled' : ''
    }">Trước</button>
    `;

  paginationItems.forEach((item) => {
    if (item === '...') {
      pageHtml += `<span class="dots">${item}</span>`;
    } else {
      pageHtml += ` 
                <button class="page-numbers ${item === currentPage ? 'page-number-active' : ''
        }" data-page="${item}">
                    ${item}
                </button>`;
    }
  });

  pageHtml += `
            <button class="next-page ${currentPage === totalPages ? 'disabled' : ''
    }" >Tiếp</button>
        </div>
    `;

  // Gắn HTML vào container phân trang
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = pageHtml;

  // Gắn sự kiện cho nút "Trước"
  document.querySelector('.prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      pageCurrent = currentPage - 1;
      currentPage -= 1;
      getVouchers(currentPage, size, sort); // Gọi lại getVouchers với currentPage mới
    }
  });

  // Gắn sự kiện cho nút "Tiếp"
  document.querySelector('.next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
      pageCurrent = currentPage + 1;
      currentPage += 1;
      getVouchers(currentPage, size, sort); // Gọi lại getVouchers với currentPage mới
    }
  });

  // Xử lý khi nhấn vào số trang
  document.querySelectorAll('.page-numbers').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedPage = parseInt(e.target.getAttribute('data-page'));
      currentPage = selectedPage; // Cập nhật currentPage
      pageCurrent = currentPage;
      getVouchers(currentPage, size, sort); // Gọi lại getVouchers với currentPage mới
    });
  });
};

// Hàm đếm số lượng voucher còn hạn
function countValidVouchers(vouchers) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây thành 0
  const validVouchers = vouchers.filter(
    (voucher) => new Date(voucher.expiryDate) >= today && voucher.status === 1
  );

  document.querySelector('.valid-voucher').innerHTML = validVouchers.length;
}

// Hàm đếm số lượng voucher hết hạn
function countExpiredVouchers(vouchers) {
  const expiredVouchers = vouchers.filter((voucher) => {
    const today = new Date();
    return new Date(voucher.expiryDate) < today && voucher.status === 1;
  });
  document.querySelector('.expiry-voucher').innerHTML = expiredVouchers.length;
}

// Hàm kiểm tra voucher hết hạn
function checkVoucher(expiryDate, status) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return expiry >= today && status === 1
    ? 'voucher__admin--table--rows'
    : 'voucher__admin--table--rows--disable';
}

// Hàm render voucher ra giao diện
function renderVouchers(data) {
  const htmlContainer = document.querySelector('.voucher__admin--table--body');
  const html = data
    .map((voucher) => {
      return `
            <div class=${checkVoucher(
        voucher.expiryDate,
        voucher.status
      )} key=${voucher.id}>
                <div class="voucher__admin--table--data">
                    <input type="radio" name='select__voucher' id="voucher-id" value="${voucher.id
        }" />
                </div>
                <div class="voucher__admin--table--data">${voucher.id}</div>
                <div class="voucher__admin--table--data">${voucher.voucherName
        }</div>
                <div class="voucher__admin--table--data">${changeTypeVoucher(
          voucher.type
        )}</div>
                <div class="voucher__admin--table--data">${voucher.value}</div>
                <div class="voucher__admin--table--data">${formatDate(
          voucher.startDate
        )}</div>
                <div class="voucher__admin--table--data">${formatDate(
          voucher.expiryDate
        )}</div>
            </div>
        `;
    })
    .join('');

  htmlContainer.innerHTML = html;
}

// Hàm xử lý tìm kiếm voucher
function searchVouchers(keyword) {
  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.id.toString().includes(keyword) || // Tìm theo mã
      voucher.voucherName.toLowerCase().includes(keyword.toLowerCase()) // Tìm theo tên
  );
  renderVouchers(filteredVouchers); // Render kết quả tìm kiếm
}

// Gán sự kiện tìm kiếm cho ô nhập liệu
const searchInput = document.querySelector('.action__search--text');
searchInput.addEventListener('input', (event) => {
  const keyword = event.target.value.trim();
  searchVouchers(keyword);
});

// Xử lý sự kiện khi nhấn nút "Thêm mới"
function handleAddNewVoucher() {
  const btnAddNew = document.querySelector('.action__add');
  btnAddNew.addEventListener('click', redirectPage);
}

function redirectPage(event) {
  event.stopPropagation();
  const link = event.target.closest('.action__add').dataset.link;
  if (link) {
    window.location.href = `${link}`;
  }
}

// Xử lý khi nhấn nút "Khóa"
const btnLock = document.querySelector('.action__delete');
btnLock.addEventListener('click', () => {
  const selectedRadio = document.querySelector(
    'input[name="select__voucher"]:checked'
  );
  if (selectedRadio) {
    if (window.confirm("Bạn có muốn khóa voucher này không")) {
      const selectedVoucherId = selectedRadio.value;
      updateStatusVoucher(selectedVoucherId, -1);
    }
  } else {
    alert('Bạn chưa chọn voucher để khóa');
  }
});

// Cập nhật trạng thái voucher
async function updateStatusVoucher(id, status) {
  try {
    const response = await axios.put(
      `${URL_API_SERVER_V1}/vouchers/${id}/${status}`
    );
    if (response.data) {
      alert('Cập nhật trạng thái thành công');
      getVouchers(pageCurrent, size, sort); // Tải lại danh sách voucher
    } else {
      alert('Cập nhật trạng thái thất bại');
    }
  } catch (error) {
    console.error('Cập nhật trạng thái thất bại:', error);
  }
}

// Lấy voucher theo ID
async function fetchVoucherById(id) {
  try {
    const response = await axios.get(
      `${URL_API_SERVER_V1}/vouchers/voucherId/${id}`
    );
    if (response.status === 200) {
      voucherById = response.data;
    } else {
      alert('Lấy voucher bằng id thất bại');
    }
  } catch (error) {
    console.error('Lỗi khi lấy voucher:', error);
  }
}

function checkExpiryVoucher(expiryDate) {
  const today = new Date();
  const expirationDate = new Date(expiryDate);
  return expirationDate >= today ? true : false;
}

// Xử lý khi nhấn nút "Làm mới"
const btnRefresh = document.querySelector('.action__refresh');
btnRefresh.addEventListener('click', async () => {
  const selectedRadio = document.querySelector(
    'input[name="select__voucher"]:checked'
  );
  if (selectedRadio) {
    const selectedVoucherId = selectedRadio.value;
    await fetchVoucherById(selectedVoucherId);

    if (checkExpiryVoucher(voucherById.expiryDate)) {
      updateStatusVoucher(selectedVoucherId, 1); // Cập nhật trạng thái voucher thành "hoạt động"
    } else {
      if (
        window.confirm(
          'Voucher đã hết hạn. Bạn cần gia hạn thêm mới có thể làm mới voucher'
        )
      ) {
        window.location.href = `/voucher/modify/${selectedVoucherId}`;
      }
    }
  } else {
    alert('Bạn chưa chọn voucher để làm mới');
  }
});

// Xử lý khi nhấn nút "Sửa"
const btnModify = document.querySelector('.action__lock');
btnModify.addEventListener('click', () => {
  const selectedRadio = document.querySelector(
    'input[name="select__voucher"]:checked'
  );
  if (selectedRadio) {
    const selectedVoucherId = selectedRadio.value;
    window.location.href = `/voucher/modify/${selectedVoucherId}`;
  } else {
    alert('Bạn chưa chọn voucher để sửa');
  }
});

// Khởi động trang khi tải
document.addEventListener('DOMContentLoaded', () => {
  getVouchers(pageCurrent, size, sort);
  handleAddNewVoucher();
});
