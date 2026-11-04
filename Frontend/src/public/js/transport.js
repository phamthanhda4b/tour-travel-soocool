const apiUrl = 'http://localhost:8080/api/v1/transports';

// Hàm gọi API để lấy dữ liệu
const fetchTransports = async () => {
    try {
        const response = await axios.get(apiUrl); // Gọi API bằng Axios
        if (response.status === 200) { // Kiểm tra mã trạng thái 200
            return response.data; // Trả về dữ liệu JSON nếu API trả về 200
        } else {
            console.error('Lỗi: API trả về mã trạng thái không hợp lệ:', response.status);
            return []; // Trả về mảng rỗng nếu mã trạng thái không phải 200
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};
// Hàm thêm dòng dữ liệu vào bảng
const appendTransportRow = (transport, transportTable) => {
    const row = document.createElement('div');
    row.className = 'transport__admin--row'; // Áp dụng class CSS dòng dữ liệu
    row.innerHTML = `
        <div class="transport__admin--cell">${transport.id}</div>
        <div class="transport__admin--cell">${transport.name}</div>
    `;
    transportTable.appendChild(row); // Thêm dòng vào bảng
};

// Hàm render dữ liệu lên bảng
const renderTransports = async () => {
    const transports = await fetchTransports(); // Gọi API để lấy dữ liệu
    const transportTable = document.querySelector('.transport__admin--table'); // Bảng hiển thị dữ liệu

    // Xóa dữ liệu cũ trong bảng (nếu có)
    const oldRows = transportTable.querySelectorAll('.transport__admin--row');
    oldRows.forEach(row => row.remove());

    // Kiểm tra dữ liệu và thêm các dòng vào bảng
    if (transports.length > 0) {
        transports.forEach(transport => appendTransportRow(transport, transportTable));
    } else {
        // Hiển thị thông báo nếu không có dữ liệu
        const emptyRow = document.createElement('div');
        emptyRow.className = 'transport__admin--row';
        emptyRow.innerHTML = `
            <div class="transport__admin--cell" colspan="2">Không có dữ liệu phương tiện.</div>
        `;
        transportTable.appendChild(emptyRow);
    }
};

// Gọi hàm render khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    renderTransports();
});
