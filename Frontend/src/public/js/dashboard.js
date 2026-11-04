async function getTotalOrderByType(type) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/TourOrders/TourOrdersByType/${type}`
    );
    if (response.status == 200) {
      document.getElementById('total-tour-order').innerHTML = response.data;
    } else {
      return;
    }
  } catch (error) {
    console.error('Lỗi khi lấy tổng số tour:', error);
  }
}

function getTotalTourByType(type) {
  document.getElementById('cart-title-total-tour-order').innerHTML =
    '| ' + changeUSToVN(type);
  getTotalOrderByType(type);
}

// Hàm lấy doanh thu
async function getRevenue(type) {
  try {
    const response = await axios.get(`${URL_API_SERVER_V1}/Revenue/${type}`);
    const revenue = response.data; // Lấy dữ liệu từ response
    
    if (response.status === 200) {
      const formattedRevenue = revenue.toLocaleString('en-US', {
        maximumFractionDigits: 3,
      });
      document.getElementById('revenue').innerHTML = formattedRevenue;
    } else {
      return;
    }
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu:', error);
  }
}

function changeUSToVN(type) {
  switch (type) {
    case 'DAY':
      return 'Hôm nay';
    case 'MONTH':
      return 'Tháng';
    case 'YEAR':
      return 'Năm';
  }
}

// Hàm gọi getRevenue khi người dùng chọn giá trị từ dropdown
function getRevenueFromDropdown(type) {
  document.getElementById('card-title-status').innerHTML =
    '| ' + changeUSToVN(type);
  getRevenue(type);
}

async function getTopTour(type) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/TopTour?type=${type}`
    );
    if (response.status === 200) {
      const html =
        response.data.length > 0
          ? response.data
            .map((item) => {
              const formattedTotalPrice = item.totalPrice
                ? Number(item.totalPrice).toLocaleString('en-US', {
                  maximumFractionDigits: 3,
                })
                : '0';
              return `
                    <tr>
                        <td class="list-tour-data">${item.tour.tourId}</td>
                        <td class="list-tour-data"><img src="${item.tour.tourImageLink}" alt=""/></td>
                        <td class="list-tour-data">${item.tour.name}</td>
                        <td class="list-tour-data">${item.quantity}</td>
                        <td class="list-tour-data">${formattedTotalPrice} ₫</td>                                              
                    </tr>
                `;
            })
            .join('')
          : `
                <tr>
                    ${Array(5)
            .fill('<td class="list-tour-data">Không có dữ liệu</td>')
            .join('')}
                </tr>
            `;

      document.getElementById('list-top-tour').innerHTML = html;
    }
  } catch (error) {
    console.log('Lỗi trong quá trình lấy top tour ' + error);
  }
}

