// Lấy ID tour từ URL
const urlPath = window.location.pathname;
const tourId = urlPath.split('/').pop(); // Lấy ID từ URL
async function checkTourDetail(id){
    try{ 
        const response  = await axios.get(`http://localhost:8080/api/TourDetail/TourDetail/exist/${id}`);
            if(response.status==200){
                return response.data;
            }else{
                console.error('Lỗi khi lấy thông tin tour');
                return false;
            }
    }catch(error){
        console.error('Lỗi khi lấy thông tin tour:', error);
        return false;

    }
}


// Hàm lấy thông tin tour từ API
async function getTourDetailById(id) {
    try {
        const response = await axios.get(`http://localhost:8080/api/TourDetail/TourDetails/${id}`);
        if (response.status === 200) {
            const tour = response.data;

            // Cập nhật các trường thông tin
            document.getElementById('detailId').value = tour.id;
            document.getElementById('sightSeeing').value = tour.sightSeeing;
            document.getElementById('cuisine').value = tour.cuisine;
            document.getElementById('suitablePeople').value = tour.suitablePeople;
            document.getElementById('timeSuitable').value = tour.timeSuitable;
            document.getElementById('transport').value = tour.transport;
            document.getElementById('saleDescription').value = tour.saleDescription;
        } else {
            console.error('Lỗi khi lấy thông tin tour');
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tour:', error);
    }
}

// Cập nhật tour thông qua API
async function updateTour() {
    // Lấy các giá trị từ form
 
        const idDetail = document.getElementById('detailId').value
        const sightSeeing =document.getElementById('sightSeeing').value
        const cuisine =document.getElementById('cuisine').value
        const suitablePeople=document.getElementById('suitablePeople').value
        const timeSuitable =document.getElementById('timeSuitable').value
        const transport=document.getElementById('transport').value
        const saleDescription=document.getElementById('saleDescription').value

    const updatedTour = {
        id: idDetail,
        sightSeeing: sightSeeing ,
        cuisine:cuisine ,
        suitablePeople: suitablePeople,
        timeSuitable: timeSuitable,
        transport:transport,
        saleDescription: saleDescription
    };

    try {
        const response = await axios.put(`http://localhost:8080/api/TourDetail/TourDetails`, updatedTour);
        if (response.status === 200) {
            alert("Tour Detail đã được cập nhật thành công!");
            window.location.href = '/tour';  // Chuyển hướng về danh sách tour
        } else {
            console.error('Cập nhật tour thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật tour:', error);
    }
}
async function updateTourv2() {
    // Lấy các giá trị từ form
 
        const idDetail = document.getElementById('detailId').value
        const sightSeeing =document.getElementById('sightSeeing').value
        const cuisine =document.getElementById('cuisine').value
        const suitablePeople=document.getElementById('suitablePeople').value
        const timeSuitable =document.getElementById('timeSuitable').value
        const transport=document.getElementById('transport').value
        const saleDescription=document.getElementById('saleDescription').value

    const updatedTour = {
        id: idDetail,
        sightSeeing: sightSeeing ,
        cuisine:cuisine ,
        suitablePeople: suitablePeople,
        timeSuitable: timeSuitable,
        transport:transport,
        saleDescription: saleDescription,
        tour:{
            id:tourId
        }
    };

    try {
        const response = await axios.post(`http://localhost:8080/api/TourDetail/TourDetail`, updatedTour);
        if (response.status === 200) {
            alert("Tour Detail đã được cập nhật thành công!");
            window.location.href = '/tour';  // Chuyển hướng về danh sách tour
        } else {
            console.error('Cập nhật tour thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật tour:', error);
    }
}


// Khi trang tải xong
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const result = await checkTourDetail(tourId);
        if(result===true)
        getTourDetailById(tourId);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang:', error);
    }
});

// Lắng nghe sự kiện submit của form
const form = document.querySelector('.crudFrom'); 
if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const result = await checkTourDetail(tourId);
        if(result===true){
            updateTour();
        } // Gọi hàm updateTour với ID của tour
        else{
            updateTourv2();
        }
    });
}
const cancelAddTourBtn = document.getElementById('cancelAddTour');
cancelAddTourBtn.addEventListener('click', () => {
    window.location.href = '/tour'; // Quay lại trang danh sách tour
});