function getTopTourByType(type, e) {
  event.preventDefault();
  document.getElementById('card-top-tour-title').innerHTML =
    '| ' + changeUSToVN(type);
  getTopTour(type);
}
function chatArtsTourOrderByMonth() {
  const ctx = document.getElementById('myChart');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [], // Dữ liệu nhãn ban đầu là mảng rỗng
      datasets: [
        {
          label: 'Tour đặt',
          data: [], // Dữ liệu ban đầu là mảng rỗng
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  fetch('http://localhost:8080/api/v1/TourOrders/statsbyMonth') // Thay thế URL này bằng API thật
    .then((response) => response.json())
    .then((data) => {
      // 4. Cập nhật dữ liệu cho biểu đồ
      myChart.data.labels = data.month; // Gán dữ liệu nhãn
      myChart.data.datasets[0].data = data.totalOrder; // Gán dữ liệu biểu đồ

      // 5. Cập nhật lại biểu đồ sau khi thay đổi dữ liệu
      myChart.update();
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}
chatArtsTourOrderByMonth();

let revenueLineChart = null;

async function charArtsRevenueByType(type, event) {
  // Ngừng hành vi mặc định của thẻ <a>
  if (event) {
    event.preventDefault();
  }

  try {
    // Gọi API để lấy dữ liệu
    const response = await axios.get(
      `http://localhost:8080/api/v1/TourOrders/StatsRevenue/${type}`
    );

    // Trích xuất dữ liệu từ response
    const dataFromAPI = response.data;
    let labels;

    if (type === 'DAY') {
      // Nếu là "DAY", hiển thị ngày (yyyy-mm-dd)
      labels = dataFromAPI.map((item) => {
        const date = new Date(item.orderDate);
        return date.toISOString().split('T')[0]; // Chuyển đổi thành định dạng yyyy-mm-dd
      });
    }

    if (type === 'MONTH') {
      // Nếu là "MONTH", hiển thị tháng (Tháng 1, Tháng 2,...)
      labels = dataFromAPI.map((item) => {
        return `Tháng ${item.month}`;
      });
    }

    // Tạo mảng doanh thu
    const revenueData = dataFromAPI.map((item) => parseFloat(item.totalPrice));

    // Dữ liệu cho biểu đồ
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: revenueData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // Cấu hình biểu đồ
    const config = {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Doanh thu (VNĐ)',
            },
          },
          x: {
            title: {
              display: true,
              text: type === 'DAY' ? 'Ngày' : 'Tháng', // Tự động thay đổi tên trục X dựa trên type
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,
            callbacks: {
              title: function (tooltipItem) {
                return type === 'DAY'
                  ? `Ngày: ${tooltipItem[0].label}`
                  : `Tháng: ${tooltipItem[0].label}`; // Hiển thị ngày hoặc tháng trong tooltip
              },
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                return `${tooltipItem.dataset.label
                  }: ${value.toLocaleString()} VNĐ`; // Hiển thị doanh thu
              },
            },
          },
        },
      },
    };

    // Nếu biểu đồ đã tồn tại, hủy bỏ nó
    if (revenueLineChart) {
      revenueLineChart.destroy(); // Hủy bỏ biểu đồ cũ trước khi tạo lại
    }

    // Render biểu đồ mới
    revenueLineChart = new Chart(
      document.getElementById('revenueLineChart'),
      config
    );
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
}
window.onload = function () {
  document.getElementById('card-stats-revenue-title').innerHTML =
    '| ' + changeUSToVN('MONTH');
  changeChartArtRevenue('MONTH');
};
changeChartArtRevenue('MONTH');
function changeChartArtRevenue(type) {
  document.getElementById('card-stats-revenue-title').innerHTML =
    '| ' + (changeUSToVN(type) === 'Hôm nay' ? 'Ngày' : changeUSToVN(type));
  charArtsRevenueByType(type);
}

// Top customer
const customerButton = document.querySelectorAll('.customer__link-option');
const tableCustomer = document.querySelector('.list__customer');
const inforOptionCustomer = document.querySelector('.customer__option');

const getCustomerChangeMonth = async (e) => {
  e.preventDefault();
  console.log(e.target.dataset.value);
  let option = e.target.dataset.value;
  inforOptionCustomer.innerHTML = `| ${option} Tháng`;
  let res = null;
  try {
    res = await axios.get(
      `http://localhost:3124/api/v1/users-top?month=${option}`
    );
  } catch (error) {
    console.log(error);
  }
  if (!res) {
    tableCustomer.innerHTML = `
    <tr>
      <td class="list-tour-data"> Lỗi dữ liệu</td>
      <td class="list-tour-data">Lỗi dữ liệu</td>
      <td class="list-tour-data">Lỗi dữ liệu</td>
      <td class="list-tour-data">Lỗi dữ liệu</td>
      <td class="list-tour-data" style="color: black;">Lỗi dữ liệu</td>
    </tr>
    `;
  } else {
    console.log(res);
    let data = res.data.data;
    console.log(data);
    tableCustomer.innerHTML = ``;
    data.forEach((userInput, index) => {
      let inforUser = userInput.user;
      tableCustomer.innerHTML += `
        <tr>
          <td class="list-tour-data" data-userId="${userInput.userID}"> ${index + 1
        }</td>
          <td class="list-tour-data">${inforUser.name}</td>
          <td class="list-tour-data">${inforUser.phoneNumber}</td>
          <td class="list-tour-data">${inforUser.email}</td>
          <td class="list-tour-data" style="color: black;">${userInput.countTrip
        }</td>
        </tr>  
      `;
    });
  }
};

customerButton.forEach((button) => {
  button.addEventListener('click', getCustomerChangeMonth);
});

// ----Chart
// Hàm vẽ biểu đồ cho khách hàng
async function chartArtTopToup() {
  const urlApi = 'http://localhost:3124/api/v1/tours?option=customer';
  const response = await fetch(urlApi);
  const data = await response.json();

  if (data.errCoder !== 0) {
    console.error('Lỗi khi lấy dữ liệu từ API');
    return;
  }

  const labels = [];
  const values = [];
  let totalMembers = 0;

  data.data.forEach((item) => {
    const countMember = item.tourOrders.countMember;
    if (countMember !== null) {
      const memberCount = parseInt(countMember, 10);
      labels.push(item.tourType.name);
      values.push(memberCount);
      totalMembers += memberCount;
    }
  });

  const percentages = values.map((value) => (value / totalMembers) * 100);

  const ctx = document.getElementById('myPieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: percentages,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const label = tooltipItem.label;
              const value = tooltipItem.raw;
              const countMember = values[tooltipItem.dataIndex];
              return `${label}: ${value.toFixed(
                2
              )}% (${countMember} khách hàng)`;
            },
          },
        },
      },
    },
  });
}

// Hàm vẽ biểu đồ cho loại tour
async function chartArtTourHas() {
  const urlApi = 'http://localhost:3124/api/v1/tours?option=typeTour';
  const response = await fetch(urlApi);
  const data = await response.json();

  if (data.errCoder !== 0) {
    console.error('Lỗi khi lấy dữ liệu từ API');
    return;
  }

  const labels = [];
  const values = [];
  let totalTours = 0;

  data.data.forEach((item) => {
    const countTour = item.countTour;
    if (countTour !== null) {
      const tourCount = parseInt(countTour, 10);
      labels.push(item.tourType.name);
      values.push(tourCount);
      totalTours += tourCount;
    }
  });

  const percentages = values.map((value) => (value / totalTours) * 100);

  const ctx = document.getElementById('myPieChartTour').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: percentages,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const label = tooltipItem.label;
              const value = tooltipItem.raw;
              const tourCount = values[tooltipItem.dataIndex];
              return `${label}: ${value.toFixed(2)}% (${tourCount} tour)`;
            },
          },
        },
      },
    },
  });
}

// Gọi các hàm khi trang đã tải xong
window.onload = function () {
  chartArtTopToup();
  chartArtTourHas();
};


function chartArtTransport() {

  // Lấy dữ liệu từ API
  fetch('http://localhost:8080/api/v1/StasTransportUsed')
    .then(response => response.json())
    .then(data => {
      const dailyUsage = {};

      // Xử lý dữ liệu để nhóm theo ngày và transportId
      data.forEach(item => {
        const orderDate = item.orderDate;  // Lấy ngày từ orderDate
        const transportId = item.transportId;  // Lấy transportId

        // Tạo nhóm cho ngày và phương tiện nếu chưa có
        if (!dailyUsage[orderDate]) {
          dailyUsage[orderDate] = {};
        }
        if (!dailyUsage[orderDate][transportId]) {
          dailyUsage[orderDate][transportId] = 0;
        }

        // Cộng dồn số lượng theo ngày và phương tiện
        dailyUsage[orderDate][transportId] += item.quantity;
      });

      // Tạo dữ liệu cho biểu đồ
      const dates = Object.keys(dailyUsage); // Các ngày
      const transportIds = new Set();

      // Lấy tất cả transportId từ dữ liệu để tạo dataset
      Object.values(dailyUsage).forEach(day => {
        Object.keys(day).forEach(transportId => {
          transportIds.add(transportId);
        });
      });

      const datasets = Array.from(transportIds).map(transportId => {
        const transportNameMap = {
          1: 'Xe',      // transportId = 1 là "Xe"
          2: 'Máy bay'  // transportId = 2 là "Máy bay"
        };
        return {
          label: transportNameMap[transportId], // Sử dụng tên "Xe" hoặc "Máy bay"
          data: dates.map(date => dailyUsage[date][transportId] || 0), // Lấy số lượng theo từng ngày
          backgroundColor: transportId == 1 ? 'rgba(0, 123, 255, 0.6)' : 'rgba(255, 99, 132, 0.6)', // Màu sắc cho mỗi transportId
          borderColor: transportId == 1 ? 'rgba(0, 123, 255, 1)' : 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        };
      });

      // Vẽ biểu đồ với Chart.js
      const ctx = document.getElementById('transportChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',  // Biểu đồ cột
        data: {
          labels: dates,  // Các ngày
          datasets: datasets  // Các phương tiện
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Thời gian'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Lượng sử dụng'
              }
            }
          }
        }
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}
chartArtTransport()